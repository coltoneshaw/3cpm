import store from '@/app/redux/store'

import {
    setData,
    setIsSyncing,
    setSyncData,
    setAutoRefresh
} from '@/app/redux/threeCommas/threeCommasSlice'
import { initialState } from '@/app/redux/threeCommas/initialState'

import { updateLastSyncTime } from '@/app/redux/config/configSlice'
import { updateBannerData } from '@/app/Features/UpdateBanner/redux/bannerSlice'
import type { Type_Profile, Type_ReservedFunds } from '@/types/config';
import type { Type_Query_bots, Type_Query_PerfArray } from '@/types/3Commas'
import dotProp from 'dot-prop';


// Utilities
import {
    fetchDealDataFunction, fetchPerformanceDataFunction, getActiveDealsFunction,
    fetchBotPerformanceMetrics, fetchPairPerformanceMetrics, botQuery, getAccountDataFunction, updateThreeCData, fetchSoData
} from '@/app/Features/3Commas/3Commas';

/*
 * 
 * Dispatch functions
 * 
 * Each has a strict accepted object that's defined in threeCommas/initialState.
 */

const dispatch_setBotData = (data: typeof initialState.botData) => store.dispatch(setData({ type: 'botData', data: data ?? initialState.botData }));
const dispatch_setProfitData = (data: typeof initialState.profitData) => store.dispatch(setData({ type: 'profitData', data: data ?? initialState.profitData }));

// TODO - Need this to properly know when something is undefined. 
const dispatch_setMetricsData = (data: any) => store.dispatch(setData({ type: 'metricsData', data: data ?? initialState.metricsData }));
const dispatch_setPerformanceData = (data: typeof initialState.performanceData) => store.dispatch(setData({ type: 'performanceData', data: data ?? initialState.performanceData }));
const dispatch_setActiveDeals = (data: typeof initialState.activeDeals) => store.dispatch(setData({ type: 'activeDeals', data: data ?? initialState.activeDeals }));
const dispatch_setAccountData = (data: typeof initialState.accountData) => store.dispatch(setData({ type: 'accountData', data: data ?? initialState.accountData }));
const dispatch_setBalanceData = (data: typeof initialState.balanceData) => store.dispatch(setData({ type: 'balanceData', data: data ?? initialState.balanceData }));


/*
 * 
 * Fetching data logic
 * 
 * These functions are responsible for fetching the related data from the local database, then updating the current state
 */

const fetchAndStoreBotData = async (currentProfile: Type_Profile, update: boolean) => {
    try {
        await botQuery(currentProfile)
            .then(result => {
                // if (!result) return
                if (update && result.length > 0) dispatch_setBotData(result)
                const inactiveBotFunds = result.filter(b => b.is_enabled === 1).map(r => r.enabled_inactive_funds)
                // pull enabled_inactive_funds from the bots and add it to metrics.
                dispatch_setMetricsData({ inactiveBotFunds: (inactiveBotFunds.length > 0) ? inactiveBotFunds.reduce((sum, funds) => sum + funds) : 0 })

            })
    } catch (error) {
        console.error(error)
    }
}

const fetchAndStoreProfitData = async (profileData: Type_Profile) => {
    await fetchDealDataFunction(profileData)
        .then(data => {
            if (!data) return
            const { profitData, metrics } = data
            dispatch_setProfitData(profitData)
            dispatch_setMetricsData(metrics)
        })
}

