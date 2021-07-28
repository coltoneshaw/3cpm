// const { app } = require("electron");
const threeCommasAPI = require('3commas-api-node')
// const path = require("path");
// const appDataPath = app.getPath('appData');


const { config } = require('../../utils/config')

const { 
  calc_deviation, 
  calc_DealMaxFunds_bot, 
  calc_maxInactiveFunds, 
  calc_maxDealFunds_Deals, 
  calc_dealHours, 
  getBotName,
  calc_maxBotFunds
} = require('../../utils/formulas')

/**
 * 
 * @param {object} config This is the config string at the time of calling this function.
 * @returns the 3Commas API object.
 * 
 * @description - required at the moment so when you make a config change on the frontend you're not using old data.
 */
function threeCapi(config) {
  const api = new threeCommasAPI({
    apiKey: config.get('apis.threeC.key'),
    apiSecret: config.get('apis.threeC.secret')
  })

  return api
}

/**
 * 
 * 
 * 
 */

 const max_deal_funds = async (id, bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, active_manual_safety_orders) => {
  let market_order_data;

  // fetching market order information for any deals that are not closed.
  if (active_manual_safety_orders > 0) {
    market_order_data = await getMarketOrders(id)
  }
  return calc_maxDealFunds_Deals(bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, market_order_data)
}



async function bots() {
  const api = threeCapi(config)
  let data = await api.getBots();

  const dataArray = []

  for (bot of data) {

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
      enabled_active_funds, from_currency,
      enabled_inactive_funds, strategy
    } = bot

    let maxDealFunds = calc_DealMaxFunds_bot(max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient)
    let max_inactive_funds = calc_maxInactiveFunds( maxDealFunds, max_active_deals, active_deals_count )


    


    const tempObject = {
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
      'max_funds': calc_maxBotFunds( maxDealFunds, max_active_deals),
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
      type,
      drawdown: 0,
      price_deviation: calc_deviation( +max_safety_orders, +safety_order_step_percentage, +martingale_step_coefficient)
    }

    dataArray.push(tempObject)
  }

  return dataArray
}

/**
   * @param {number} deal_id The deal id of an active deal
   * 
   * @description Fetching market orders for bots that are active and have active market orders
   * @api_docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/deals_api.md#deal-safety-orders-permission-bots_read-security-signed
   */
async function getMarketOrders(deal_id) {
  const api = threeCapi(config)

  // this is the /market_orders endpoint.
  let apiCall = await api.getDealSafetyOrders(deal_id)

  let dataArray = []

  for (order of apiCall) {
    let { deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price } = order

    if (deal_order_type === "Manual Safety") {
      dataArray.push({
        deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price
      })
    }
  }
  return dataArray
}

/**
 * 
 * @param {*} api 
 * @param {*} limit 
 * @returns 
 * @description - DO NOT USE THIS FUNCTION AT THE MOMENT
 */
async function getDealsBulk(limit) {

  let responseArray = [];
  let response;
  let offsetMax = (!limit) ? 250000 : limit;

  for (offset = 0; offset < offsetMax; offset += 1000) {

    response = await api.getDeals({ scope: 'completed', limit: 1000, offset })

    // limiting the offset to just 5000 here. This can be adjusted but made for some issues with writing to Sheets.
    if (response.length > 0) {
      responseArray.push(...response)
    }

    console.info({
      'responseArrayLength': responseArray.length,
      'currentResponse': response.length,
      offset,
      id: response[0].id
    })

    if (response.length != 1000) {
      break;
    }

    // if(offset == offsetMax){ break; }


  }

  console.log('Response data Length: ' + responseArray.length)
  return responseArray

}

/**
 * 
 * @param {number} limit - This sets the max amount of deals to sync. Default is at 250k as a global param
 * @returns object array of deals.
 */
async function getDealsUpdate(limit) {
  const api = threeCapi(config)

  let responseArray = [];
  let response;
  let offsetMax = (!limit) ? config.get('general.globalLimit') : limit;
  let oldestDate, newLastSyncTime;



  // converting the incoming dateUTC to the right format in case it's not done properly.
  // let lastSyncTime = await config.get('syncStatus.deals.lastSyncTime');

  /**
   * FIX THIS BEFORE RELEASING. THIS IS HARD CODING THE DATE
   */
  let lastSyncTime = 1617249600000;

  console.error('the date has been hard coded. Fix this before releasing. Additionally, change the limit back to 500')

  for (offset = 0; offset < offsetMax; offset += 1000) {

    // can look into using the from tag to filter on the last created deal.
    response = await api.getDeals({ limit: 1000, order: 'updated_at', order_direction: 'desc', offset })

    // limiting the offset to just 5000 here. This can be adjusted but made for some issues with writing to Sheets.
    if (response.length > 0) { responseArray.push(...response) }

    console.log(response[0].updated_at)
    console.log(response[response.length - 1].updated_at)



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
    if (response.length != 1000 || oldestDate <= lastSyncTime) { break; }

  }

  console.log('Response data Length: ' + responseArray.length)

  // updating the last sync time if it's actually changed.
  if (lastSyncTime != newLastSyncTime) { config.set('syncStatus.deals.lastSyncTime', newLastSyncTime) }
  return responseArray

}


async function deals(limit) {
  let deals = await getDealsUpdate(limit);
  let botData = await bots();

  let dealArray = [];

  for (deal of deals) {
    const {
      created_at, closed_at, bought_volume,
      base_order_volume, safety_order_volume, max_safety_orders,
      completed_safety_orders_count, martingale_volume_coefficient,
      final_profit_percentage, pair, id, actual_usd_profit,
      bot_id, active_manual_safety_orders, bought_average_price,
      current_price, actual_profit, bot_name
    } = deal
    const activeDeal = (closed_at === null) ? true : false;
    const deal_hours = calc_dealHours(created_at, closed_at)

    let tempObject = {
      realized_actual_profit_usd: (activeDeal) ? null : +actual_usd_profit,
      deal_hours,
      pair: pair.split("_")[1],
      currency: pair.split("_")[0],
      bot_name: getBotName(botData, pair, bot_id, bot_name),
      max_deal_funds: (activeDeal) ? await max_deal_funds(id, bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, active_manual_safety_orders) : null,
      profitPercent: (activeDeal) ? null : ((final_profit_percentage / 100) / +deal_hours).toFixed(3),
      impactFactor: (activeDeal) ? (((bought_average_price - current_price) / bought_average_price) * (415 / (bought_volume ** 0.618))) / (actual_usd_profit / actual_profit) : null,
      closed_at_iso_string: (activeDeal) ? null : new Date(closed_at).getTime()
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

  let accountData = await api.accounts()
  let array = [];

  for (account of accountData) {
    let data = await api.accountTableData(account.id)

    const { name: account_name, exchange_name, market_code } = account
    // Load data into new array with only the columns we want and format them
    for (row of data) {

      const { account_id, currency_code, percentage, position, btc_value, usd_value, on_orders, currency_slug, equity } = row
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



module.exports = {
  getDealsBulk,
  getDealsUpdate,
  getAccountDetail,
  deals,
  bots
}
