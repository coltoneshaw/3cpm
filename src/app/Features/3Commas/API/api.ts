const threeCommasAPI = require('3commas-api-node')
import { Type_API_bots, Type_Deals_API, Type_MarketOrders} from '@/types/3Commas'

import { config } from '@/utils/config';




import {
  calc_dealHours,
  calc_DealMaxFunds_bot,
  calc_deviation,
  calc_maxBotFunds,
  calc_maxDealFunds_Deals,
  calc_maxInactiveFunds
} from '@/utils/formulas';

/**
 * 
 * @param {object} config This is the config stringat the time of calling this function.
 * @returns the 3Commas API object.
 * 
 * @description - required at the moment so when you make a config change on the frontend you're not using old data.
 */
const threeCapi = (config: any, key?: string, secret?: string) => {

  key = (key) ? key : config.get('apis.threeC.key')
  secret = (secret) ? secret : config.get('apis.threeC.secret')

  if (key == null || secret == null) {
    console.error('missing API keys')
    return false
  }

  return new threeCommasAPI({
    apiKey: key,
    apiSecret: secret
  })
}


async function bots() {
  const api = threeCapi(config)
  if (!api) return []

  let responseArray = [];
  let response: Type_API_bots[];
  let offsetMax = 5000;
  let perOffset = 1000;



  for (let offset = 0; offset < offsetMax; offset += perOffset) {
    response = await api.getBots({ limit: 1000, sort_by: 'updated_at', order_direction: 'desc', offset });

    if (response.length > 0) { responseArray.push(...response) }
    if (response.length != perOffset) break

  }
  // added this to be the max amount of bots returned. Eventually this needs to be handled in a loop
  // however, the chances of 1000+ bots is a bit low.

  responseArray = responseArray.map(bot => {
    let {
      id, account_id, account_name, is_enabled,
      max_safety_orders, active_safety_orders_count,
      max_active_deals, active_deals_count,
      name, take_profit, take_profit_type, created_at, updated_at,
      base_order_volume, safety_order_volume, base_order_volume_type,
      safety_order_step_percentage, type,
      martingale_volume_coefficient, martingale_step_coefficient,
      martingale_coefficient, safety_order_volume_type,
      profit_currency, finished_deals_profit_usd,
      finished_deals_count, pairs, trailing_deviation,
      active_deals_usd_profit, stop_loss_percentage,
      strategy,
    } = bot

    let maxDealFunds = calc_DealMaxFunds_bot(max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient);
    let max_inactive_funds = calc_maxInactiveFunds(maxDealFunds , max_active_deals , active_deals_count);



    return {
      id,
      origin: 'sync',
      account_id,
      account_name,
      name,
      pairs: pairs.map(p => p.split('_')[1]).join(),
      active_deals_count,
      active_deals_usd_profit,
      active_safety_orders_count,
      base_order_volume,
      base_order_volume_type,
      created_at,
      updated_at,
      'enabled_inactive_funds': (is_enabled == true) ? +max_inactive_funds : 0,
      'enabled_active_funds': (is_enabled == true) ? +maxDealFunds * active_deals_count : 0,
      finished_deals_count,
      finished_deals_profit_usd,
      is_enabled,
      martingale_coefficient,
      martingale_volume_coefficient,
      martingale_step_coefficient,
      max_active_deals,
      'max_funds': calc_maxBotFunds(maxDealFunds, max_active_deals),
      'max_funds_per_deal': maxDealFunds,
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
      price_deviation: calc_deviation(+max_safety_orders, +safety_order_step_percentage, +martingale_step_coefficient),
      maxCoveragePercent: null
    }
  })


  return responseArray
}

/**
   * @param {number} deal_id The deal id of an active deal
   * 
   * @description Fetching market orders for bots that are active and have active market orders
   * @api_docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/deals_api.md#deal-safety-orders-permission-bots_read-security-signed
   */
