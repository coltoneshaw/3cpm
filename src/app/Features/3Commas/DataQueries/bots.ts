import { getFiltersQueryString } from '@/app/Features/3Commas/queryString';
import { initDate, DateRangeToSQLString } from '@/app/Features/3Commas/3Commas';
import { Type_Profile } from '@/types/config';
import type { Type_Query_bots } from '@/types/3CommasApi';
import type { DateRange } from '@/types/Date';
import { FetchBotPerformanceMetrics } from '../Type_3Commas';

/**
 *
 * @returns An array containing the data for specific bot metrics.
 *
 */

const fetchBotPerformanceMetrics = async (profileData: Type_Profile, oDate?: DateRange) => {
  const filtersQueryString = await getFiltersQueryString(profileData);
  const {
    currencyString, accountIdString, startString, currentProfileID,
  } = filtersQueryString;

  // TODO - Need to update this so it uses the start string OR the adjusted string.
  const date = initDate(startString, oDate);
  const [fromDateStr, toDateStr] = DateRangeToSQLString(date);
  const fromSQL = `and closed_at >= '${fromDateStr}'`;
  const toSQL = `and closed_at < '${toDateStr}'`;

  const queryString = `
                SELECT 
                    bot_id,
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
                    ${fromSQL} ${toSQL}
                GROUP BY
                    bot_id;`;

  const databaseQuery: FetchBotPerformanceMetrics[] | [] = await window.ThreeCPM.Repository.Database
    .query(currentProfileID, queryString);

  if (databaseQuery == null || databaseQuery.length > 0) {
    return databaseQuery;
  }
  return [];
};

const botQuery = async (currentProfile: Type_Profile): Promise<Type_Query_bots[] | []> => {
  const filtersQueryString = await getFiltersQueryString(currentProfile);
  const { accountIdString, currentProfileID, currencyString } = filtersQueryString;

  const queryString = `
                SELECT
                    *
                FROM 
                    bots
                WHERE
                    from_currency in (${currencyString})
                    and (account_id in (${accountIdString})  OR origin = 'custom')`;

  const databaseQuery: Type_Query_bots[] | [] = await window.ThreeCPM.Repository.Database
    .query(currentProfileID, queryString);

  if (databaseQuery != null) return databaseQuery;
  return [];
};

export {
  fetchBotPerformanceMetrics,
  botQuery,
};
