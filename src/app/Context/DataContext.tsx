import React, { createContext, useState, useEffect, createRef } from 'react';
import dotProp from 'dot-prop';

// Contect Providers
import { useGlobalState } from './Config';

import { Type_Query_PerfArray, Type_bots, Type_ActiveDeals, Type_Query_Accounts, Type_MetricData} from '@/types/3Commas'
import { TconfigValues } from '@/types/config'

// TODO - see about setting this to something other than null for the default Value
// @ts-ignore
const DataContext = createContext<Type_Data_Context>();

// Utilities
import {
    fetchDealDataFunction,
    fetchPerformanceDataFunction,
    getActiveDealsFunction,
    updateThreeCData,
    getAccountDataFunction
} from '@/utils/3Commas';


const defaultBalance = {
    on_orders: 0,
    position: 0
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
    totalInDeals: 0
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
            refreshData: any
        },
        data: {
            botData: Type_bots[]
            profitData: any
            activeDeals: Type_ActiveDeals[]
            performanceData: Type_Query_PerfArray[]
            balanceData: { on_orders: number, position: number}
            metricsData: Type_MetricData
            additionalData: {accountName: string[] }[]
            accountData: Type_Query_Accounts[]
            isSyncing: boolean
        }
}

/**
 * 
 * This needs to be nested under the config context as it'll use that!
 */
const DataProvider = ( { children }:any ) => {

    const botSyncIcon = createRef()
    const statsSyncIcon = createRef()

    const configState = useGlobalState()
    const { config } = configState

    const [botData, updateBotData] = useState<Type_bots[]>([])
    const [profitData, updateProfitData] = useState<object[]>([])
    const [activeDeals, updateActiveDeals] = useState<object[]>([])
    const [performanceData, updatePerformanceData] = useState<object[]>([])
    const [balanceData, setBalanceData] = useState(() => defaultBalance)
    const [accountData, setAccountData] = useState<object[]>([])
    const [metricsData, updateMetricsData] = useState(() => defaultMetrics)
    const [additionalData, setAdditionalData] = useState([])
    const [isSyncing, updateIsSyncing] = useState(false)



    useEffect(() => {
        // console.log({config}, 'yolo')
        // console.log()
        if (config && dotProp.has(config, 'general.defaultCurrency')) {
            console.log('ran this')
            getAccountData(config)
        }


    }, [config])

    // @ts-ignore
    useEffect(async () => {
        updateIsSyncing(true)
        try{
            await fetchBotData()
            await fetchProfitMetrics()
            await fetchPerformanceData()
            await getActiveDeals()
        } catch(error){
            console.error(error)
        }
        updateIsSyncing(false)


    }, [config])

    /**
     * checking if any of the numbers needed have changed, if so then we pull the data.
     */
    useEffect(() => {
        calculateMetrics()
    }, [metricsData.position, metricsData.totalBoughtVolume, metricsData.maxRisk])


    const fetchBotData = async () => {
        // @ts-ignore
        await electron.api.updateBots()

        // @ts-ignore
        await electron.database.query('select * from bots;')
            .then( (result: Type_bots[])  => {
                    // alert('Bot data is updated')
                    if (result.length > 0) {
                        updateBotData(result)
                    } else {
                        updateBotData([])
                    }
                })
    }


    /**
     * @data - returns the profit array data; { utc_date, profit, running sum }
     * @metrics - returns just TotalProfit
     * Confirmed working
     */
    const fetchProfitMetrics = () => {
        fetchDealDataFunction()
            .then(data => {

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
    const fetchPerformanceData = () => {
        fetchPerformanceDataFunction()
            .then( ( (data: Type_Query_PerfArray[] ) => {
                console.log('updated Performance Data!')
                updatePerformanceData(data)
                updateMetricsData(prevData => {
                    return {
                        ...prevData,
                        boughtVolume: (data.length > 0) ? data.map( deal => deal.bought_volume).reduce((sum:number , item:number ) => sum + item) : 0,
                        totalProfit_perf: (data.length > 0) ? data.map( deal => deal.total_profit).reduce((sum:number , item:number ) => sum + item) : 0,
                        totalDeals: (data.length > 0) ? data.map( deal  => deal.number_of_deals).reduce((sum:number , item:number ) => sum + item) : 0
                    }
                })
            }))
    }

    /**
     * @metrics - totalBoughtVolume, maxRisk, activeDealCount
     * @data - active deals, entire array returned by 3C
     * Confirmed working
     */
    const getActiveDeals = () => {
        getActiveDealsFunction()
            .then(data => {
                console.log('updated active deals and related metrics!')
                const { activeDeals, metrics } = data
                updateActiveDeals(activeDeals)
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
    const getAccountData = (config: TconfigValues) => {
        getAccountDataFunction(config.general.defaultCurrency)
            .then(data => {
                const { accountData, balance } = data

                // filtering the accounts based on what is included in the config settings.
                const filteredAccount = accountData.filter(account => config.statSettings.account_id.includes( account.account_id ) )

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
     * postition - this includes what's on orders!!!!!
     */
    const calculateMetrics = () => {
        updateMetricsData(prevState => {
            const { maxRisk, totalBoughtVolume, position, on_orders } = prevState

            // Position = available + on orders.
            const totalBankroll =  position + totalBoughtVolume
            const availableBankroll = position - on_orders
            const totalInDeals = on_orders + totalBoughtVolume

            console.log({
                maxRiskPercent: parseInt((( maxRisk / totalBankroll ) * 100).toFixed(0)),
                bankrollAvailable: parseInt(  (( 1 - (( totalInDeals ) / totalBankroll ) ) * 100 ).toFixed(0) ),
                totalBankroll,
                availableBankroll,
                prevState,
                totalInDeals
            })

            // active sum already includes on_orders.


            return {
                ...prevState,
                maxRiskPercent: parseInt(((maxRisk / totalBankroll ) * 100).toFixed(0)),
                bankrollAvailable: parseInt(  (( 1 - (( totalInDeals ) / totalBankroll ) ) * 100 ).toFixed(0) ),
                totalBankroll,
                availableBankroll,
                totalInDeals
            }
        })
    }

    const runTestData = () => {
        console.log({ metricsData })
    }

    const updateAllData = async () => {
        updateIsSyncing(true)
        try {
            await updateThreeCData()
                .then(async () => {
                    await fetchBotData()
                    await fetchProfitMetrics()
                    await fetchPerformanceData()
                    await getActiveDeals()

                    if (config && dotProp.has(config, 'general.defaultCurrency')) {
                        console.log('ran this')
                        getAccountData(config)
                    }

                })
        } catch (error) {
            console.error(error)
        }

        updateIsSyncing(false)

    }

    const refreshData = () => {
        fetchBotData()
        fetchProfitMetrics()
        fetchPerformanceData()
        getActiveDeals()

        if (config && dotProp.has(config, 'general.defaultCurrency')) {
            console.log('ran this')
            getAccountData(config)
        }
    }



    // TODO - Come back to this
    const values = {
        actions: {
            runTestData,
            fetchProfitMetrics,
            fetchPerformanceData,
            getActiveDeals,
            getAccountData,
            fetchBotData,
            calculateMetrics,
            updateAllData,
            refreshData
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
        }
    }

    return (
        <DataContext.Provider
            // @ts-ignore
            value={values }>
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