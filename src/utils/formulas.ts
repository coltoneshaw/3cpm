import { MarketOrdersType, QueryBotsType } from '@/types/3CommasApi';

/**
 *
 * @param {number} mstc max_safety_orders - the max SOs configured for the bot
 * @param sos safety_order_step_percentage - the price deviation from the original buy.
 * @param ss martingale_step_coefficient - the value that you multiply all SOs past the first by.
 * @returns number formatted toFixed(2) that represents a percent. Does not need to be multiplied by 100.
 */
const calcDeviation = (mstc: number, sos: number, ss: number) => {
  // setting the initial drawdown value.
  let drawdown = +sos;
  let prevDeviation = +sos;

  for (let soCount = 2; soCount <= +mstc; soCount += 1) {
    const soDeviation = (prevDeviation * ss);
    drawdown += soDeviation;
    prevDeviation = soDeviation;
  }
  return drawdown;
};

/**
 *
 * @param mstc max_safety_orders - the max SOs configured for the bot
 * @param bo base_order_volume - the buy order.
 * @param so safety_order_volume - the safety order
 * @param os martingale_volume_coefficient - the volume each SO will be multiplied by
 * @returns maxTotal that a single bot deal can consume
 */
function botPerDealMaxFunds(mstc: number, bo: number, so: number, os: number) {
  let maxTotal = +bo;
  for (let soCount = 0; soCount < mstc; soCount += 1) {
    maxTotal += so * os ** soCount;
  }
  return maxTotal;
}
/**
 *
 * @param maxDealFunds max possible funds per bot deal
 * @param mad max active deals for the bot
 * @returns total of max active * max funds
 */
function calcBotMaxFunds(maxDealFunds: number, mad: number) {
  return maxDealFunds * mad;
}

/**
 *
 * @param moneyAvailable Total bankroll to be useable
 * @param mstc max_safety_orders - the max SOs configured for the deal
 * @param bo base_order_volume - the buy order.
 * @param so safety_order_volume - the safety order
 * @param os martingale_volume_coefficient os - the volume each SO will be multiplied by
 * @returns Max SO that you can reach with funds provided
 */
function calcMaxSOReached(
  moneyAvailable: number,
  mstc: number,
  bo: number,
  so: number,
  os: number,
) {
  let maxTotal = bo + so;
  let soCount = 2;

  for (soCount; soCount <= mstc; soCount += 1) {
    let newTotal = os ** (soCount - 1);
    newTotal *= so;
    maxTotal += newTotal;

    if (maxTotal > moneyAvailable) {
      return soCount - 1;
    }
  }
  return soCount - 1;
}

/**
 *
 * @param totalFundsAvailable Total funds available, usually bankroll
 * @param bot bot info from the database
 * @returns Max coverage percent (deviation) and the max SO reached with that deviation
 */
const calcDropCoverage = (
  totalFundsAvailable: number,
  bot: QueryBotsType,
) => {
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    safety_order_step_percentage,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    martingale_step_coefficient,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    max_safety_orders,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    base_order_volume,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    safety_order_volume,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    martingale_volume_coefficient,
  } = bot;

  const maxSoReached = calcMaxSOReached(
    +totalFundsAvailable,
    +max_safety_orders,
    +base_order_volume,
    +safety_order_volume,
    +martingale_volume_coefficient,
  );

  const maxCoveragePercent = calcDeviation(
    +maxSoReached,
    +safety_order_step_percentage,
    +martingale_step_coefficient,
  );

  return {
    maxCoveragePercent,
    maxSoReached,
  };
};

/**
 *
 * @param {number} maxDealFunds calculated using one of the maxDealFunds calcs
 * @param {number} mad max_active_deals total number of active deals a bot is allowed
 * @param {number} active_deals_count how many deals are currently active
 * @returns the total max funds of bots that have inactive deals.
 *
 */
function calcBotMaxInactiveFunds(
  maxDealFunds: number,
  mad: number,
  active_deals_count: number,
) {
  // using this metric as a max because max_active_deals is a bot config setting and can be lower than the current active deals.
  // this causes a negative to be introduced and skews max_inactive_funds to a negative value.
  const maxActiveOrCount = Math.max(mad, active_deals_count);
  const maxDeals = maxActiveOrCount - active_deals_count;
  return maxDealFunds * maxDeals;
}

