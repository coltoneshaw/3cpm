import { getFiltersQueryString } from '@/app/Features/3Commas/queryString';
import { Type_Profile } from '@/types/config'
import type {  Type_Query_PerfArray } from '@/types/3Commas'
import type { utcDateRange } from "@/types/Date";

const queryDealByPairByDay = async (profileData: Type_Profile, utcDateRange: utcDateRange ): Promise<queryDealByPairByDayReturn[] | []> => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, currentProfileID } = filtersQueryString;

    const queryString = `
                SELECT 
                    pair,
                    avg(profitPercent) as averageHourlyProfitPercent, 
                    sum(final_profit) as totalProfit, 
                    count(*) as numberOfDeals,
                    sum(bought_volume) as boughtVolume,
                    avg(deal_hours) as averageDealHours
                FROM 
                    deals 
                WHERE
                    profitPercent is not null
                    and account_id in (${accountIdString} )
                    and currency in (${currencyString} )
                    and closed_at_iso_string BETWEEN ${utcDateRange.utcStartDate} and ${utcDateRange.utcEndDate}
                    and profile_id = '${currentProfileID}'
                GROUP BY 
                    pair;`


    let databaseQuery: queryDealByPairByDayQuery[] | [] = await window.ThreeCPM.Repository.Database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        const totalProfitSummary = databaseQuery
            .map(deal => deal.totalProfit)
            .reduce((sum: number, item: number) => sum + item)

        const boughtVolumeSummary = databaseQuery
            .map(deal => deal.boughtVolume)
            .reduce((sum: number, item: number) => sum + item)

        return databaseQuery.map(perfData => {
            const { boughtVolume, totalProfit } = perfData
            return {
                ...perfData,
                percentTotalVolume: (boughtVolume / boughtVolumeSummary) * 100,
                percentTotalProfit: (totalProfit / totalProfitSummary) * 100,
            }
        })
    }

    return []
}

const queryDealByBotByDay = async (profileData: Type_Profile, utcDateRange: utcDateRange ): Promise<botQueryDealByDayReturn[] | []> => {
    const filtersQueryString = await getFiltersQueryString(profileData);
    const { currencyString, accountIdString, currentProfileID } = filtersQueryString;

    const queryString = `
                SELECT 
                    bot_name,
                    bot_id,
                    avg(profitPercent) as averageHourlyProfitPercent, 
                    sum(final_profit) as totalProfit, 
                    count(*) as numberOfDeals,
                    sum(bought_volume) as boughtVolume,
                    avg(deal_hours) as averageDealHours
                FROM 
                    deals 
                WHERE
                    profitPercent is not null
                    and account_id in (${accountIdString} )
                    and currency in (${currencyString} )
                    and closed_at_iso_string BETWEEN ${utcDateRange.utcStartDate} and ${utcDateRange.utcEndDate}
                    and profile_id = '${currentProfileID}'
                GROUP BY 
                    bot_id;`


    let databaseQuery: botQueryDealByDayQuery[] | [] = await window.ThreeCPM.Repository.Database.query(queryString);

    if (databaseQuery == null || databaseQuery.length > 0) {
        const totalProfitSummary = databaseQuery
            .map(deal => deal.totalProfit)
            .reduce((sum: number, item: number) => sum + item)

        const boughtVolumeSummary = databaseQuery
            .map(deal => deal.boughtVolume)
            .reduce((sum: number, item: number) => sum + item)

        return databaseQuery.map(perfData => {
            const { boughtVolume, totalProfit } = perfData
            return {
                ...perfData,
                percentTotalVolume: (boughtVolume / boughtVolumeSummary) * 100,
                percentTotalProfit: (totalProfit / totalProfitSummary) * 100,
            }
        })
    }

    return []
}

export { queryDealByPairByDay, queryDealByBotByDay }