async function getMarketOrders(deal_id: number) {
  const api = threeCapi(config)
  if (!api) return false

  // this is the /market_orders endpoint.
  let apiCall = await api.getDealSafetyOrders(deal_id)

  let manualSOs = []

  for (let order of apiCall) {
    let { deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price } = order

    // deal_order_type - values [ Active, Filled, Cancelled ]
    if (deal_order_type === "Manual Safety") {
      manualSOs.push({
        deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price
      })
    }
  }
  return {
      filled: <[] | Type_MarketOrders[]>manualSOs.filter(deal => deal.status_string === 'Filled'),
      failed: <[] | Type_MarketOrders[]>manualSOs.filter(deal => deal.status_string === 'Cancelled'),
      active: <[] | Type_MarketOrders[]>manualSOs.filter(deal => deal.status_string === 'Active')
    }
  
}

async function getActiveDeals() {
  const api = threeCapi(config)
  if (!api) return []

  const response: Type_Deals_API[] = await api.getDeals({ limit: 500, scope: 'active' })

  return response


}

let activeDealIDs = <number[]>[]


/**
 * 
 * @param {number} offset - Total to sync per update
 * @returns object array of deals.
 */
async function getDealsUpdate(perSyncOffset: number, type: string) {
  const api = threeCapi(config)
  if (!api) return []

  if (type === 'autoSync') {
    const activeDeals = await getActiveDeals()
    const newActiveDealIds = activeDeals.map(deal => deal.id)

    if (activeDealIDs === newActiveDealIds) {
      return activeDeals
    }

    const updatedDeals = await getDealsThatAreUpdated(perSyncOffset)
    return [...activeDeals, ...updatedDeals]
  }

  return await getDealsThatAreUpdated(perSyncOffset)
}

async function getDealsThatAreUpdated(perSyncOffset: number) {
  const api = threeCapi(config)
  if (!api) return []

  let responseArray = [];
  let response: Type_Deals_API[];
  let offsetMax = 250000;
  let perOffset = (perSyncOffset) ? perSyncOffset : 1000;
  let oldestDate, newLastSyncTime;


  // converting the incoming dateUTC to the right format in case it's not done properly.
  let lastSyncTime = await config.get('syncStatus.deals.lastSyncTime');

  for (let offset = 0; offset < offsetMax; offset += perOffset) {

    // can look into using the from tag to filter on the last created deal.
    // this now filters out any deals that were cancelled or failed due a bug in how 3C reports that data.
    response = await api.getDeals({ limit: perOffset, order: 'updated_at', order_direction: 'desc', offset, scope: 'active, completed, finished' })

    // limiting the offset to just 5000 here. This can be adjusted but made for some issues with writing to Sheets.
    if (response.length > 0) { responseArray.push(...response) }

    // this pulls the oldest date of the final item in the array.
    oldestDate = new Date(response[response.length - 1].updated_at).getTime()


    if (offset == 0) {
      // desc order, so this is the most recent last sync time.
      newLastSyncTime = new Date(response[0].updated_at).getTime()
    }

    console.info({
      'responseArrayLength': responseArray.length,
      'currentResponse': response.length,
      offset,
      sync: {
        oldest: oldestDate,
        newest: new Date(response[0].updated_at).getTime()
      },
      newLastSyncTime,
      lastSyncTime
    })

    // breaking out of the loop if it's not a full payload OR the oldest deal is oldest deal comes before the last sync time.
    // This is not needed if 3C gives us the ability to sync based on an updatedAt date.
    if (response.length != perOffset || oldestDate <= lastSyncTime) { break; }

  }

  console.log('Response data Length: ' + responseArray.length)

  // updating the last sync time if it's actually changed.
  if (lastSyncTime != newLastSyncTime) { config.set('syncStatus.deals.lastSyncTime', newLastSyncTime) }

  return responseArray
}


