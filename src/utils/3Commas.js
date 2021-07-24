
/**
 * @description This kicks off the update process that updates all 3Commas data within the database.
 */
const updateThreeCData = async () => {
    await electron.api.update();
}

// Filtering by only closed.
// This can most likely be moved to the performance dashboard or upwards to the app header.
const fetchDealDataFunction = async () => {
    let dataArray = await electron.database.query("select final_profit, closed_at, id from deals where closed_at != null or closed_at != '@closed_at' or finished = 1 order by closed_at asc;")
    let dates = Array.from(new Set(dataArray.map(row => { if (row.closed_at) { return row.closed_at.split('T')[0] } })))

    let profitArray = []

    dates.forEach((day, index) => {
        let profit = dataArray.filter(deal => deal.closed_at.split('T')[0] === day).map(deal => deal.final_profit)
        if (profit.length > 0) {
            profit = profit.reduce((sum, profit) => sum + profit)
        } else {
            profit = 0
        }

        let runningSum = (index == 0) ? +profit : profitArray[index - 1].runningSum + +profit
        let dateObject = {
            'utc_date': day,
            'profit': +profit.toFixed(6),
            runningSum: +runningSum.toFixed(6)
        }
        profitArray.push(dateObject)
    })

    return {
        profitData: profitArray,
        metrics: {
            totalProfit: parseInt( profitArray[profitArray.length - 1].runningSum )
        }
    }

}

/**
     * TODO
     * - Does this need to be everything, or just things that are not null?
     * - Need to add account / currency filters on this.
     */
const fetchPerformanceDataFunction = async () => {
    // Filtering by only closed.
    // This can most likely be moved to the performance dashboard or upwards to the app header.

    const queryString = `
                SELECT 
                    bot_id || '-' || pair as performance_id, 
                    bot_name, 
                    pair,
                    avg(profitPercent) as averageHourlyProfitPercent, 
                    sum(final_profit) as total_profit, 
                    count(*) as number_of_deals,
                    sum(bought_volume) as bought_volume,
                    avg(deal_hours) as averageDealHours
                FROM 
                    deals 
                WHERE
                    profitPercent is not null
                GROUP BY 
                    performance_id;`

    let databaseQuery = await electron.database.query(queryString)

    const totalProfitSummary = databaseQuery.map(deal => deal.total_profit).reduce((sum, item) => sum + item)
    const boughtVolumeSummary = databaseQuery.map(deal => deal.bought_volume).reduce((sum, item) => sum + item)

    const performanceData = databaseQuery.map(perfData => {
        const { bought_volume, total_profit } = perfData
        return {
            ...perfData,
            percentTotalVolume: (bought_volume / boughtVolumeSummary) * 100,
            percentTotalProfit: (total_profit / totalProfitSummary) * 100,
        }
    })

    return performanceData
}

const getActiveDealsFunction = async () => {
    let activeDeals = await electron.database.query("select * from deals where finished = 0 ")
    if (activeDeals.length > 0) {
        activeDeals = activeDeals.map(row => {
            const so_volume_remaining = row.max_deal_funds - row.bought_volume
            return {
                ...row,
                so_volume_remaining
            }
        })
        console.log(activeDeals)
        return {
            activeDeals,
            metrics: {
                activeSum: activeDeals.map(deal => deal.bought_volume).reduce((sum, item) => sum + item),
                maxRisk: activeDeals.map(deal => deal.max_deal_funds).reduce((sum, item) => sum + item)
            }
            
        }

    }
}

/**
 * 
 * @param {string} defaultCurrency This is the default currency configured in settings and used as a filter
 * @returns 
 */
const getAccountDataFunction = async (defaultCurrency) => {
    let accountData = await accountDataAll()

    let balanceData = accountData.filter(row => row.currency_code === defaultCurrency)[0]

    return {
        accountData,
        balance: {
            on_orders: balanceData.on_orders,
            position: balanceData.position,
            sum: ((balanceData.on_orders + balanceData.position))
        }
    }
}

const accountDataAll = async () => {
    return await electron.database.query("select * from accountData")

}


export {
    fetchDealDataFunction,
    fetchPerformanceDataFunction,
    getActiveDealsFunction,
    updateThreeCData,
    getAccountDataFunction,
    accountDataAll
}