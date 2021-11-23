import { getFiltersQueryString } from '@/app/Features/3Commas/queryString';
import { initDate, DateRangeToSQLString } from '@/app/Features/3Commas/3Commas';
import { Type_Profile } from '@/types/config'
import type { DateRange } from "@/types/Date";

import moment from "moment";
import { Type_Pair_By_Date } from '@/types/3Commas'



const fetchPairPerformanceMetrics = async (profileData: Type_Profile, oDate?: DateRange) => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, startString, currentProfileID } = filtersQueryString;

    let date = initDate(startString, oDate);
    const [fromDateStr, toDateStr] = DateRangeToSQLString(date)
    const fromSQL = `and closed_at >= '${fromDateStr}'`
    const toSQL = `and closed_at < '${toDateStr}'`

    const queryString = `
        SELECT 
                pair,
               sum(final_profit)                                                         as total_profit,
               avg(final_profit)                                                         as avg_profit,
               count(*)                                                                  as number_of_deals,
               sum(bought_volume)                                                        as bought_volume,
               avg(deal_hours)                                                           as avg_deal_hours,
               avg(completed_safety_orders_count + completed_manual_safety_orders_count) as avg_completed_so
        FROM 
            deals
        WHERE 
            closed_at is not null
            and account_id in (${accountIdString})
            and currency in (${currencyString})
            and profile_id = '${currentProfileID}'
            ${fromSQL} ${toSQL}
        GROUP BY
            pair;`

    let databaseQuery: fetchPairPerformanceMetrics[] | [] = await window.ThreeCPM.Repository.Database.query(currentProfileID, queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        return databaseQuery
    }
    return []
}

/**
 *
 * @param pairs An array of the pairs to return from the database.
 *
 * @description This is used to see pairs on a per date bases in charts. This is not used in the DataContext state. This reports based on the usd_final_profit only
 */
const getSelectPairDataByDate = async (profileData: Type_Profile, pairs: string[], oDate: DateRange,) => {
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
            sum(final_profit) as profit
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


    let pairData: Array<Type_Pair_By_Date> | [] = await window.ThreeCPM.Repository.Database.query(currentProfileID, query);


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
    return result

}

export {
    fetchPairPerformanceMetrics,
    getSelectPairDataByDate
}

