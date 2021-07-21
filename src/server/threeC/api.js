const threeCommasAPI = require('3commas-api-node')
const config = require('../../utils/config');

//fetching the config keys from storage.
const configValues = config.all()
const globalDealLimit = configValues.general.globalLimit;
console.log(configValues)

const api = new threeCommasAPI({
  apiKey: configValues.apis.threeC.key,
  apiSecret: configValues.apis.threeC.secret,
})

async function bots() {
  let data = await api.getBots()
  return data
}

/**
   * @param {number} deal_id The deal id of an active deal
   * 
   * @description Fetching market orders for bots that are active and have active market orders
   * @api_docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/deals_api.md#deal-safety-orders-permission-bots_read-security-signed
   */
async function getMarketOrders(deal_id) {

  // this is the /market_orders endpoint.
  let apiCall = await api.getDealSafetyOrders(deal_id)

  let dataArray = []

  for (order of apiCall.data) {
    let { deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price } = order

    if (deal_order_type === "Manual Safety") {
      dataArray.push({
        deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price
      })
    }
  }
  return dataArray
}


async function getDealsBulk(limit) {

  let responseArray = [];
  let response;
  let offsetMax = (!limit) ? globalDealLimit : limit;

  for (offset = 0; offset < offsetMax; offset += 1000) {

    response = await api.getDeals({ scope: 'completed', limit: 1000 })

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

  let responseArray = [];
  let response;
  let offsetMax = (!limit) ? globalDealLimit : limit;
  let oldestDate, newLastSyncTime;

  // converting the incoming dateUTC to the right format in case it's not done properly.
  let lastSyncTime = configValues.syncStatus.deals.lastSyncTime;

  for (offset = 0; offset < offsetMax; offset += 500) {

    // can look into using the from tag to filter on the last created deal.
    response = await api.getDeals({ limit: 500, order: 'updated_at', order_direction: 'desc', offset })

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
    if (response.length != 500 || oldestDate <= lastSyncTime) { break; }

  }

  console.log('Response data Length: ' + responseArray.length)

  // updating the last sync time if it's actually changed.
  if (lastSyncTime != newLastSyncTime) { config.set('syncStatus.deals.lastSyncTime', newLastSyncTime) }
  return responseArray

}

async function deals() {
  let deals = await getDealsUpdate();
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


    const max_deal_funds = async (id, bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, active_manual_safety_orders) => {
      let market_order_data;

      // fetching market order information for any deals that are not closed.
      if (active_manual_safety_orders > 0) {
        market_order_data = await getMarketOrders(id)
      }
      return calculateMaxFunds_Deals(bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, market_order_data)
    }

    const bot_name_function = (botData, pair, bot_id, bot_name) => {

      let bot_type = botData.find(bot => bot.id === bot_id)
      if (bot_type != undefined) {
        bot_type = bot_type.type.split('::')[1]
      } else {
        bot_type = "deleted"
      }

      return (bot_type === 'SingleBot') ? bot_name : `${bot_name} - ${pair}`

    }

    const deal_hours_function = (created_at, closed_at) => {

      created_at = Date.parse(created_at)
      let endDate;

      if (closed_at === null) {
          endDate = Date.now()
      } else {
          endDate = Date.parse(closed_at)
      }
      let milliseconds = Math.abs(created_at - endDate);
      const hours = milliseconds / 36e5;
      return +hours.toFixed(2)
  }
    const deal_hours = deal_hours_function(created_at, closed_at)

    let tempObject = {
      realized_actual_profit_usd: (activeDeal) ? null : +actual_usd_profit,
      deal_hours,
      pair: pair.split("_")[1],
      currency: pair.split("_")[0],
      bot_name: bot_name_function(botData, pair, bot_id, bot_name),
      max_deal_funds: (activeDeal) ? await max_deal_funds(id, bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders_count, martingale_volume_coefficient, active_manual_safety_orders) : null,
      profitPercent: (activeDeal) ? null : ( (final_profit_percentage / 100) / +deal_hours).toFixed(3),
      impactFactor: (activeDeal) ? (((bought_average_price - current_price) / bought_average_price) * (415 / (bought_volume ** 0.618))) / (actual_usd_profit / actual_profit) : null,
    }


    dealArray.push({
      ...deal,
      ...tempObject
    })


  }

  return dealArray
}

// deals()


/**
 * 
 * @returns 
 * 
 * @docs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/accounts_api.md#information-about-all-user-balances-on-specified-exchange--permission-accounts_read-security-signed
 */
async function getAccountDetail() {
  let accountData = await api.accounts()
  let array = [];

  for (account of accountData) {
    let data = await api.accountTableData(account.id)
    console.log(data)

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


function calculateMaxFunds_bot(max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient) {
  let maxTotal = +base_order_volume
  for (so_count = 0; so_count < max_safety_orders; so_count++)
      maxTotal += safety_order_volume * martingale_volume_coefficient ** so_count
  return maxTotal
}


function calculateMaxFunds_Deals(bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders, martingale_volume_coefficient, market_order_data) {
  if (+bought_volume > 0)
      maxTotal = +bought_volume;
  else
      maxTotal = +base_order_volume

  for (so_count = completed_safety_orders + 1; so_count <= max_safety_orders; so_count++) {
      maxTotal += safety_order_volume * martingale_volume_coefficient ** (so_count - 1)
  }

  // add unfilled manual safety orders
  if (!(typeof market_order_data === 'undefined')) {
      for (order of market_order_data) {
          let {
              deal_order_type, status_string, quantity, quantity_remaining, total, rate, average_price
          } = order

          if (status_string == "Active") {
              maxTotal += quantity_remaining * +rate
          }
      }
  }
  return maxTotal
}



exports.bots = bots
exports.getDealsBulk = getDealsBulk;
exports.getDealsUpdate = getDealsUpdate;
exports.getAccountDetail = getAccountDetail;
exports.deals = deals;