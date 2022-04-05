/* eslint-disable @typescript-eslint/naming-convention */
import log from 'electron-log';
import { setProfileConfig } from 'electron/main/Config/config';
import {
  calcDealHours,
  botPerDealMaxFunds,
  calcDeviation,
  calcBotMaxFunds,
  calcDealMaxFunds,
  calcBotMaxInactiveFunds,
} from 'common/utils/formulas';
import {
  MarketOrdersType, ManualSOs, QueryAccountsType,
} from 'types/DatabaseQueries';
import { Bots, Deals } from 'types/3cAPI';
import { ProfileType } from 'types/config';
import { PreStorageDeals3cAPI } from './types';

import ThreeCommasAPI from './3commaslib';

/**
 *
 * @param {object} config This is the config string at the time of calling this function.
 * @returns the 3Commas API object.
 *
 * @description - required at the moment so when you make a config change on the frontend you're not using old data.
 */
const threeCapi = (
  profileData?: ProfileType,
  key?: string,
  secret?: string,
  incomingMode?: string,
): ThreeCommasAPI | false => {
  let apiKey = key;
  let apiSecret = secret;
  let mode = incomingMode;

  if (!apiKey || !apiSecret || !mode) {
    if (!profileData) return false;
    apiKey = profileData.apis.threeC.key;
    apiSecret = profileData.apis.threeC.secret;
    mode = profileData.apis.threeC.mode;
  }

  if (apiKey == null || apiSecret == null || mode == null) {
    log.error('missing API keys or mode');
    return false;
  }

  return new ThreeCommasAPI({ apiKey, apiSecret, mode });
};

async function bots(profileData: ProfileType) {
  const api = threeCapi(profileData);
  if (!api) return [];

  const responseArray = [];
  let response: Bots.Responses.Bot[];
  const offsetMax = 5000;
  const perOffset = 100;

  for (let offset = 0; offset < offsetMax; offset += perOffset) {
    // eslint-disable-next-line no-await-in-loop
    response = await api.getBots({
      limit: 100,
      sort_by: 'updated_at',
      sort_direction: 'desc',
      offset,
    });
    if (response.length > 0) { responseArray.push(...response); }
    if (response.length !== perOffset) break;
  }

  return responseArray.map((bot) => {
    const {
      id, account_id, account_name, is_enabled,
      max_safety_orders, active_safety_orders_count,
      max_active_deals, active_deals_count,
      name, take_profit, take_profit_type, created_at, updated_at,
      base_order_volume, safety_order_volume, base_order_volume_type,
      safety_order_step_percentage, type,
      martingale_volume_coefficient, martingale_step_coefficient,
      safety_order_volume_type,
      profit_currency, finished_deals_profit_usd,
      finished_deals_count, pairs, trailing_deviation,
      active_deals_usd_profit, stop_loss_percentage,
      strategy,
    } = bot;

    const maxDealFunds = botPerDealMaxFunds(
      max_safety_orders,
      +base_order_volume,
      +safety_order_volume,
      +martingale_volume_coefficient,
    );
    const max_inactive_funds = calcBotMaxInactiveFunds(maxDealFunds, max_active_deals, active_deals_count);

    return {
      id,
      origin: 'sync',
      account_id,
      account_name,
      name,
      pairs: pairs.map((p) => p.split('_')[1]).join(),
      active_deals_count,
      active_deals_usd_profit,
      active_safety_orders_count,
      base_order_volume,
      base_order_volume_type,
      created_at,
      updated_at,
      enabled_inactive_funds: (is_enabled === true) ? +max_inactive_funds : 0,
      enabled_active_funds: (is_enabled === true) ? +maxDealFunds * active_deals_count : 0,
      finished_deals_count,
      finished_deals_profit_usd,
      is_enabled,
      martingale_volume_coefficient,
      martingale_step_coefficient,
      max_active_deals,
      max_funds: calcBotMaxFunds(maxDealFunds, max_active_deals),
      max_funds_per_deal: maxDealFunds,
      max_inactive_funds,
      max_safety_orders,
      from_currency: pairs[0].split('_')[0],
      profit_currency,
      safety_order_step_percentage,
      safety_order_volume,
      safety_order_volume_type,
      stop_loss_percentage,
      strategy,
      take_profit,
      take_profit_type,
      trailing_deviation,
      type: type.split('::')[1],
      drawdown: 0,
      price_deviation: calcDeviation(+max_safety_orders, +safety_order_step_percentage, +martingale_step_coefficient),
      maxCoveragePercent: null,
    };
  });
}

