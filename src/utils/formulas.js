
/**
 * 
 * @param {number} max_safety_orders mstc - the max SOs configured for the bot
 * @param {number} safety_order_step_percentage sos - the price deviation from the original buy.
 * @param {number} martingale_step_coefficient ss - the value that you multiply all SOs past the first by.
 * @returns number formatted toFixed(2) that represents a percent. Does not need to be multiplied by 100.
 */
const calc_deviation = (max_safety_orders, safety_order_step_percentage, martingale_step_coefficient) => {

    // setting the initial drawdown value.
    let drawdown = +safety_order_step_percentage
    let prevDeviation = +safety_order_step_percentage

    for (let so_count = 2; so_count <= +max_safety_orders; so_count++) {
        let so_deviation = (prevDeviation * martingale_step_coefficient)
        drawdown += so_deviation
        prevDeviation = so_deviation
    }
    return drawdown.toFixed(2)
}

/**
 * 
 * @param {number} max_safety_orders mstc - the max SOs configured for the bot
 * @param {number} base_order_volume bo - the buy order.
 * @param {number} safety_order_volume so - the safety order
 * @param {number} martingale_volume_coefficient os - the volume each SO will be multiplied by
 * @returns maxTotal that a single bot deal can consume
 */
 function calc_DealMaxFunds_bot(max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient) {
    let maxTotal = +base_order_volume
    for (so_count = 0; so_count < max_safety_orders; so_count++)
        maxTotal += safety_order_volume * martingale_volume_coefficient ** so_count
    return maxTotal
}

function calc_maxBotFunds( maxDealFunds, max_active_deals ) {
    return maxDealFunds * max_active_deals
}

const calc_availableFundsPerBot = (bankroll, enabledBotsCount) => {
    return bankroll / enabledBotsCount
}

function calc_maxSOReached(moneyAvailable, max_safety_orders, base_order_volume, safety_order_volume, martingale_volume_coefficient) {
    let maxTotal = base_order_volume + safety_order_volume
    let so_count = 2

    for (so_count; so_count <= max_safety_orders; so_count++){
        maxTotal += safety_order_volume * martingale_volume_coefficient ** (so_count - 1)

        if(maxTotal > moneyAvailable){
            return so_count - 1
        }
    }
    return so_count -1
}


const calc_dropCoverage = ( totalFundsAvailable, bot ) => {
    /*
    take the total bankroll / total enabled bots = money available for this bot

    calculate how many SOs I can fill based on that money available for the bot
    use the # of SOs filled to calculate what deviation downward I can fill.

    return { calc_SO, calc_deviation, money_available.}

    bring the money_available into the tool tip on the calculated fields.

    TODO
    - Make this return the funds available so they can be used in other calculations.
    */

    const { 
        safety_order_step_percentage, 
        martingale_step_coefficient, 
        max_safety_orders, 
        base_order_volume, 
        safety_order_volume, 
        martingale_volume_coefficient
     } = bot

    console.log(bot)
    const maxSoReached = calc_maxSOReached(+totalFundsAvailable, +max_safety_orders, +base_order_volume, +safety_order_volume, +martingale_volume_coefficient)
    
    const maxCoveragePercent = calc_deviation(+maxSoReached, +safety_order_step_percentage, +martingale_step_coefficient)
    console.log({maxCoveragePercent, maxSoReached, totalFundsAvailable})

    return {
        maxCoveragePercent,
        maxSoReached
    }
}



/**
 * 
 * @param {number} maxDealFunds calculated using one of the maxDealFunds calcs
 * @param {number} max_active_deals total number of active deals a bot is allowed
 * @param {number} active_deals_count how many deals are currently active
 * @returns the total max funds of bots that have inactive deals.
 */
function calc_maxInactiveFunds(maxDealFunds, max_active_deals, active_deals_count) {
    return maxDealFunds * (max_active_deals - active_deals_count)
}

/**
 * 
 * @param {number} bought_volume total volume bought
 * @param {number} base_order_volume bo - total that is purchased for a base order
 * @param {number} safety_order_volume so - total that is purchased for the initial SO
 * @param {number} max_safety_orders mstc - max safety orders allowed
 * @param {number} completed_safety_orders total amount of SOs that have been completed.
 * @param {number} martingale_volume_coefficient os - the volume each SO will be multiplied by
 * @param {object} market_order_data object that contains each market order ( manual safety trade / add funds )
 * @returns maxTotal - this is the total amount of funds that a single deal can consume.
 */
function calc_maxDealFunds_Deals(bought_volume, base_order_volume, safety_order_volume, max_safety_orders, completed_safety_orders, martingale_volume_coefficient, market_order_data) {
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

/**
 * 
 * @param {string} created_at the time the deal was created at
 * @param {string} closed_at time the deal closed
 * @returns hours as a number, fixed to 2.
 */
const calc_dealHours = (created_at, closed_at) => {

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

/**
 * 
 * @param {array} botData array of bot objects
 * @param {string} pair the pair this bot uses
 * @param {number} bot_id ID of the bot to search
 * @param {string} bot_name name of the bot.
 * @returns the bot name based on single / multi bot.
 */
const getBotName = (botData, pair, bot_id, bot_name) => {

    let bot_type = botData.find(bot => bot.id === bot_id)
    if (bot_type != undefined) {
      bot_type = bot_type.type.split('::')[1]
    } else {
      bot_type = "deleted"
    }
    return (bot_type === 'SingleBot') ? bot_name : `${bot_name} - ${pair}`
  }

module.exports = {
    calc_deviation,
    calc_DealMaxFunds_bot,
    calc_maxInactiveFunds,
    calc_maxDealFunds_Deals,
    calc_dealHours,
    getBotName,
    calc_maxBotFunds,
    calc_dropCoverage
}