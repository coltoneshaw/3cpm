import {
    Type_ActiveDeals,
    Type_Pair_By_Date,
    Type_Profit,
    Type_Query_Accounts,
    Type_Query_DealData,
    Type_Query_PerfArray,
    Type_UpdateFunction
} from '@/types/3Commas'

import { Type_ReservedFunds, Type_Profile } from '@/types/config'

import { getDatesBetweenTwoDates } from '@/utils/helperFunctions'
import { DateRange } from "@/types/Date";
import moment from "moment";


const getFiltersQueryString = async (profileData?: Type_Profile) => {

    if (!profileData) {
        // @ts-ignore
        const currentProfileID = await electron.config.get('current');

        // @ts-ignore
        profileData = await <Type_Profile>electron.config.get('profile.' + currentProfileID)

        console.log({profileData})
    }

    const { general: {defaultCurrency}, statSettings: {reservedFunds, startDate}, id } = profileData

    const currencyString = (defaultCurrency) ? defaultCurrency.map((b: string) => "'" + b + "'") : ""
    const startString = startDate
    const accountIdString = reservedFunds.filter((account: Type_ReservedFunds) => account.is_enabled).map((account: Type_ReservedFunds) => account.id)


    return {
        currencyString,
        accountIdString,
        startString,
        currentProfileID: id
    }

}


/**
 * @description This kicks off the update process that updates all 3Commas data within the database.
 *
 * @params - type 'autoSync'
 * @params {options} - option string
 */
const updateThreeCData = async (type: string, options: Type_UpdateFunction, profileData: Type_Profile) => {

    console.info({ options })

    // @ts-ignore
    await electron.api.update(type, options, profileData);
}


// Filtering by only closed.
// This can most likely be moved to the performance dashboard or upwards to the app header.
const fetchDealDataFunction = async (profileData?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, startString, currentProfileID } = filtersQueryString;
    const query = `
        SELECT substr(closed_at, 0, 11) as closed_at_str,
               sum(final_profit)        as final_profit,
               sum(deal_hours)          as deal_hours,
               count(id)                as total_deals
        FROM deals
        WHERE closed_at != null 
                or finished = 1 
                and account_id in (${accountIdString} )
                and currency in (${currencyString} )
                and closed_at_iso_string > ${startString}
                and profile_id = '${currentProfileID}'
            GROUP BY
                 closed_at_str
            ORDER BY
                closed_at asc;`

    // @ts-ignore
    let dataArray = await electron.database.query(query)

    // if no data return blank array.
    if (dataArray == null || dataArray.length === 0) {

        return {
            profitData: [],
            metrics: {
                totalProfit: 0,
                averageDailyProfit: 0,
                averageDealHours: 0
            }
        }
    }


    const { days } = getDatesBetweenTwoDates((new Date(startString)).toISOString().split('T')[0], (new Date()).toISOString().split('T')[0])
    const profitArray: Type_Profit[] = [];
    let totalDealHours = dataArray.map((deal: Type_Query_DealData) => deal.deal_hours).reduce((sum: number, hours: number) => sum + hours)


    days.forEach((day: string, index: number) => {

        // there should never be more than one date in the array.
        const filteredData = dataArray.find((deal: any) => deal.closed_at_str === day)
        // adding the existing value to the previous value's running sum.

        let profit = {
            utc_date: day,
            profit: 0,
            runningSum: (index == 0) ? 0 : profitArray[index - 1].runningSum,
            total_deals: 0
        };
        if (filteredData) {
            profit = {
                utc_date: day,
                profit: filteredData.final_profit,
                runningSum: (index == 0) ? filteredData.final_profit : profitArray[index - 1].runningSum + filteredData.final_profit,
                total_deals: filteredData.total_deals
            }
        }
        profitArray.push(profit)
    })

    const totalProfit = (profitArray.length > 0) ? +profitArray[profitArray.length - 1].runningSum : 0
    const averageDailyProfit = (profitArray.length > 0) ? totalProfit / (profitArray.length) : 0;
    const totalClosedDeals = (profitArray.length > 0) ? profitArray.map(day => day.total_deals).reduce((sum: number, total_deals: number) => sum + total_deals) : 0;
    const averageDealHours = (profitArray.length > 0) ? totalDealHours / totalClosedDeals : 0;

    return {
        profitData: profitArray,
        metrics: {
            totalProfit,
            averageDailyProfit,
            averageDealHours,
            totalClosedDeals,
            totalDealHours
        }
    }

}