/**
   * @param {number} deal_id The deal id of an active deal
   *
   * @description Fetching market orders for bots that are active and have active market orders
   * @api_docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/deals_api.md#deal-safety-orders-permission-bots_read-security-signed
   */
async function getMarketOrders(deal_id: number, profileData: ProfileType) {
  const api = threeCapi(profileData);
  if (!api) return false;

  // this is the /market_orders endpoint.
  const apiCall = await api.getDealSafetyOrders({ deal_id });

  const manualSOs: ManualSOs[] = [];

  apiCall.forEach((order) => {
    const {
      deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price,
    } = order;
    if (deal_order_type === 'Manual Safety') {
      manualSOs.push({
        deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price,
      });
    }
  });

  return {
    filled: manualSOs.filter((deal) => deal.status_string === 'Filled'),
    failed: manualSOs.filter((deal) => deal.status_string === 'Cancelled'),
    active: manualSOs.filter((deal) => deal.status_string === 'Active'),
  };
}

// TODO this can be merged with gerMarketOrders
/**
 * @param profileData
 * @param {number} deal_id The deal id of an active deal
 *
 * @description Fetching market orders for bots that are active and have active market orders
 * @api_docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/deals_api.md#deal-safety-orders-permission-bots_read-security-signed
 */
async function getDealOrders(profileData: ProfileType, deal_id: number) {
  const api = threeCapi(profileData);
  if (!api) return [];

  // this is the /market_orders endpoint.
  const data = await api.getDealSafetyOrders({ deal_id });

  return (!data) ? []
    : data.map((order: MarketOrdersType) => {
      // market orders do not use the rate metric, but active orders do not use the average price
      const rate = (order.rate !== 0) ? +order.rate : +order.average_price;

      // total is blank for active deals. Calculating the total to be used within the app.
      if (order.status_string === 'Active' && order.rate && order.quantity) order.total = rate * order.quantity;
      return {
        ...order,
        average_price: +order.average_price, // this is zero on sell orders
        quantity: +order.quantity,
        quantity_remaining: +order.quantity_remaining,
        rate,
        total: +order.total,
      };
    });
}

async function getDealsThatAreUpdated(
  api: ThreeCommasAPI,
  perSyncOffset: number,
  { id, lastSyncTime: incomingLastSyncTime }: { id: string, lastSyncTime: number | null },
) {
  const responseArray = [];
  let response: Deals.Responses.Deal[];
  const offsetMax = 250000;
  const perOffset = (perSyncOffset) || 1000;
  let oldestDate;
  let newLastSyncTime;

  const lastSyncTime = (incomingLastSyncTime) || 0;

  // api.getDeals

  for (let offset = 0; offset < offsetMax; offset += perOffset) {
    // this now filters out any deals that were cancelled or failed due a bug in how 3C reports that data.
    // eslint-disable-next-line no-await-in-loop
    response = await api.getDeals({
      limit: perOffset,
      order: 'updated_at',
      order_direction: 'desc',
      offset,
      scope: ['active', 'completed', 'finished'],
    });
    if (response.length > 0) { responseArray.push(...response); }

    // this pulls the oldest date of the final item in the array.
    oldestDate = new Date(response[response.length - 1].updated_at).getTime();

    if (offset === 0) newLastSyncTime = new Date(response[0].updated_at).getTime();

    log.debug({
      responseArrayLength: responseArray.length,
      currentResponse: response.length,
      offset,
      sync: {
        oldest: oldestDate,
        newest: new Date(response[0].updated_at).getTime(),
      },
      newLastSyncTime,
      lastSyncTime,
    });

    if (response.length !== perOffset || oldestDate <= lastSyncTime) { break; }
  }

  log.info(`Response data Length: ${responseArray.length}`);
  if (lastSyncTime !== newLastSyncTime) { setProfileConfig('syncStatus.deals.lastSyncTime', newLastSyncTime ?? 0, id); }
  return {
    deals: responseArray,
    lastSyncTime: (lastSyncTime !== newLastSyncTime) ? newLastSyncTime ?? 0 : lastSyncTime,
  };
}
// This may need to be looked at a bit. But for now it's just an array that runs and stores the active deals.
let activeDealIDs = <number[]>[];

