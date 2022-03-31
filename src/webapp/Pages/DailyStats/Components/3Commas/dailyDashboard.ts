import type { FetchDealDataFunctionQuery } from 'webapp/Features/3Commas/Type_3Commas';
import { daysInMilli } from 'webapp/Pages/DailyStats/logic';
import { ProfileType } from 'types/config';
import type { ActiveDeals, ProfitArray } from 'types/DatabaseQueries';
import type { QueryDealByPairByDayReturn, BotQueryDealByDayReturn } from './type_dailydashboard';
import type { UtcDateRange } from 'types/Date';
import { getDatesBetweenTwoDates } from 'common/utils/helperFunctions';

type Filters = {
  accounts: number[] | [],
  currency: string[] | string
};

const queryDealByPairByDay = async (
  profileData: ProfileType,
  utcDateRange: UtcDateRange,
  filters: Filters,
): Promise<QueryDealByPairByDayReturn[] | []> => {
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
                    and account_id in (${filters.accounts} )
                    and currency in (${filters.currency} )
                    and closed_at_iso_string BETWEEN ${utcDateRange.utcStartDate} and ${utcDateRange.utcEndDate}
                GROUP BY 
                    pair;`;

  const databaseQuery: QueryDealByPairByDayReturn[] | [] = await window.ThreeCPM.Repository.Database
    .query(profileData.id, queryString);

  if (!databaseQuery || databaseQuery.length > 0) {
    const totalProfitSummary = databaseQuery
      .map((deal) => deal.totalProfit)
      .reduce((sum: number, item: number) => sum + item);

    const boughtVolumeSummary = databaseQuery
      .map((deal) => deal.boughtVolume)
      .reduce((sum: number, item: number) => sum + item);

    return databaseQuery.map((perfData) => {
      const { boughtVolume, totalProfit } = perfData;
      return {
        ...perfData,
        percentTotalVolume: (boughtVolume / boughtVolumeSummary) * 100,
        percentTotalProfit: (totalProfit / totalProfitSummary) * 100,
      };
    });
  }

  return [];
};

const queryDealByBotByDay = async (
  profileData: ProfileType,
  utcDateRange: UtcDateRange,
  filters: Filters,
): Promise<BotQueryDealByDayReturn[] | []> => {
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
                    and account_id in (${filters.accounts} )
                    and currency in (${filters.currency} )
                    and closed_at_iso_string BETWEEN ${utcDateRange.utcStartDate} and ${utcDateRange.utcEndDate}
                GROUP BY 
                    bot_id;`;

  const databaseQuery: BotQueryDealByDayReturn[] | [] = await window.ThreeCPM.Repository.Database
    .query(profileData.id, queryString);

  if (!databaseQuery || databaseQuery.length > 0) {
    const totalProfitSummary = databaseQuery
      .map((deal) => deal.totalProfit)
      .reduce((sum: number, item: number) => sum + item);

    const boughtVolumeSummary = databaseQuery
      .map((deal) => deal.boughtVolume)
      .reduce((sum: number, item: number) => sum + item);

    return databaseQuery.map((perfData) => {
      const { boughtVolume, totalProfit } = perfData;
      return {
        ...perfData,
        percentTotalVolume: (boughtVolume / boughtVolumeSummary) * 100,
        percentTotalProfit: (totalProfit / totalProfitSummary) * 100,
      };
    });
  }

  return [];
};

const getHistoricalProfits = async (
  profitArray: ProfitArray[] | [],
  filters: Filters,
  currentProfileID: string,
  utcStart: number,
) => {
  const sixtyQuery = `
        SELECT 
            sum(final_profit) as final_profit
        FROM 
            deals
        WHERE 
            closed_at != null 
            or finished = 1 
            and account_id in (${filters.accounts} )
            and currency in (${filters.currency} )
            and closed_at_iso_string BETWEEN ${utcStart - daysInMilli.thirty} and ${utcStart};`;

  const sixtyDayProfit = await window.ThreeCPM.Repository.Database.query(currentProfileID, sixtyQuery);
  const totalDays = profitArray.length;

  const currentWeek = profitArray
    .filter((value, index) => index + 1 > totalDays - 7)
    .map((d) => d.profit)
    .reduce((s, d) => s + d);

  const priorWeek = profitArray
    .filter((value, index) => index + 1 > totalDays - 14 && index + 1 < totalDays - 7)
    .map((d) => d.profit)
    .reduce((s, d) => s + d);

  const priorDay = profitArray[totalDays - 2].profit;

  return {
    priors: {
      month: (sixtyDayProfit) ? sixtyDayProfit[0].final_profit : 0,
      week: priorWeek,
      day: priorDay,
    },
    current: {
      month: [...profitArray].pop()?.runningSum ?? 0,
      week: currentWeek,
      day: [...profitArray].pop()?.profit ?? 0,
    },
  };
};

