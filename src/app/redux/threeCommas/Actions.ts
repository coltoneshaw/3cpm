import store from '@/app/redux/store'

import {
    setData,
    setIsSyncing,
    setSyncData,
    trackAutoRefreshProgress,
    resetAutoRefresh,
    stopAutoRefresh
} from '@/app/redux/threeCommas/threeCommasSlice'
import { initialState } from '@/app/redux/threeCommas/initialState'

import type { Type_Profile, Type_ReservedFunds } from '@/types/config';
import type {Type_Query_PerfArray} from '@/types/3Commas'



// Utilities
import {
    fetchDealDataFunction, fetchPerformanceDataFunction, getActiveDealsFunction,
    fetchBotPerformanceMetrics, fetchPairPerformanceMetrics, botQuery, getAccountDataFunction, updateThreeCData
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

const fetchAndStoreBotData = async (currentProfile: Type_Profile) => {
    try {
        // @ts-ignore
        await electron.api.updateBots(currentProfile)

        // @ts-ignore
        botQuery(currentProfile)
            .then(result => {
                if (!result) return
                dispatch_setBotData(result)

            })
    } catch (error) {
        console.error(error)
    }
}

const fetchAndStoreProfitData = (profileData: Type_Profile) => {
    fetchDealDataFunction(profileData)
        .then(data => {
            if (!data) return
            const { profitData, metrics } = data
            dispatch_setProfitData(profitData)
            dispatch_setMetricsData(metrics)
        })
}

const fetchAndStorePerformanceData = (profileData: Type_Profile) => {

    fetchPerformanceDataFunction(undefined, profileData)
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

    fetchBotPerformanceMetrics(undefined, profileData)
        .then((data => {
            if (!data) return
            console.log('getting bot performance metrics')
            dispatch_setPerformanceData({ bot: data })
        }))

    fetchPairPerformanceMetrics(undefined, profileData)
        .then((data => {
            if (!data) return
            console.log('getting bot performance metrics')
            dispatch_setPerformanceData({ pair: data })
        }))
}

const fetchAndStoreActiveDeals = (profileData: Type_Profile) => {
    getActiveDealsFunction(profileData)
        .then(data => {
            if (!data) return
            console.log('updated active deals and related metrics!')
            const { activeDeals, metrics } = data

            dispatch_setActiveDeals(activeDeals)
            dispatch_setMetricsData({ ...metrics, activeDealCount: activeDeals.length })


        })
}

const fetchAndStoreAccountData = (profileData: Type_Profile) => {
    getAccountDataFunction(profileData)
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
    const {config, threeCommas} = store.getState()
    const { maxRisk, totalBoughtVolume, position, on_orders } = threeCommas.metricsData
    const reservedFundsArray = <Type_ReservedFunds[]>config.currentProfile.statSettings.reservedFunds

    const LOCAL_on_orders = undefToZero(on_orders)
    const LOCAL_position = undefToZero(position)
    const LOCAL_totalBoughtVolume = undefToZero(totalBoughtVolume)
    const LOCAL_maxRisk = undefToZero(maxRisk)

    // Position = available + on orders.
    const reservedFundsTotal = (reservedFundsArray.length) ? reservedFundsArray.filter(account => account.is_enabled).map(account => account.reserved_funds).reduce((sum: number, item: number) => sum + item) : 0
    const availableBankroll = LOCAL_position - LOCAL_on_orders - reservedFundsTotal
    const totalInDeals = LOCAL_on_orders + LOCAL_totalBoughtVolume
    const totalBankroll = LOCAL_position + LOCAL_totalBoughtVolume - reservedFundsTotal


    console.log({
        maxRiskPercent: Number(((LOCAL_maxRisk / totalBankroll) * 100).toFixed(0)),
        bankrollAvailable: Number(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
        totalBankroll,
        availableBankroll,
        totalInDeals,
        reservedFundsArray
    })

    // active sum already includes on_orders.

    dispatch_setMetricsData({
        maxRiskPercent: Number(((LOCAL_maxRisk / totalBankroll) * 100).toFixed(0)),
        bankrollAvailable: Number(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
        totalBankroll,
        availableBankroll,
        totalInDeals,
        reservedFundsTotal
    })

}


/**
 * 
 * Syncing Logic functions
 * 
 * These are responsible for kicking off the update sequence
 * 
 */


const updateAllData = async (offset: number = 1000, profileData: Type_Profile, type: 'autoSync' | 'fullSync', callback?: CallableFunction, ) => {

    const syncOptions = store.getState().threeCommas.syncOptions
    store.dispatch(setIsSyncing(true))

        let syncCount = (syncOptions.syncCount) ? syncOptions.syncCount : 0

        const options = {
            syncCount,
            summary: (syncOptions.summary) ? syncOptions.summary : false,
            notifications: (syncOptions.notifications) ? syncOptions.notifications : false,
            time: (syncOptions.time) ? syncOptions.time : 0,
            offset
        }

        try {
            await updateThreeCData(type, options, profileData)
                .then(async () => {
                    fetchAndStoreBotData(profileData),
                    fetchAndStoreProfitData(profileData),
                    fetchAndStorePerformanceData(profileData),
                    fetchAndStoreActiveDeals(profileData),
                    fetchAndStoreAccountData(profileData)
                })
                .then(() => { 
                    calculateMetrics()
                    store.dispatch(setSyncData({
                        syncCount: syncCount++,
                        time: options.time + 15000
                    }))
                })
            
        } catch (error) {
            console.error(error)
            alert('Error updating your data. Check the console for more information.')
        } finally {
            if(callback) callback()
            store.dispatch(setIsSyncing(false))
        }
}

const refreshFunction = (method:string, offset?:number) => {
    const refreshRate = 50

    if(!store.getState().threeCommas.autoRefresh.active) {
        store.dispatch(resetAutoRefresh())
        return
    }


    switch (method) {
        case 'stop' :
            store.dispatch(stopAutoRefresh())
            break

        case 'run' :
            const profileData = store.getState().config.currentProfile

            setTimeout(() => {
                store.dispatch(trackAutoRefreshProgress(refreshRate))

                if (store.getState().threeCommas.autoRefresh.current < store.getState().threeCommas.autoRefresh.max) {
                    refreshFunction('run', offset)
                    return
                }


                updateAllData(offset, profileData, 'autoSync', undefined)
                    .then(() => {
                        store.dispatch(resetAutoRefresh())
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
    refreshFunction
}