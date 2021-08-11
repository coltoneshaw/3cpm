import {
    Type_Query_PerfArray,
    Type_Query_DealData,
    Type_Profit,
    Type_ActiveDeals,
    Type_Query_Accounts
} from '@/types/3Commas'

import { Type_ReservedFunds } from '@/types/config'


interface Type_ProfitArray extends Array<Type_Profit> { }

const getFiltersQueryString = async () => {

    // @ts-ignore
    const config = await electron.config.get()

    const { statSettings: { startDate, reservedFunds }, general: { defaultCurrency } } = config

    // always will have a start date of 90 days out. There should not be a time that this is null
    // const startString = `closed_at_iso_string > ${startDate}`

    // may not always have an account_id if it's not been configured, this needs to detect null or not.
    // const accountIdString = (account_id.length > 0) ? `and account_id in ( ${account_id} )` : ""

    // should never have a time where there is not a currency.
    // const currencyString = `and currency = '${defaultCurrency}'`
    // console.log({defaultCurrency})


    // const currencyString = (defaultCurrency.length > 0) ? `and currency in ( ${defaultCurrency.map( (b:string) => "'" + b + "'")} )` : ""

    // combining the above filters
    // no OR starting the string.
    // const fullQueryString = `${startString} ${accountIdString} ${currencyString}`

    const currencyString = (defaultCurrency) ? defaultCurrency.map((b: string) => "'" + b + "'") : ""
    const startString = startDate
    const accountIdString = reservedFunds.filter((account: Type_ReservedFunds) => account.is_enabled).map((account: Type_ReservedFunds) => account.id)


    return {
        // fullQueryString,
        currencyString,
        accountIdString,
        startString
    }

}


/**
 * @description This kicks off the update process that updates all 3Commas data within the database.
 */
const updateThreeCData = async () => {

    // @ts-ignore
    await electron.api.update();
}


// Filtering by only closed.
// This can most likely be moved to the performance dashboard or upwards to the app header.
const fetchDealDataFunction = async () => {
    const filtersQueryString = await getFiltersQueryString()
    const { currencyString, accountIdString, startString } = filtersQueryString;
    const query = `
                SELECT 
                    final_profit, closed_at, id, deal_hours
                FROM 
                    deals 
                WHERE
                    closed_at != null 
                    or finished = 1 
                    and account_id in (${accountIdString}) 
                    and currency in (${currencyString}) 
                    and closed_at_iso_string > ${startString} 
                ORDER BY
                    closed_at asc;`

    // @ts-ignore
    let dataArray = await electron.database.query(query)

    if (dataArray == null || dataArray.length === 0) {
        console.log('no data')
        return {
            profitData: [],
            metrics: {
                totalProfit: 0,
                averageDailyProfit: 0,
                averageDealHours: 0
            }
        }
    }

    let dates = Array.from(new Set(dataArray.map((row: Type_Query_DealData) => { if (row.closed_at) { return row.closed_at.split('T')[0] } })))
    let totalDealHours = dataArray.map((deal: Type_Query_DealData) => deal.deal_hours).reduce((sum: number, hours: number) => sum + hours)

    console.log({ dates })

    let profitArray: Type_ProfitArray = []

    dates.forEach((day: any, index) => {

        // filtering the data array for only the deals that match the day we are filtering on.
        let profit = dataArray.filter((deal: Type_Query_DealData) => deal.closed_at.split('T')[0] === day).map((deal: Type_Query_DealData) => deal.final_profit)
        if (profit.length > 0) {
            profit = profit.reduce((sum: number, profit: number) => sum + profit)
        } else {
            profit = 0
        }

        // adding the existing value to the previous value's running sum.
        let runningSum = (index == 0) ? +profit : profitArray[index - 1].runningSum + +profit

        let dateObject = {
            utc_date: day.toString(),
            profit: +profit.toFixed(6),
            runningSum: +runningSum.toFixed(6)
        }
        profitArray.push(dateObject)
    })


    const totalProfit = (profitArray.length > 0) ? +profitArray[profitArray.length - 1].runningSum : 0
    const averageDailyProfit = (profitArray.length > 0) ? totalProfit / (profitArray.length + 1) : 0;
    const averageDealHours = (profitArray.length > 0) ? totalDealHours / (dataArray.length + 1) : 0;

    return {
        profitData: profitArray,
        metrics: {
            totalProfit,
            averageDailyProfit,
            averageDealHours
        }
    }

}

/**
     * TODO
     * - Does this need to be everything, or just things that are not null?
     * - Need to add account / currency filters on this.
     */