const getTotalProfit = async (profileData: ProfileType, filters: Filters): Promise<number> => {
  const totalProfit = `
    SELECT 
        sum(final_profit) as final_profit
    FROM 
        deals
    WHERE 
        closed_at != null 
        or finished = 1 
        and account_id in (${filters.accounts} )
        and currency in (${filters.currency} );`;

  const total = await window.ThreeCPM.Repository.Database.query(profileData.id, totalProfit);
  return total[0].final_profit;
};

const queryProfitDataByDay = async (profileData: ProfileType, utcDateRange: UtcDateRange, filters: Filters) => {
  const profitData: ProfitArray[] | [] = [];
  const utcStart = utcDateRange.utcStartDate - daysInMilli.thirty;

  const query = `
        SELECT substr(closed_at, 0, 11) as closed_at_str,
               sum(final_profit)        as final_profit,
               sum(deal_hours)          as deal_hours,
               count(id)                as total_deals
        FROM 
            deals
        WHERE 
            closed_at != null 
            or finished = 1 
            and account_id in (${filters.accounts} )
            and currency in (${filters.currency} )
            and closed_at_iso_string BETWEEN ${utcStart} and ${utcDateRange.utcEndDate}
        GROUP BY
            closed_at_str
        ORDER BY
            closed_at asc;`;

  const dataArray: FetchDealDataFunctionQuery[] | [] = await window.ThreeCPM.Repository.Database
    .query(profileData.id, query);

  // if no data return blank array.
  if (dataArray == null || dataArray.length === 0) {
    return {
      profitData,
      metrics: {
        totalProfit: 0,
        averageDailyProfit: 0,
        averageDealHours: 0,
        totalClosedDeals: 0,
        totalDealHours: 0,
        todayProfit: 0,
      },
      priors: {
        month: 0,
        week: 0,
        day: 0,
      },
      current: {
        month: 0,
        week: 0,
        day: 0,
      },
    };
  }

  const { days } = getDatesBetweenTwoDates(
    new Date(utcStart).toISOString().split('T')[0],
    new Date(utcDateRange.utcEndDate).toISOString().split('T')[0],
  );
  const profitArray: ProfitArray[] = [];
  const totalDealHours = dataArray.map((deal) => deal.deal_hours).reduce((sum: number, hours: number) => sum + hours);

  days.forEach((day: string, index: number) => {
    // there should never be more than one date in the array.
    const filteredData = dataArray.find((deal: any) => deal.closed_at_str === day);
    // adding the existing value to the previous value's running sum.

    let profit = {
      utc_date: day,
      profit: 0,
      runningSum: (index === 0) ? 0 : profitArray[index - 1].runningSum,
      total_deals: 0,
    };
    if (filteredData) {
      profit = {
        utc_date: day,
        profit: filteredData.final_profit,
        runningSum: (index === 0)
          ? filteredData.final_profit
          : profitArray[index - 1].runningSum + filteredData.final_profit,
        total_deals: filteredData.total_deals,
      };
    }
    profitArray.push(profit);
  });

  const totalProfit = (profitArray.length > 0) ? +profitArray[profitArray.length - 1].runningSum : 0;
  const averageDailyProfit = (profitArray.length > 0) ? totalProfit / (profitArray.length) : 0;
  const totalClosedDeals = (profitArray.length > 0)
    ? profitArray
      .map((day) => day.total_deals)
      .reduce((sum: number, total_deals: number) => sum + total_deals)
    : 0;
  const averageDealHours = (profitArray.length > 0) ? totalDealHours / totalClosedDeals : 0;
  const historical = await getHistoricalProfits(profitArray, filters, profileData.id, utcStart);

  return {
    profitData: profitArray,
    metrics: {
      totalProfit,
      averageDailyProfit,
      averageDealHours,
      totalClosedDeals,
      totalDealHours,
      todayProfit: [...profitArray].pop()?.profit ?? 0,
    },
    ...historical,
  };
};

const getActiveDealsFunction = async (profileData: ProfileType, filters: Filters) => {
  const query = `
                SELECT
                    * 
                FROM
                    deals 
                WHERE
                    finished = 0 
                    and account_id in (${filters.accounts} )
                    and currency in (${filters.currency} )
                    
                    `;
  let activeDeals: ActiveDeals[] | [] = await window.ThreeCPM.Repository.Database.query(profileData.id, query);

  if (activeDeals !== undefined && activeDeals.length > 0) {
    activeDeals = activeDeals.map((row: ActiveDeals) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const so_volume_remaining = row.max_deal_funds - row.bought_volume;
      return {
        ...row,
        so_volume_remaining,
      };
    });

    return {
      activeDeals,
      metrics: {
        totalBoughtVolume: activeDeals
          .map((deal: ActiveDeals) => deal.bought_volume)
          .reduce((sum: number, item: number) => sum + item),
        maxRisk: activeDeals
          .map((deal: ActiveDeals) => deal.max_deal_funds)
          .reduce((sum: number, item: number) => sum + item),
      },

    };
  }
  return {
    activeDeals: [],
    metrics: {
      totalBoughtVolume: 0,
      maxRisk: 0,
    },

  };
};

export {
  queryDealByPairByDay, queryDealByBotByDay, queryProfitDataByDay, getTotalProfit, getActiveDealsFunction,
};
