import React, { createContext, useState, useEffect} from 'react';

// Context Providers
import { useAppSelector } from '@/app/redux/hooks';


import {
    Type_Query_PerfArray,
    Type_Query_bots,
    Type_ActiveDeals,
    Type_Query_Accounts,
    Type_MetricData,
    Type_Profit,
    Type_Bot_Performance_Metrics,
    Type_Performance_Metrics,
    Type_Pair_Performance_Metrics,
    Type_SyncOptions

} from '@/types/3Commas'

// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const DataContext = createContext<Type_Data_Context>();

// Utilities
import {
    fetchDealDataFunction,
    fetchPerformanceDataFunction,
    getActiveDealsFunction,
    updateThreeCData,
    getAccountDataFunction,
    fetchBotPerformanceMetrics,
    fetchPairPerformanceMetrics,
    botQuery
} from '@/app/Features/3Commas/3Commas';

import { Type_ReservedFunds, Type_Profile } from '@/types/config'


const defaultBalance = {
    on_orders: 0,
    position: 0,
}

const defaultMetrics = {
    totalBoughtVolume: 0,
    maxRisk: 0,
    totalProfit: 0,
    maxRiskPercent: 0,
    bankrollAvailable: 0,
    totalBankroll: 0,
    position: 0,
    on_orders: 0,
    totalInDeals: 0,
    reservedFundsTotal: 0,
    totalClosedDeals: 0
}


interface Type_Data_Context {
    actions: {
        runTestData: any
        fetchProfitMetrics: any
        fetchPerformanceData: any
        getActiveDeals: any
        getAccountData: any
        fetchBotData: any
        calculateMetrics: any
        updateAllData: any
    },
    data: {
        botData: Type_Query_bots[]
        profitData: Type_Profit[]
        activeDeals: Type_ActiveDeals[]
        performanceData: Type_Performance_Metrics
        balanceData: { on_orders: number, position: number }
        metricsData: Type_MetricData
        additionalData: { accountName: string[] }[]
        accountData: Type_Query_Accounts[]
        isSyncing: boolean
    },
    autoSync: {
        buttonEnabled: boolean
        setButtonEnabled: any // needs to be adjusted,
        syncOptions: Type_SyncOptions
        setSyncOptions: any
    }
}



/**
 * 
 * This needs to be nested under the config context as it'll use that!
 */
