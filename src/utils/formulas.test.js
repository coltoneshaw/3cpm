/* eslint-disable no-undef */

const {
  calcDeviation,
  botPerDealMaxFunds,
  calcBotMaxFunds,
  calcBotMaxInactiveFunds,
  calcDealMaxFunds,
  calcDropMetrics,
  calcDealHours,
  calcSafetyArray,
  exportedForTesting: {
    calcMaxSOReached,
    calcDropCoverage,
  },
} = require('./formulas');

const bot = {
  // safety_order_step_percentage
  sos: 1.81,
  // martingale_step_coefficient
  ss: 1.28,
  // max_safety_orders
  mstc: 8,
  // base_order_volume
  bo: 10,
  // safety_order_volume
  so: 10,
  // martingale_volume_coefficient
  os: 1.31,
  // max active deals for the bot
  mad: 17,
  maxDealFunds: 257.51678538389115,
  maxTotalFunds: 4377.7853515261495,
};

const moneyAvailable = 180;
const maxCoveragePercent = 40.11580186023198;

test('Returns the correct deviation', () => {
  expect(calcDeviation(bot.mstc, bot.sos, bot.ss)).toBe(maxCoveragePercent);
});

test('Returns the correct max total for a single bot', () => {
  expect(
    botPerDealMaxFunds(bot.mstc, bot.bo, bot.so, bot.os),
  ).toBe(bot.maxDealFunds);
});

test('Returns the correct total bot max funds', () => {
  expect(calcBotMaxFunds(bot.maxDealFunds, bot.mad)).toBe(bot.maxTotalFunds);
});

test('Returns the correct max SO possible', () => {
  expect(
    calcMaxSOReached(moneyAvailable, bot.mstc, bot.bo, bot.so, bot.os),
  ).toBe(6);
});

test('Returns the correct drop coverage', () => {
  const testBot = {
    safety_order_step_percentage: bot.sos,
    martingale_step_coefficient: bot.ss,
    max_safety_orders: bot.mstc,
    base_order_volume: bot.bo,
    safety_order_volume: bot.so,
    martingale_volume_coefficient: bot.os,
  };
  expect(
    calcDropCoverage(moneyAvailable, testBot),
  ).toStrictEqual({ maxCoveragePercent: 21.965943518208, maxSoReached: 6 });
});

// eslint-disable-next-line max-len
test('Returns the correct bot max inactive funds for mad higher than active', () => {
  const activeDealsCount = bot.mad - 1;
  expect(
    calcBotMaxInactiveFunds(bot.maxDealFunds, bot.mad, activeDealsCount),
  ).toBe(bot.maxDealFunds * (bot.mad - activeDealsCount));
});

// eslint-disable-next-line max-len
test('Returns the correct bot max inactive funds for mad lower than active', () => {
  const activeDealsCount = bot.mad + 1;

  expect(
    calcBotMaxInactiveFunds(bot.maxDealFunds, bot.mad, activeDealsCount),
  ).toBe(0);
});

test('Returns the correct max deal funds without market order', () => {
  expect(
    calcDealMaxFunds(0, bot.bo, bot.so, bot.mstc, 0, bot.os, undefined),
  ).toBe(bot.maxDealFunds);
});

test('Returns the correct max deal funds with market order', () => {
  const marketOrder = [{
    quantity_remaining: 100,
    rate: 1,
  }];

  expect(
    calcDealMaxFunds(0, bot.bo, bot.so, bot.mstc, 0, bot.os, marketOrder),
  ).toBe(bot.maxDealFunds + 100);
});

test('Returns the correct total deal hours', () => {
  expect(
    calcDealHours('2022-03-09T00:00:00Z', '2022-03-09T21:00:00Z'),
  ).toBe(21);
});

test('Returns the correct drop metrics with bots', () => {
  const bots = [
    {
      is_enabled: true,
      safety_order_step_percentage: bot.sos,
      martingale_step_coefficient: bot.ss,
      max_safety_orders: bot.mstc,
      base_order_volume: bot.bo,
      safety_order_volume: bot.so,
      martingale_volume_coefficient: bot.os,
      max_funds: bot.maxTotalFunds,
    },
  ];
  expect(
    calcDropMetrics(1000, bots),
  ).toStrictEqual([{
    maxCoveragePercent,
    maxSoReached: 8,
    riskPercent: 4.37778535152615,
    ...bots[0],
  }]);
});

test('Returns the correct drop metrics without bots', () => {
  expect(
    calcDropMetrics(1000, []),
  ).toStrictEqual([]);
});

test('Returns the correct safety array', () => {
  expect(
    calcSafetyArray(bot.so, bot.mstc, bot.os, bot.ss, bot.sos),
  ).toStrictEqual([
    {
      deviation: 1.81,
      soCount: 1,
      volume: 10,
    },
    {
      deviation: 4.1268,
      soCount: 2,
      volume: 13.100000000000001,
    },
    {
      deviation: 7.092304,
      soCount: 3,
      volume: 17.161,
    },
    {
      deviation: 10.888149120000001,
      soCount: 4,
      volume: 22.480910000000005,
    },
    {
      deviation: 15.7468308736,
      soCount: 5,
      volume: 29.449992100000006,
    },
    {
      deviation: 21.965943518208,
      soCount: 6,
      volume: 38.57948965100001,
    },
    {
      deviation: 29.92640770330624,
      soCount: 7,
      volume: 50.53913144281001,
    },
    {
      deviation: 40.11580186023198,
      soCount: 8,
      volume: 66.20626219008112,
    },
  ]);
});