const fetchPerformanceDataFunction = async () => {
    const filtersQueryString = await getFiltersQueryString()
    const { currencyString, accountIdString, startString } = filtersQueryString;


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
                    and account_id in (${accountIdString} )
                    and currency in (${currencyString} )
                    and closed_at_iso_string > ${startString} 
                GROUP BY 
                    performance_id;`

    console.log(queryString)

    // @ts-ignore
    let databaseQuery = await electron.database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        const totalProfitSummary = databaseQuery
            .map((deal: Type_Query_PerfArray) => deal.total_profit)
            .reduce((sum: number, item: number) => sum + item)

        const boughtVolumeSummary = databaseQuery
            .map((deal: Type_Query_PerfArray) => deal.bought_volume)
            .reduce((sum: number, item: number) => sum + item)

        const performanceData = databaseQuery.map((perfData: Type_Query_PerfArray) => {
            const { bought_volume, total_profit } = perfData
            return {
                ...perfData,
                percentTotalVolume: (bought_volume / boughtVolumeSummary) * 100,
                percentTotalProfit: (total_profit / totalProfitSummary) * 100,
            }
        })

        return performanceData
    } else {
        return []
    }


}


/**
 * 
 * @returns An array containing the data for specific bot metrics.
 */
const fetchBotPerformanceMetrics = async () => {
    const filtersQueryString = await getFiltersQueryString()
    const { currencyString, accountIdString, startString } = filtersQueryString;


    const queryString = `
                SELECT 
                    bot_id, 
                    bot_name, 
                    sum(final_profit) as total_profit, 
                    avg(final_profit) as avg_profit,
                    count(*) as number_of_deals,
                    sum(bought_volume) as bought_volume,
                    avg(deal_hours) as avg_deal_hours,
                    avg(completed_safety_orders_count + completed_manual_safety_orders_count) as avg_completed_so
                FROM 
                    deals 
                WHERE
                    closed_at is not null
                    and account_id in (${accountIdString}) 
                    and currency in (${currencyString}) 
                    and closed_at_iso_string > ${startString} 
                GROUP BY 
                    bot_id;`

    console.log(queryString)

    // @ts-ignore
    let databaseQuery = await electron.database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        return databaseQuery
    } else {
        return []
    }


}

/**
 * 
 * @returns An array containing the data for specific bot metrics.
 */
 const fetchPairPerformanceMetrics = async () => {
    const filtersQueryString = await getFiltersQueryString()
    const { currencyString, accountIdString, startString } = filtersQueryString;


    const queryString = `
                SELECT 
                    pair, 
                    sum(final_profit) as total_profit, 
                    avg(final_profit) as avg_profit,
                    count(*) as number_of_deals,
                    sum(bought_volume) as bought_volume,
                    avg(deal_hours) as avg_deal_hours,
                    avg(completed_safety_orders_count + completed_manual_safety_orders_count) as avg_completed_so
                FROM 
                    deals 
                WHERE
                    closed_at is not null
                    and account_id in (${accountIdString}) 
                    and currency in (${currencyString}) 
                    and closed_at_iso_string > ${startString} 
                GROUP BY 
                    pair;`

    console.log(queryString)

    // @ts-ignore
    let databaseQuery = await electron.database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        return databaseQuery
    } else {
        return []
    }


}


const getActiveDealsFunction = async () => {
    const filtersQueryString = await getFiltersQueryString()

    const { currencyString, accountIdString } = filtersQueryString
    const query = `
                SELECT
                    * 
                FROM
                    deals 
                WHERE
                    finished = 0 
                    and account_id in (${accountIdString} )
                    and currency in (${currencyString} )
                    `
    console.log(query)
    // @ts-ignore
    let activeDeals: Array<Type_ActiveDeals> = await electron.database.query(query)


    if (activeDeals == null || activeDeals.length > 0) {
        activeDeals = activeDeals.map((row: Type_ActiveDeals) => {
            const so_volume_remaining = row.max_deal_funds - row.bought_volume
            return {
                ...row,
                so_volume_remaining
            }
        })

        return {
            activeDeals,
            metrics: {
                totalBoughtVolume: activeDeals.map((deal: Type_ActiveDeals) => deal.bought_volume).reduce((sum: number, item: number) => sum + item),
                maxRisk: activeDeals.map((deal: Type_ActiveDeals) => deal.max_deal_funds).reduce((sum: number, item: number) => sum + item)
            }

        }

    } else {
        return {
            activeDeals: [],
            metrics: {
                totalBoughtVolume: 0,
                maxRisk: 0
            }

        }
    }
}

/**
 * 
 * @param {string} defaultCurrency This is the default currency configured in settings and used as a filter
 * @returns 
 */
const getAccountDataFunction = async (defaultCurrency: string[]) => {
    // console.log({accountData:  await accountDataAll()})

    const filtersQueryString = await getFiltersQueryString()
    const { currencyString, accountIdString } = filtersQueryString

    const query = `
                SELECT
                    *
                FROM
                    accountData
                WHERE
                    account_id IN ( ${accountIdString} )
                    and currency_code IN ( ${currencyString} );
    `
    console.log(query)

    // @ts-ignore
    let accountData: Array<Type_Query_Accounts> = await electron.database.query(query)
        .then((data: Type_Query_Accounts[]) => data.filter(row => defaultCurrency.includes(row.currency_code)))

    if (accountData == null || accountData.length > 0) {
        let on_ordersTotal = 0;
        let positionTotal = 0;

        for (const account of accountData) {
            const { on_orders, position } = account
            on_ordersTotal += on_orders;
            positionTotal += position;

        }

        console.log({ on_ordersTotal, positionTotal })
        return {
            accountData,
            balance: {
                on_orders: on_ordersTotal,
                position: positionTotal,
            }
        }
    }

    return {
        accountData: [],
        balance: {
            on_orders: 0,
            position: 0,
        }
    }


}

const accountDataAll = async () => {

    // @ts-ignore
    return await electron.database.query("select * from accountData")

}


export {
    fetchDealDataFunction,
    fetchPerformanceDataFunction,
    getActiveDealsFunction,
    updateThreeCData,
    getAccountDataFunction,
    accountDataAll,
    fetchBotPerformanceMetrics,
    fetchPairPerformanceMetrics
}