const DataProvider = ({ children }: any) => {
    const {currentProfile, config} = useAppSelector(state => state.config);

    const reservedFunds = currentProfile.statSettings.reservedFunds


    const profileData =  {
        defaultCurrency: currentProfile.general.defaultCurrency,
        reservedFunds: currentProfile.statSettings.reservedFunds,
        startDate: currentProfile.statSettings.startDate,
        currentProfileID: config.current
    }

    // const [reservedFunds, updateReservedFunds] = useState(() => currentProfile.statSettings.reservedFunds);
    const [currentProfileId, updateCurrentProfileId] = useState(() => config.current)

    useEffect(() => {
        updateCurrentProfileId(config.current)
    }, [config])

    // useEffect(() => {
    //     if(currentProfile.statSettings.reservedFunds) updateReservedFunds(currentProfile.statSettings.reservedFunds)
    // },[currentProfile.statSettings.reservedFunds])

    const [botData, updateBotData] = useState<Type_Query_bots[]>([])
    const [profitData, updateProfitData] = useState<Type_Profit[]>([])
    const [activeDeals, updateActiveDeals] = useState<Type_ActiveDeals[]>([])
    const [performanceData, updatePerformanceData] = useState<Type_Performance_Metrics>({ pair_bot: [], bot: [] })
    const [balanceData, setBalanceData] = useState(() => defaultBalance)
    const [accountData, setAccountData] = useState<Type_Query_Accounts[]>([])
    const [metricsData, updateMetricsData] = useState(() => defaultMetrics)
    const [additionalData, setAdditionalData] = useState<{ accountName: string[] }[]>([])
    const [isSyncing, updateIsSyncing] = useState(false)


    // @ts-ignore
    useEffect(async () => {
        // updateIsSyncing(true)
        try {
            console.error('updating the current profile!')
            await fetchBotData(currentProfile)
            await fetchProfitMetrics(currentProfile)
            await fetchPerformanceData(currentProfile)
            await getActiveDeals(currentProfile)
            await getAccountData(currentProfile)
            // updateIsSyncing(false)

        } catch (error) {
            console.error(error)
            updateIsSyncing(false)
        }
    }, [currentProfileId])

    /**
     * checking if any of the numbers needed have changed, if so then we pull the data.
     */
    useEffect(() => {
        calculateMetrics()
    }, [metricsData.position, metricsData.totalBoughtVolume, metricsData.maxRisk, currentProfile])


    const fetchBotData = async (currentProfile?: Type_Profile) => {

        try {
            // @ts-ignore
            await electron.api.updateBots(currentProfile)

            // @ts-ignore
            botQuery(currentProfile)
                .then((result: Type_Query_bots[]) => {
                    if(!result) return
                    updateBotData(result ?? [])
                })
        } catch (error) {
            console.error(error)
        }

    }


    /**
     * @data - returns the profit array data; { utc_date, profit, running sum }
     * @metrics - returns just TotalProfit
     * Confirmed working
     */
    const fetchProfitMetrics = (profileData?: Type_Profile) => {
        fetchDealDataFunction(profileData)
            .then(data => {
                if(!data) return

                // TODO - look into getting autocomplete working here.
                const { profitData, metrics } = data
                updateProfitData(profitData)
                // this just updates the totalProfit metric
                updateMetricsData(prevData => {
                    return {
                        ...prevData,
                        ...metrics
                    }
                })
            })
    }


    /**
     * @data - returns an array with a `bot_id - pair` key that's unique. Only specific data on that pair that's needed.
     * Update the database query for more.
     * Confirmed working
     */
    const fetchPerformanceData = (profileData?: Type_Profile) => {
        
        fetchPerformanceDataFunction(undefined, profileData)
            .then(((data: Type_Query_PerfArray[]) => {
                if(!data) return
                console.log('updated Performance Data!')

                updatePerformanceData((prevState) => {
                    return { ...prevState, pair_bot: data }
                })


                updateMetricsData(prevData => {
                    return {
                        ...prevData,
                        boughtVolume: (data.length > 0) ? data.map(deal => deal.bought_volume).reduce((sum: number, item: number) => sum + item) : 0,
                        totalProfit_perf: (data.length > 0) ? data.map(deal => deal.total_profit).reduce((sum: number, item: number) => sum + item) : 0,
                        totalDeals: (data.length > 0) ? data.map(deal => deal.number_of_deals).reduce((sum: number, item: number) => sum + item) : 0
                    }
                })
            }))

        fetchBotPerformanceMetrics(undefined, profileData)
            .then((data: Type_Bot_Performance_Metrics[]) => {
                if(!data) return
                console.log('getting bot performance metrics')
                updatePerformanceData((prevState) => {
                    return { ...prevState, bot: data }
                })

            })

        fetchPairPerformanceMetrics(undefined, profileData)
            .then((data: Type_Pair_Performance_Metrics[]) => {
                if(!data) return
                console.log('getting pair performance metrics')
                updatePerformanceData((prevState) => {
                    return { ...prevState, pair: data }
                })

            })
    }

    /**
     * @metrics - totalBoughtVolume, maxRisk, activeDealCount
     * @data - active deals, entire array returned by 3C
     * Confirmed working
     */
    const getActiveDeals = async (profileData?: Type_Profile) => {
        await getActiveDealsFunction(profileData)
            .then(data => {
                if(!data) return
                console.log('updated active deals and related metrics!')
                const { activeDeals, metrics } = data
                updateActiveDeals(() => activeDeals)
                updateMetricsData(prevMetrics => {
                    return {
                        ...prevMetrics,
                        ...metrics,
                        activeDealCount: activeDeals.length
                    }
                })

            })
    }

    /**
     * TODO
     * - Needs to have a dynamic update based on the config.
     * - look at moving the account name up into the config.
     * 
     * @accountData - This may need to be optimized as it's just the pair data from performance data.
     * @balance - on_orders, position
     * @metrics - same as balance.
     */
    const getAccountData = async (profileData?: Type_Profile) => {
        await getAccountDataFunction(profileData)
            .then(data => {
                if(!data) return
                const { accountData, balance } = data

                if (accountData == undefined || accountData.length === 0) {
                    return
                }

                // filtering the accounts based on what is included in the config settings.
                const filteredAccount = accountData.filter(account => currentProfile.statSettings.account_id.includes(account.account_id))

                /** TODO
                 * - Add error handling here to properly know what to return if there is no matching accounts
                 */
                const defaultData = {
                    accountName: (filteredAccount.length > 0) ? filteredAccount.map(account => account.account_name) : "No matching accounts"
                }

                setAccountData(accountData)
                setBalanceData(balance)
                updateMetricsData(prevState => {
                    return {
                        ...prevState,
                        ...balance
                    }
                })
                setAdditionalData(prevState => {
                    return {
                        ...prevState,
                        ...defaultData
                    }
                })


            })
    }





    /**
     * maxRisk - Active deals max risk total. This comes from the deals endpoint. 3Commas.js / getActiveDealsFunction()
     * sum - ((balanceData.on_orders + balanceData.position + balanceData.on_orders)) - this comes from the accounts endpoint.
     * totalBoughtVolume - Active Deals bot volume total.
     * 
     * position - this includes what's on orders!!!!!
     */
    const calculateMetrics = () => {
        updateMetricsData(prevState => {
            const { maxRisk, totalBoughtVolume, position, on_orders } = prevState

            // Position = available + on orders.
            const reservedFundsTotal = (reservedFunds.length) ? reservedFunds.filter(account => account.is_enabled).map(account => account.reserved_funds).reduce((sum: number, item: number) => sum + item) : 0
            const availableBankroll = position - on_orders - reservedFundsTotal
            const totalInDeals = on_orders + totalBoughtVolume
            const totalBankroll = position + totalBoughtVolume - reservedFundsTotal


            console.log({
                maxRiskPercent: parseInt(((maxRisk / totalBankroll) * 100).toFixed(0)),
                bankrollAvailable: parseInt(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
                totalBankroll,
                availableBankroll,
                prevState,
                totalInDeals,
                reservedFunds
            })

            // active sum already includes on_orders.


            return {
                ...prevState,
                maxRiskPercent: parseInt(((maxRisk / totalBankroll) * 100).toFixed(0)),
                bankrollAvailable: parseInt(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
                totalBankroll,
                availableBankroll,
                totalInDeals,
                reservedFundsTotal
            }
        })
    }

    const updateAllData = async (offset: number = 1000, callback: CallableFunction) => {

        await setSyncOptions( (prevState) => { 
            updateIsSyncing(true)
            let syncCount = prevState.syncCount
            const options = {
                ...prevState,
                offset
            }

            try {
                updateThreeCData('fullSync', options, currentProfile)
                    .then(async () => {
                        await fetchBotData(currentProfile)
                        await fetchProfitMetrics(currentProfile)
                        await fetchPerformanceData(currentProfile)
                        await getActiveDeals(currentProfile)
                        await getAccountData(currentProfile)
                        await calculateMetrics()
                        callback()
                        updateIsSyncing(false)
    
                    })
                    return {
                        ...prevState,
                        syncCount: 0
                    }
            } catch (error) {
                console.error(error)
                alert('Error updating your data. Check the console for more information.')
                updateIsSyncing(false)
                return {
                    ...prevState,
                    syncCount
                }
            }

           
        })
        

    }

    /**
     * Data Syncing state
     */

    const [buttonEnabled, setButtonEnabled] = useState<boolean>(false)
    const [interval, setIntervalState] = useState<NodeJS.Timeout | null | number>()
    const defaultSyncOptions = {
        summary: false,
        notifications: true,
        time: 0,
        syncCount: 0
        // offset: 25,
    }
    const [syncOptions, setSyncOptions] = useState(defaultSyncOptions)



    /**
     * 
     * @param offset offset in which to sync 3C at
     * @param lastSyncTime the millisecond time of the sync.
     * @param summary boolean value that defines if it'll be a summary or individual notification set.
     */
    const updateAutoSync = async (offset: number) => {
        updateIsSyncing(true)

        setSyncOptions(prevState => {
            const options = {
                ...prevState,
                offset
            }
            
            console.log(options)
            let syncCount = prevState.syncCount
            try {

                updateThreeCData('autoSync', options, currentProfile)
                    .then(() => {
                        fetchProfitMetrics(currentProfile)
                        fetchPerformanceData(currentProfile)
                        getActiveDeals(currentProfile)
                        calculateMetrics()
                        updateIsSyncing(false)
                    })
            } catch (error) {
                console.error(error)
                alert('Error updating your data. Check the console for more information.')
                updateIsSyncing(false)
            }

            if(prevState.syncCount === 20) {
                console.error('updating the sync count to 0')
                syncCount = 0;
            }

            return {
                ...prevState,
                time: prevState.time + 15000,
                syncCount: syncCount + 1
            }
        })

    }


    // Timer is set to a 15 second refresh interval right now.
    const timer = () => {

        // setting a new start for the time each time the timer is called.
        setSyncOptions(prevState => ({
            ...prevState,
            time: new Date().getTime()
        }))

        setIntervalState(
            setInterval(() => {

                // TODO - need to set this to possibly be the length of active deals so catch all the data.
                updateAutoSync(200)
            }, 15000))
    }

    const stopAutoSync = () => {
        //@ts-ignore
        clearInterval(interval); // Not working
        setIntervalState(null)

        // setting the sync count to 0 when auto sync is stopped
        setSyncOptions(prevState => ({
            ...prevState,
            syncCount: 0
        }))
    }
    useEffect(() => {
        if (buttonEnabled) {
            timer();
        } else {
            stopAutoSync()
        }
    }, [buttonEnabled]);



    // TODO - Come back to this
    const values = {
        actions: {
            fetchProfitMetrics,
            fetchPerformanceData,
            getActiveDeals,
            getAccountData,
            fetchBotData,
            calculateMetrics,
            updateAllData
        },
        data: {
            // @ts-ignore
            botData,
            profitData,
            // @ts-ignore
            activeDeals,
            // @ts-ignore
            performanceData,
            balanceData,
            // @ts-ignore
            metricsData,
            additionalData,
            // @ts-ignore
            accountData,
            isSyncing
        },
        autoSync: {
            buttonEnabled,
            setButtonEnabled,
            // summarySync,
            // setSummarySync,
            // notifications,
            // setNotifications,
            syncOptions,
            setSyncOptions
        }
    }

    return (
        <DataContext.Provider
            // @ts-ignore
            value={values}>
            {children}
        </DataContext.Provider>
    )
}


const useGlobalData = () => {
    const context = React.useContext(DataContext);
    if (context === undefined) {
        throw new Error(
            "useGlobalData must be used within a GlobalContextProvider"
        );
    }
    return context;
};


export { DataContext, DataProvider, useGlobalData }