const fetchPerformanceDataFunction = async (oDate?: DateRange, profileData?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, startString, currentProfileID } = filtersQueryString;

    let date = initDate(startString, oDate);
    const [fromDateStr, toDateStr] = DateRangeToSQLString(date)
    const fromSQL = `and closed_at >= '${fromDateStr}'`
    const toSQL = `and closed_at < '${toDateStr}'`


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
                    and profile_id = '${currentProfileID}'
                    ${fromSQL} ${toSQL}
                GROUP BY 
                    performance_id;`


    // @ts-ignore
    let databaseQuery = await electron.database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        const totalProfitSummary = databaseQuery
            .map((deal: Type_Query_PerfArray) => deal.total_profit)
            .reduce((sum: number, item: number) => sum + item)

        const boughtVolumeSummary = databaseQuery
            .map((deal: Type_Query_PerfArray) => deal.bought_volume)
            .reduce((sum: number, item: number) => sum + item)

        return databaseQuery.map((perfData: Type_Query_PerfArray) => {
            const { bought_volume, total_profit } = perfData
            return {
                ...perfData,
                percentTotalVolume: (bought_volume / boughtVolumeSummary) * 100,
                percentTotalProfit: (total_profit / totalProfitSummary) * 100,
            }
        })
    }

    return []


}


/**
 *
 * @returns An array containing the data for specific bot metrics.
 *
 */

const fetchBotPerformanceMetrics = async (oDate?: DateRange, profileData?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, startString, currentProfileID } = filtersQueryString;


    let date = initDate(startString, oDate);
    const [fromDateStr, toDateStr] = DateRangeToSQLString(date)
    const fromSQL = `and closed_at >= '${fromDateStr}'`
    const toSQL = `and closed_at < '${toDateStr}'`

    const queryString = `
                SELECT bot_id,
                    sum(final_profit)                                                         as total_profit,
                    avg(final_profit)                                                         as avg_profit,
                    count(*)                                                                  as number_of_deals,
                    sum(bought_volume)                                                        as bought_volume,
                    avg(deal_hours)                                                           as avg_deal_hours,
                    avg(completed_safety_orders_count + completed_manual_safety_orders_count) as avg_completed_so,
                    bots.name                                                                 as bot_name,
                    bots.type                                                                 as type
                FROM 
                    deals
                JOIN
                    bots on deals.bot_id = bots.id
                WHERE 
                    closed_at is not null
                    and deals.account_id in (${accountIdString})
                    and deals.currency in (${currencyString})
                    and deals.profile_id = '${currentProfileID}'
                    ${fromSQL} ${toSQL}
                GROUP BY
                    bot_id;`

    // console.log(queryString)

    // @ts-ignore
    let databaseQuery = await electron.database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        return databaseQuery
    }
    return []


}

const botQuery = async (currentProfile?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(currentProfile);
    const { accountIdString, currentProfileID } = filtersQueryString;


    const queryString = `
                SELECT
                    *
                FROM 
                    bots
                WHERE
                    profile_id = '${currentProfileID}'
                    and (account_id in (${accountIdString})  OR origin = 'custom')`


    // console.log(queryString)

    // @ts-ignore
    let databaseQuery = await electron.database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        return databaseQuery
    }
    return []

}

/**
 *
 * @returns An array containing the data for specific bot metrics.
 */
const fetchPairPerformanceMetrics = async (oDate?: DateRange, profileData?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, startString, currentProfileID } = filtersQueryString;

    let date = initDate(startString, oDate);
    const [fromDateStr, toDateStr] = DateRangeToSQLString(date)
    const fromSQL = `and closed_at >= '${fromDateStr}'`
    const toSQL = `and closed_at < '${toDateStr}'`

    const queryString = `
        SELECT pair,
               sum(final_profit)                                                         as total_profit,
               avg(final_profit)                                                         as avg_profit,
               count(*)                                                                  as number_of_deals,
               sum(bought_volume)                                                        as bought_volume,
               avg(deal_hours)                                                           as avg_deal_hours,
               avg(completed_safety_orders_count + completed_manual_safety_orders_count) as avg_completed_so
        FROM deals
        WHERE closed_at is not null
          and account_id in (${accountIdString})
          and currency in (${currencyString})
          and profile_id = '${currentProfileID}'
            ${fromSQL} ${toSQL}
        GROUP BY
            pair;`

    // console.log(queryString)

    // @ts-ignore
    let databaseQuery = await electron.database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        return databaseQuery
    }
    return []


}


const getActiveDealsFunction = async (profileData?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, currentProfileID } = filtersQueryString;
    const query = `
                SELECT
                    * 
                FROM
                    deals 
                WHERE
                    finished = 0 
                    and account_id in (${accountIdString} )
                    and currency in (${currencyString} )
                    and profile_id = '${currentProfileID}'
                    `
    // console.log(query)
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

    }
    return {
        activeDeals: [],
        metrics: {
            totalBoughtVolume: 0,
            maxRisk: 0
        }

    }
}

/**
 *
 * @param {string} defaultCurrency This is the default currency configured in settings and used as a filter
 * @returns
 */
const getAccountDataFunction = async (profileData?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, currentProfileID } = filtersQueryString;

    const query = `
                SELECT
                    *
                FROM
                    accountData
                WHERE
                    account_id IN ( ${accountIdString} )
                    and currency_code IN ( ${currencyString} )
                    and profile_id = '${currentProfileID}';
    `
    console.log(query)

    // @ts-ignore
    let accountData: Array<Type_Query_Accounts> = await electron.database.query(query)

    // removed this since it seems redundant to the above query
    // .then((data: Type_Query_Accounts[]) => data.filter(row => defaultCurrency.includes(row.currency_code)))

    if (accountData == null || accountData.length > 0) {
        let on_ordersTotal = 0;
        let positionTotal = 0;

        for (const account of accountData) {
            const { on_orders, position } = account
            on_ordersTotal += on_orders;
            positionTotal += position;

        }

        // console.log({ on_ordersTotal, positionTotal })
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


function initDate(startString: number, oDate?: DateRange) {
    let date = new DateRange()
    if (oDate) {
        date = { ...oDate }
    }

    if (date.from == null) {
        date.from = moment(startString).startOf("day").toDate()

    }

    if (date.to == null) {
        date.to = moment().endOf("day").toDate()
    }
    return date;
}

/**
 *
 * @param pairs An array of the pairs to return from the database.
 *
 * @description This is used to see pairs on a per date bases in charts. This is not used in the DataContext state. This reports based on the usd_final_profit only
 */
const getSelectPairDataByDate = async (pairs: string[], oDate: DateRange, profileData?: Type_Profile) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, startString, currentProfileID } = filtersQueryString;

    const pairString = (pairs) ? pairs.map((b: string) => "'" + b + "'") : ""


    let date = initDate(startString, oDate);
    const [fromDateStr, toDateStr] = DateRangeToSQLString(date)
    const fromSQL = `and closed_at >= '${fromDateStr}'`
    const toSQL = `and closed_at < '${toDateStr}'`

    const query = `
        SELECT substr(closed_at, 0, 11) as date,
            pair,
            sum(usd_final_profit) as profit
        FROM
            deals
        WHERE
            closed_at is not null
            and account_id IN ( ${accountIdString} )
            and from_currency IN ( ${currencyString} )
            and pair in (${pairString})
            and closed_at_iso_string > ${startString}
            and profile_id = '${currentProfileID}'
            and pair in (${pairString}) ${fromSQL} ${toSQL}
        GROUP BY
            date, pair;
    `


    // @ts-ignore
    let pairData: Array<Type_Pair_By_Date> = await electron.database.query(query);


    let currentDate = moment(date.from).clone();

    let result = [];
    while (currentDate.isSameOrBefore(date.to)) {
        const formattedCurrent = currentDate.format('YYYY-MM-DD')
        const filteredData = pairData.filter(deal => deal.date === formattedCurrent)

        interface subDateObject {
            pair: number
        }

        const subDateObject = <any>{ date: formattedCurrent };
        pairs.forEach(pair => {
            const filteredForPair = filteredData.find(deal => deal.pair === pair)
            subDateObject[pair as keyof subDateObject] = (filteredForPair != undefined) ? filteredForPair.profit : 0
        })

        result.push(subDateObject);
        currentDate.add(1, 'days');
    }
    console.log(result)
    return result

}

const DateRangeToSQLString = (d: DateRange) => {
    let fromDateStr = moment.utc(d.from)
        .subtract(d.from?.getTimezoneOffset(), "minutes")
        .startOf("day")
        .toISOString()


    let toDateStr = moment.utc(d.to)
        .subtract(d.to?.getTimezoneOffset(), "minutes")
        .add(1, "days")
        .startOf("day")
        .toISOString()

    return [fromDateStr, toDateStr]
}

export {
    fetchDealDataFunction,
    fetchPerformanceDataFunction,
    getActiveDealsFunction,
    updateThreeCData,
    getAccountDataFunction,
    fetchBotPerformanceMetrics,
    fetchPairPerformanceMetrics,
    botQuery,
    getSelectPairDataByDate
}


