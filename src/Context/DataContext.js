import React, { createContext, useState, useEffect } from 'react';
import dotProp from 'dot-prop';

// Contect Providers
import { useGlobalState } from './Config';
const DataContext = createContext();

// Utilities
import {
    fetchDealDataFunction,
    fetchPerformanceDataFunction,
    getActiveDealsFunction,
    updateThreeCData,
    getAccountDataFunction
} from '../utils/3Commas';


const defaultBalance = {
    on_orders: 0,
    position: 0,
    sum: 0
}

const defaultMetrics = {
    activeSum: 0,
    maxRisk: 0,
    totalProfit: 0,
    maxRiskPercent: 0,
    bankrollAvailable: 0
}

/**
 * 
 * This needs to be nested under the config context as it'll use that!
 */
const DataProvider = ({ children }) => {

    const configState = useGlobalState()
    const { config } = configState

    const [botData, updateBotData] = useState([])
    const [profitData, updateProfitData] = useState([])
    const [activeDeals, updateActiveDeals] = useState([])
    const [performanceData, updatePerformanceData] = useState([])
    const [balanceData, setBalanceData] = useState(() => defaultBalance)
    const [accountData, setAccountData] = useState([])
    const [metricsData, updateMetricsData] = useState(() => defaultMetrics)
    const [additionalData, setAdditionalData] = useState([])



    useEffect(() => {
        // console.log({config}, 'yolo')
        // console.log()
        if (config && dotProp.has(config, 'general.defaultCurrency')) {
            console.log('ran this')
            getAccountData(config)
        }


    }, [config])

    useEffect(() => {
        fetchBotData()
        fetchProfitMetrics()
        fetchPerformanceData()
        getActiveDeals()
    }, [config])

    /**
     * checking if any of the numbers needed have changed, if so then we pull the data.
     */
    useEffect(() => {
        calculateMetrics()
    }, [metricsData.sum, metricsData.activeSum, metricsData.maxRisk])


    const fetchBotData = async () => {
        await electron.api.updateBots()
        await electron.database.query('select * from bots;')
            .then(
                (result) => {
                    // alert('Bot data is updated')
                    if(result.length > 0) {
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
            .then(data => {
                console.log('updated Performance Data!')
                updatePerformanceData(data)
                updateMetricsData(prevData => {
                    return {
                        ...prevData,
                        boughtVolume: (data.length > 0) ? data.map(deal => deal.bought_volume).reduce((sum, item) => sum + item) : 0,
                        totalProfit_perf: (data.length > 0) ? data.map(deal => deal.total_profit).reduce((sum, item) => sum + item) : 0,
                        totalDeals : (data.length > 0) ? data.map(deal => deal.number_of_deals).reduce((sum, item) => sum + item) : 0
                    }
                })
            })
    }

    /**
     * @metrics - activeSum, maxRisk, activeDealCount
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
     * @balance - sum, on_orders, position
     * @metrics - same as balance.
     */
    const getAccountData = (config) => {
        getAccountDataFunction(config.general.defaultCurrency)
            .then(data => {
                const { accountData, balance } = data

                const filteredAccount = accountData.find(account => account.account_id === config.statSettings.account_id)

                /** TODO
                 * - Add error handling here to properly know what to return if there is no matching accounts
                 */
                const defaultData = {
                    accountName: (filteredAccount) ? filteredAccount.name : "No matching accounts"
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


    const calculateMetrics = () => {
        updateMetricsData(prevState => {
            const { maxRisk, sum, activeSum } = prevState
            console.log(prevState)
            console.log({
                maxRiskPercent: ((parseInt(maxRisk) / (parseInt(sum) + parseInt(activeSum))) * 100).toFixed(0),
                bankrollAvailable: ((parseInt(sum) / (parseInt(sum) + parseInt(activeSum))) * 100).toFixed(0)
            })


            return {
                ...prevState,
                maxRiskPercent: parseInt(((parseInt(maxRisk) / (parseInt(sum) + parseInt(activeSum))) * 100).toFixed(0)),
                bankrollAvailable: parseInt(((parseInt(sum) / (parseInt(sum) + parseInt(activeSum))) * 100).toFixed(0))
            }
        })
    }

    const runTestData = () => {
        console.log({ metricsData })
    }

    const updateAllData = () => {
        updateThreeCData()
            .then(() => {
                fetchBotData()
                fetchProfitMetrics()
                fetchPerformanceData()
                getActiveDeals()

                if (config && dotProp.has(config, 'general.defaultCurrency')) {
                    console.log('ran this')
                    getAccountData(config)
                }

            })
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
            botData,
            profitData,
            activeDeals,
            performanceData,
            balanceData,
            metricsData,
            additionalData,
            accountData
        }
    }

    return (
        <DataContext.Provider
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