const fetchAndStorePerformanceData = async (profileData: Type_Profile) => {


    const pair_bot = async () => await fetchPerformanceDataFunction(profileData, undefined)
        .then(((data: Type_Query_PerfArray[]) => {
            if (!data || data.length === 0) return
            console.log('updated Performance Data!')

            dispatch_setPerformanceData({ pair_bot: data })

            const metrics = {
                boughtVolume: (data.length > 0) ? data.map(deal => deal.bought_volume).reduce((sum: number, item: number) => sum + item) : 0,
                totalProfit_perf: (data.length > 0) ? data.map(deal => deal.total_profit).reduce((sum: number, item: number) => sum + item) : 0,
                totalDeals: (data.length > 0) ? data.map(deal => deal.number_of_deals).reduce((sum: number, item: number) => sum + item) : 0
            }

            dispatch_setMetricsData(metrics)

        }))

    const bot = async () => await fetchBotPerformanceMetrics(profileData, undefined)
        .then((data => {
            if (!data) return
            console.log('getting bot performance metrics')
            dispatch_setPerformanceData({ bot: data })
        }))

    const pair = async () => await fetchPairPerformanceMetrics(profileData, undefined)
        .then((data => {
            if (!data) return
            console.log('getting bot performance metrics')
            dispatch_setPerformanceData({ pair: data })
        }))

    const so = async () => await fetchSoData(profileData, undefined)
        .then((data => {
            if (!data) return
            console.log('getting SO performance metrics')
            dispatch_setPerformanceData({ safety_order: data })
        }))

    await Promise.all([pair_bot(), bot(), pair(), so()])
}

const fetchAndStoreActiveDeals = async (profileData: Type_Profile) => {
    await getActiveDealsFunction(profileData)
        .then(data => {
            if (!data) return
            console.log('updated active deals and related metrics!')
            const { activeDeals, metrics } = data

            dispatch_setActiveDeals(activeDeals)
            dispatch_setMetricsData({ ...metrics, activeDealCount: activeDeals.length })


        })
}

const fetchAndStoreAccountData = async (profileData: Type_Profile) => {
    await getAccountDataFunction(profileData)
        .then(data => {
            if (!data || !data.accountData || data.accountData.length === 0) return
            const { accountData, balance } = data
            dispatch_setAccountData(accountData)

            // this data may be in more spots than needed.
            dispatch_setBalanceData(balance)
            dispatch_setMetricsData(balance)

        })
}


const undefToZero = (value: number | undefined) => ((value) ? value : 0)

