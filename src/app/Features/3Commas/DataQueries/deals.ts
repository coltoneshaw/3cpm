import { getFiltersQueryString } from '@/app/Features/3Commas/queryString';
import { Type_Profile } from '@/types/config';
import type { ProfitArray, QueryPerformanceArray, ActiveDeals } from '@/types/3Commas';
import { getDatesBetweenTwoDates } from '@/utils/helperFunctions';
import { initDate, DateRangeToSQLString } from '@/app/Features/3Commas/3Commas';
import type { DateRange } from '@/types/Date';

// Filtering by only closed.
// This can most likely be moved to the performance dashboard or upwards to the app header.
const fetchDealDataFunction = async (profileData: Type_Profile) => {
  const filtersQueryString = await getFiltersQueryString(profileData);
  const {
    currencyString, accountIdString, startString, currentProfileID,
  } = filtersQueryString;
  const profitData: ProfitArray[] | [] = [];

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
            and account_id in ( ${accountIdString} )
            and currency in (${currencyString} )
            and closed_at_iso_string > ${startString}
        GROUP BY
            closed_at_str
        ORDER BY
            closed_at asc;`;

  const dataArray: fetchDealDataFunctionQuery[] | [] = await window.ThreeCPM.Repository.Database.query(currentProfileID, query);

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
      },
    };
  }

  const { days } = getDatesBetweenTwoDates(new Date(startString).toISOString().split('T')[0], new Date().toISOString().split('T')[0]);
  const profitArray: ProfitArray[] = [];
  const totalDealHours = dataArray.map((deal) => deal.deal_hours).reduce((sum: number, hours: number) => sum + hours);

  days.forEach((day: string, index: number) => {
    // there should never be more than one date in the array.
    const filteredData = dataArray.find((deal: any) => deal.closed_at_str === day);
    // adding the existing value to the previous value's running sum.

    let profit = {
      utc_date: day,
      profit: 0,
      runningSum: (index == 0) ? 0 : profitArray[index - 1].runningSum,
      total_deals: 0,
    };
    if (filteredData) {
      profit = {
        utc_date: day,
        profit: filteredData.final_profit,
        runningSum: (index == 0) ? filteredData.final_profit : profitArray[index - 1].runningSum + filteredData.final_profit,
        total_deals: filteredData.total_deals,
      };
    }
    profitArray.push(profit);
  });

  const totalProfit = (profitArray.length > 0) ? +profitArray[profitArray.length - 1].runningSum : 0;
  const averageDailyProfit = (profitArray.length > 0) ? totalProfit / (profitArray.length) : 0;
  const totalClosedDeals = (profitArray.length > 0) ? profitArray.map((day) => day.total_deals).reduce((sum: number, total_deals: number) => sum + total_deals) : 0;
  const averageDealHours = (profitArray.length > 0) ? totalDealHours / totalClosedDeals : 0;

  return {
    profitData: profitArray,
    metrics: {
      totalProfit,
      averageDailyProfit,
      averageDealHours,
      totalClosedDeals,
      totalDealHours,
    },
  };
};

const fetchPerformanceDataFunction = async (profileData: Type_Profile, oDate?: DateRange): Promise<QueryPerformanceArray[] | []> => {
  const filtersQueryString = await getFiltersQueryString(profileData);
  const {
    currencyString, accountIdString, startString, currentProfileID,
  } = filtersQueryString;

  const date = initDate(startString, oDate);
  const [fromDateStr, toDateStr] = DateRangeToSQLString(date);
  const fromSQL = `and closed_at >= '${fromDateStr}'`;
  const toSQL = `and closed_at < '${toDateStr}'`;

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
                    ${fromSQL} ${toSQL}
                GROUP BY 
                    performance_id;`;

  const databaseQuery: fetchPerformanceData[] | [] = await window.ThreeCPM.Repository.Database.query(currentProfileID, queryString);

  if (databaseQuery == null || databaseQuery.length > 0) {
    const totalProfitSummary = databaseQuery
      .map((deal) => deal.total_profit)
      .reduce((sum: number, item: number) => sum + item);

    const boughtVolumeSummary = databaseQuery
      .map((deal) => deal.bought_volume)
      .reduce((sum: number, item: number) => sum + item);

    return databaseQuery.map((perfData) => {
      const { bought_volume, total_profit } = perfData;
      return {
        ...perfData,
        percentTotalVolume: (bought_volume / boughtVolumeSummary) * 100,
        percentTotalProfit: (total_profit / totalProfitSummary) * 100,
      };
    });
  }

  return [];
};

const getActiveDealsFunction = async (profileData: Type_Profile) => {
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
                    `;
  let activeDeals: ActiveDeals[] | [] = await window.ThreeCPM.Repository.Database.query(currentProfileID, query);

  if (activeDeals != undefined && activeDeals.length > 0) {
    activeDeals = activeDeals.map((row: ActiveDeals) => {
      const so_volume_remaining = row.max_deal_funds - row.bought_volume;
      return {
        ...row,
        so_volume_remaining,
      };
    });

    return {
      activeDeals,
      metrics: {
        totalBoughtVolume: activeDeals.map((deal: ActiveDeals) => deal.bought_volume).reduce((sum: number, item: number) => sum + item),
        maxRisk: activeDeals.map((deal: ActiveDeals) => deal.max_deal_funds).reduce((sum: number, item: number) => sum + item),
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

const fetchSoData = async (currentProfile: Type_Profile, oDate?: DateRange) => {
  const filtersQueryString = await getFiltersQueryString(currentProfile);
  const {
    currencyString, accountIdString, startString, currentProfileID,
  } = filtersQueryString;

  const date = initDate(startString, oDate);
  const [fromDateStr, toDateStr] = DateRangeToSQLString(date);
  const fromSQL = `and closed_at >= '${fromDateStr}'`;
  const toSQL = `and closed_at < '${toDateStr}'`;

  const query = `
            select 
                completed_safety_orders_count, 
                SUM(final_profit) as total_profit,
                COUNT(*) as total_deals
            from 
                deals 
            WHERE
                account_id in (${accountIdString} )
                and currency in (${currencyString} )
                and closed_at_iso_string > ${startString}
                ${fromSQL} ${toSQL}
            group by 
                completed_safety_orders_count;`;

  const data: fetchSoData[] | [] = await window.ThreeCPM.Repository.Database.query(currentProfileID, query);

  if (!data || data.length == 0) {
    return [];
  }

  const sumTotalProfit = data.map((d: any) => d.total_profit).reduce((sum: number, profit: number) => sum + profit);
  const sumTotalDeals = data.map((d: any) => d.total_deals).reduce((sum: number, count: number) => sum + count);

  return data.map((deal: { completed_safety_orders_count: number, total_profit: number, total_deals: number }) => ({
    ...deal,
    percent_total: (deal.total_profit) ? deal.total_profit / sumTotalProfit : 0,
    percent_deals: (deal.total_deals) ? deal.total_deals / sumTotalDeals : 0,
  }));
};

export {
  fetchDealDataFunction,
  fetchPerformanceDataFunction,
  getActiveDealsFunction,
  fetchSoData,
};