async function getActiveDeals(api: ThreeCommasAPI, perSyncOffset = 300) {
  const response = await api.getDeals({ limit: perSyncOffset, scope: ['active'] });
  return response;
}

/**
 *
 * @param perSyncOffset - Total to sync per update
 * @param type - type of update happening
 *
 * @returns object array of deals.
 */
async function getDealsUpdate(perSyncOffset: number, type: 'autoSync' | 'fullSync', profileData: ProfileType) {
  const api = threeCapi(profileData);
  if (!api) {
    return {
      deals: [],
      lastSyncTime: profileData.syncStatus.deals.lastSyncTime,
    };
  }

  let activeDeals = <[] | Deals.Responses.Deal[]>[];

  if (type === 'autoSync') {
    activeDeals = await getActiveDeals(api, perSyncOffset);
    const newActiveDealIds = activeDeals.map((deal) => deal.id);

    // this logic is if the active deals match, just return since nothing has changed.
    // if they don't match go and fetch all the deals.
    if (activeDealIDs === newActiveDealIds) {
      return { deals: activeDeals, lastSyncTime: profileData.syncStatus.deals.lastSyncTime };
    }
    activeDealIDs = newActiveDealIds;
  }

  const { deals: updatedDeals, lastSyncTime } = await getDealsThatAreUpdated(
    api,
    perSyncOffset,
    {
      id: profileData.id,
      lastSyncTime: profileData.syncStatus.deals.lastSyncTime,
    },
  );

  return { deals: [...updatedDeals, ...activeDeals], lastSyncTime };
}