/**
 *
 * @param {number} bought_volume total volume bought
 * @param {number} bo base_order_volume - total that is purchased for a base order
 * @param {number} so safety_order_volume - total that is purchased for the initial SO
 * @param {number} mstc max_safety_orders - max safety orders allowed
 * @param {number} completedSOs completed_safety_orders total amount of SOs that have been completed.
 * @param {number} os martingale_volume_coefficient - the volume each SO will be multiplied by
 * @param {object} market_order_data object that contains each market order ( manual safety trade / add funds )
 * @returns maxTotal - this is the total amount of funds that a single deal can consume.
 */
function calcDealMaxFunds(
  boughtVolume: number,
  bo: number,
  so: number,
  mstc: number,
  completedSOs: number,
  os: number,
  market_order_data: MarketOrdersType[] | undefined,
) {
  let maxTotal = +bo;

  if (+boughtVolume > 0) maxTotal = +boughtVolume;

  for (let soCount = completedSOs + 1; soCount <= mstc; soCount += 1) {
    maxTotal += so * os ** (soCount - 1);
  }

  // add unfilled manual safety orders
  if (!(typeof market_order_data === 'undefined')) {
    market_order_data.forEach((order) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { quantity_remaining, rate } = order;
      maxTotal += quantity_remaining * +rate;
    });
  }
  return maxTotal;
}

/**
 *
 * @param {string} createdAt the time the deal was created at. ISO string
 * @param {string} closedAt time the deal closed. ISO string
 * @returns hours as a number, fixed to 2.
 */
const calcDealHours = (createdAt: string, closedAt: string) => {
  const endDate = closedAt === null ? Date.now() : Date.parse(closedAt);
  const milliseconds = Math.abs(Date.parse(createdAt) - endDate);
  const hours = milliseconds / 36e5;
  return +hours.toFixed(2);
};

const calcDropMetrics = (bankRoll: number, botData: QueryBotsType[]) => {
  /**
     * This function is responsible for taking the bot data, bankroll and outputting the new bot array with the metrics added.
     */
  if (botData === undefined || botData.length === 0) return [];

  const enabledBots = botData.filter((bot) => bot.is_enabled && !bot.hide);
  const fundsAvailable = bankRoll / enabledBots.length;
  return botData.map((bot) => {
    const dropMetrics = calcDropCoverage(fundsAvailable, bot);
    return {
      ...bot,
      ...dropMetrics,
      riskPercent: bot.max_funds / bankRoll,
    };
  });
};

type SafetyArray = {
  soCount: number
  deviation: number
  volume: number
};

/**
 * @param so safety_order_volume - total that is purchased for the initial SO
 * @param ss martingale_step_coefficient - the value that you multiply all SOs past the first by.
 * @param sos safety_order_step_percentage - the price deviation from the original buy.
 * @param mstc max_safety_orders - the max SOs configured for the deal
 * @param os martingale_volume_coefficient os - the volume each SO will be multiplied by
 * @returns
 */
const calcSafetyArray = (
  so: number,
  mstc: number,
  os: number,
  ss: number,
  sos: number,
) => {
  // setting the initial drawdown value.
  let drawdown = +sos;
  let prevDeviation = +sos;

  const safetyArray = <SafetyArray[]>[];

  safetyArray.push({
    soCount: 1,
    deviation: prevDeviation,
    volume: so,
  });

  for (let soCount = 2; soCount <= +mstc; soCount += 1) {
    const soDeviation = (prevDeviation * ss);
    const volume = so * os ** (soCount - 1);

    drawdown += soDeviation;
    prevDeviation = soDeviation;

    const safetyObject = {
      soCount,
      deviation: drawdown,
      volume,
    };

    safetyArray.push(safetyObject);
  }

  return safetyArray;
};

export {
  calcDeviation,
  botPerDealMaxFunds,
  calcBotMaxInactiveFunds,
  calcDealMaxFunds,
  calcDealHours,
  calcBotMaxFunds,
  calcDropMetrics,
  calcSafetyArray,
};

export const exportedForTesting = {
  calcMaxSOReached,
  calcDropCoverage,
};