const calculateMetrics = () => {
    const { config, threeCommas } = store.getState()
    const { maxRisk, totalBoughtVolume, position, on_orders, inactiveBotFunds } = threeCommas.metricsData
    const reservedFundsArray = <Type_ReservedFunds[]>config.currentProfile.statSettings.reservedFunds

    const LOCAL_on_orders = undefToZero(on_orders)
    const LOCAL_position = undefToZero(position)
    const LOCAL_totalBoughtVolume = undefToZero(totalBoughtVolume)
    const LOCAL_maxRisk = undefToZero(maxRisk + inactiveBotFunds)

    // Position = available + on orders.
    const reservedFundsTotal = (reservedFundsArray.length) ? reservedFundsArray.filter(account => account.is_enabled).map(account => Number(account.reserved_funds)).reduce((sum, item) => sum + item) : 0
    const availableBankroll = LOCAL_position - LOCAL_on_orders - reservedFundsTotal
    const totalInDeals = LOCAL_on_orders + LOCAL_totalBoughtVolume
    const totalBankroll = LOCAL_position + LOCAL_totalBoughtVolume - reservedFundsTotal


    console.log({
        maxRiskPercent: Number(((LOCAL_maxRisk / totalBankroll) * 100).toFixed(0)),
        bankrollAvailable: Number(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
        totalBankroll,
        availableBankroll,
        totalInDeals,
        reservedFundsArray,
        totalMaxRisk: LOCAL_maxRisk,
        maxRisk,
        inactiveBotFunds
    })

    // active sum already includes on_orders.

    // TODO - May need to remove the `toFixed` here.

    dispatch_setMetricsData({
        maxRiskPercent: Number(((LOCAL_maxRisk / totalBankroll) * 100).toFixed(0)),
        bankrollAvailable: Number(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
        totalBankroll,
        availableBankroll,
        totalInDeals,
        reservedFundsTotal,
        totalMaxRisk: LOCAL_maxRisk
    })

}


/**
 * 
 * Syncing Logic functions
 * 
 * These are responsible for kicking off the update sequence
 * 
 */

const preSyncCheck = (profileData: Type_Profile) => {

    if (!profileData || dotProp.has(profileData, 'profileData.apis.threeC') ||
        dotProp.has(profileData, 'profileData.apis.threeC.key') ||
        dotProp.has(profileData, 'profileData.apis.threeC.secret') ||
        dotProp.has(profileData, 'profileData.apis.threeC.mode')
    ) {
        console.error('missing api keys or required profile')
        return false
    }

    return profileData
}

const updateAllData = async (offset: number = 1000, profileData: Type_Profile, type: 'autoSync' | 'fullSync', callback?: CallableFunction) => {

    if (!preSyncCheck(profileData)) return

    const syncOptions = store.getState().threeCommas.syncOptions
    store.dispatch(setIsSyncing(true))

    const originalTime = syncOptions.time || new Date().getTime()
    let time = originalTime
    let syncCount = syncOptions.syncCount || 0
    if (type === 'fullSync') {
        syncCount = 0
        time = 0
    }
    const options = {
        syncCount,
        time,
        offset
    }

    try {
        await updateThreeCData(type, options, profileData)
            .then(async (lastSyncTime) => {
                await updateAllDataQuery(profileData, type)
                return lastSyncTime;
            })
            .then((lastSyncTime) => {
                store.dispatch(setSyncData({
                    syncCount: (type === 'autoSync') ? options.syncCount + 1 : 0,
                    // don't override syncOptions.time in case of a fullSync
                    // because there might be a concurrent autoSync running
                    time: (type === 'autoSync') ? originalTime + 15000 : originalTime
                }))
                store.dispatch(updateLastSyncTime({ data: lastSyncTime }))
            })

    } catch (error) {
        console.error(error)
        store.dispatch( updateBannerData({show: true, message: 'Error updating your data. Check the console for more information.', type: 'apiError'}))
    } finally {
        if (callback) callback()
        store.dispatch(setIsSyncing(false))
    }
}


const syncNewProfileData = async (offset: number = 1000, editingProfile: Type_Profile) => {
    // const updatedProfile = {...profileData, syncStatus: { deals: {lastSyncTime: null}}}
    // const profileData = store.getState().settings.editingProfile

    if (!preSyncCheck(editingProfile)) return

    store.dispatch(setIsSyncing(true))

    const options = { syncCount: 0, summary: false, notifications: false, time: 0, offset }
    let success;
    try {
        await window.ThreeCPM.Repository.Config.profile('create', editingProfile, editingProfile.id)
            .then(async () => {
                await updateThreeCData('newProfile', options, editingProfile)
                    .then(async () => await updateAllDataQuery(editingProfile, 'fullSync'))
            })

        success = true;
    } catch (error) {
        console.error(error)
        alert('Error updating your data. Check the console for more information.')
        success = false;
    } finally {
        store.dispatch(setIsSyncing(false))
        return success;
    }
}





const updateAllDataQuery = (profileData: Type_Profile, type: string) => {

    // if the type if fullSync this will store the bot data. If we store the bot data in the redux state it will overwrite any user changes. 
    Promise.all([
        fetchAndStoreBotData(profileData, type === 'fullSync'),
        fetchAndStoreProfitData(profileData),
        fetchAndStorePerformanceData(profileData),
        fetchAndStoreActiveDeals(profileData),
        fetchAndStoreAccountData(profileData)
    ])
        .then(() => calculateMetrics())


}



const refreshFunction = (method: string, offset?: number) => {

    // updating the refresh function here to 15000 instead of 50. The update bar doesn't work anymore
    const refreshRate = 15000

    if (!store.getState().threeCommas.autoRefresh) return
    switch (method) {
        case 'stop':
            store.dispatch(setAutoRefresh(false))
            break
        case 'run':
            setTimeout(() => {
                const profileData = preSyncCheck(store.getState().config.currentProfile)
                if (!profileData) {
                    refreshFunction('stop')
                    return
                }

                if (!store.getState().threeCommas.autoRefresh) return
                updateAllData(offset, profileData, 'autoSync', undefined)
                    .then(() => {
                        refreshFunction('run', offset)
                    })
            }, refreshRate);
    }
}




export {
    fetchAndStoreBotData,
    fetchAndStoreProfitData,
    fetchAndStorePerformanceData,
    fetchAndStoreActiveDeals,
    fetchAndStoreAccountData,
    updateAllData,
    refreshFunction,
    updateAllDataQuery,
    syncNewProfileData
}