async function deals(offset: number, type: 'autoSync' | 'fullSync', profileData: ProfileType) {
  const { deals: dealsUpdate, lastSyncTime } = await getDealsUpdate(offset, type, profileData);
  const dealArray: PreStorageDeals3cAPI[] = [];

  if (!dealsUpdate || dealsUpdate.length === 0) return { deals: [], lastSyncTime };

  dealsUpdate.forEach(async (deal) => {
    const {
      created_at, closed_at, bought_volume,
      base_order_volume, safety_order_volume,
      completed_safety_orders_count, martingale_volume_coefficient,
      final_profit_percentage, pair, id, actual_usd_profit,
      active_manual_safety_orders, bought_average_price,
      current_price, actual_profit,
      completed_manual_safety_orders_count, current_active_safety_orders,
    } = deal;

    let { max_safety_orders } = deal;
    const activeDeal = closed_at === null;
    const deal_hours = calcDealHours(created_at, closed_at);

    // this fix is for a bug in 3C where the active SO can be greater than 0 with max safety orders being lower which causes a mis calculation and ignoring all the SOs.
    max_safety_orders = Math.max(completed_safety_orders_count + current_active_safety_orders, max_safety_orders);

    let market_order_data = <{ filled: any[], failed: any[], active: any[] }>{ filled: [], failed: [], active: [] };

    // This potentially adds a heavy API call to each sync, requiring it to hit the manual SO endpoint every sync.
    // fetching market order information for any deals that are not closed.
    if (active_manual_safety_orders > 0 || completed_manual_safety_orders_count > 0) {
      const fetched_market_order_data = await getMarketOrders(id, profileData);
      if (fetched_market_order_data) market_order_data = fetched_market_order_data;
    }

    const max_deal_funds = (activeDeal)
      ? calcDealMaxFunds(
        +bought_volume,
        +base_order_volume,
        +safety_order_volume,
        +max_safety_orders,
        completed_safety_orders_count,
        +martingale_volume_coefficient,
        market_order_data.active,
      )
      : null;

    const impactFactor = (activeDeal)
      ? ((
        (+bought_average_price - +current_price) / +bought_average_price)
        * (415 / (Number(bought_volume) ** 0.618))) / (+actual_usd_profit / +actual_profit)
      : null;

    const tempObject = {

      // this is recalculated based on the active and completed SOs
      max_safety_orders,
      realized_actual_profit_usd: (activeDeal) ? null : +actual_usd_profit,
      deal_hours,
      pair: pair.split('_')[1],
      currency: pair.split('_')[0],

      // updated this value to be accurate based on what's actually been completed
      completed_manual_safety_orders_count: market_order_data.filled.length,
      max_deal_funds,
      impactFactor,
      profitPercent: (activeDeal) ? null : ((+final_profit_percentage / 100) / +deal_hours).toFixed(3),
      closed_at_iso_string: (activeDeal) ? null : new Date(closed_at).getTime(),
      // final_profit: +final_profit,
      // final_profit_percentage: +final_profit_percentage
    };

    dealArray.push({
      ...deal,
      ...tempObject,
    });
  });

  return {
    deals: dealArray,
    lastSyncTime,
  };
}

/**
 *
 * @returns - Account data for enabled accounts on the profile.
 *
 * @docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/accounts_api.md#information-about-all-user-balances-on-specified-exchange--permission-accounts_read-security-signed
 */
async function getAccountDetail(profileData: ProfileType) {
  const api = threeCapi(profileData);
  if (!api) return [];

  const accountData = await api.accounts();
  if (!accountData) {
    return [];
  }
  const array: QueryAccountsType[] = [];
  const accountIDs = profileData.statSettings.reservedFunds.filter((a) => a.is_enabled).map((a) => a.id);
  const filteredAccountData = accountData.filter((a: any) => accountIDs.includes(a.id));

  filteredAccountData.forEach(async (account) => {
    const accountKey = { account_id: String(account.id) };
    // this loads the account balances from the exchange to 3C ensuring the numbers are updated
    await api.accountLoadBalances(accountKey);
    // this is where we get the coins and position per account.
    const data = await api.accountTableData(accountKey);

    const { name: account_name, exchange_name, market_code } = account;
    // Load data into new array with only the columns we want and format them

    data.forEach((row) => {
      const {
        account_id, currency_code, percentage, position, btc_value, usd_value, on_orders, currency_slug,
      } = row;
      const tempObject = {
        id: `${account_id}-${currency_slug}`,
        account_id,
        account_name,
        exchange_name,
        currency_code,
        percentage,
        position,
        on_orders,
        btc_value,
        usd_value,
        market_code,
      };
      array.push(tempObject);
    });
  });

  return array;
}

// TODO replace this with the get account detail function with some conditional logic
async function getAccountSummary(profileData?: ProfileType, key?: string, secret?: string, mode?: string) {
  const api = threeCapi(profileData, key, secret, mode);
  if (!api) return [];
  const accountData = await api.accounts();

  const array: { id: number, name: string }[] = [];

  accountData.forEach((account) => {
    const { id, name } = account;
    array.push({ id, name });
  });

  return array;
}

async function updateDeal(profileData: ProfileType, deal: Deals.Params.UpdateDeal) {
  const api = threeCapi(profileData);
  if (!api) return false;

  return api.updateDeal(deal);
}

export {
  getDealsUpdate,
  getAccountDetail,
  deals,
  bots,
  getAccountSummary,
  getDealOrders,
  updateDeal,
};