async function deals(offset: number, type: string) {
  let deals = await getDealsUpdate(offset, type);
  // let botData = await bots();

  let dealArray = [];

  for (let deal of deals) {
    const {
      created_at, closed_at, bought_volume,
      base_order_volume, safety_order_volume,
      completed_safety_orders_count, martingale_volume_coefficient,
      final_profit_percentage, pair, id, actual_usd_profit,
      active_manual_safety_orders, bought_average_price,
      current_price, actual_profit, final_profit, active_safety_orders_count,
      completed_manual_safety_orders_count, current_active_safety_orders
    } = deal

    let { max_safety_orders } = deal
    const activeDeal = closed_at === null;
    const deal_hours = calc_dealHours(created_at, closed_at)

    // this fix is for a bug in 3C where the active SO can be greater than 0 with max safety orders being lower which causes a mis calculation and ignoring all the SOs.
    max_safety_orders = Math.max(completed_safety_orders_count + current_active_safety_orders, max_safety_orders)

    let market_order_data = <{filled: any[], failed: any[], active: any[]}>{filled: [], failed: [], active: []}

    // This potentially adds a heavy API call to each sync, requiring it to hit the manual SO endpoint every sync.
    // fetching market order information for any deals that are not closed.
    if (active_manual_safety_orders > 0 || completed_manual_safety_orders_count > 0){
      let fetched_market_order_data = await getMarketOrders(id)
      if(fetched_market_order_data) market_order_data = fetched_market_order_data
    } 

    let tempObject = {

      // this is recalculated based on the active and completed SOs
      max_safety_orders,
      realized_actual_profit_usd: (activeDeal) ? null : +actual_usd_profit,
      deal_hours,
      pair: pair.split("_")[1],
      currency: pair.split("_")[0],

      // updated this value to be accurate based on what's actually been completed
      completed_manual_safety_orders_count: market_order_data.filled.length,

      max_deal_funds: (activeDeal) ? calc_maxDealFunds_Deals(bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, market_order_data.active) : null,
      profitPercent: (activeDeal) ? null : ((final_profit_percentage / 100) / +deal_hours).toFixed(3),
      impactFactor: (activeDeal) ? (((bought_average_price - current_price) / bought_average_price) * (415 / (bought_volume ** 0.618))) / (actual_usd_profit / actual_profit) : null,
      closed_at_iso_string: (activeDeal) ? null : new Date(closed_at).getTime(),
      final_profit: +final_profit,
      final_profit_percentage: +final_profit_percentage
    }


    dealArray.push({
      ...deal,
      ...tempObject
    })


  }

  return dealArray
}


/**
 * 
 * @returns 
 * 
 * @docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/accounts_api.md#information-about-all-user-balances-on-specified-exchange--permission-accounts_read-security-signed
 */
async function getAccountDetail() {
  const api = threeCapi(config)
  if (!api) return false

  let accountData = await api.accounts()

  let array = [];

  for (let account of accountData) {

    // this loads the account balances from the exchange to 3C ensuring the numbers are updated
    await api.accountLoadBalances(account.id);

    // this is where we get the coins and position per account.
    let data = await api.accountTableData(account.id)

    const { name: account_name, exchange_name, market_code } = account
    // Load data into new array with only the columns we want and format them
    for (let row of data) {

      const { account_id, currency_code, percentage, position, btc_value, usd_value, on_orders, currency_slug } = row
      let tempObject = {
        id: account_id + "-" + currency_slug,
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
      }
      array.push(tempObject);
    }
  }

  return array
}

async function getAccountSummary(key: string, secret: string) {
  let api = threeCapi(config)
  if (key && secret) {
    api = threeCapi(config, key, secret)
  }
  if (!api) return false
  let accountData = await api.accounts()

  let array = []

  for (let account of accountData) {
    const { id, name } = account
    array.push({ id, name })
  }

  return array;
}



export {
  getDealsUpdate,
  getAccountDetail,
  deals,
  bots,
  getAccountSummary
}
