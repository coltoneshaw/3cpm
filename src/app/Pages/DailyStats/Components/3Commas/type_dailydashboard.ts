type QueryDealByPairByDayQuery = {
  pair: string[],
  averageHourlyProfitPercent: number,
  totalProfit: number,
  numberOfDeals: number,
  boughtVolume: number,
  averageDealHours: number
};

export type QueryDealByPairByDayReturn = QueryDealByPairByDayQuery & {
  percentTotalVolume: number;
  percentTotalProfit: number;
};

type BotQueryDealByDayQuery = {
  bot_name: string,
  bot_id: number,
  averageHourlyProfitPercent: number,
  totalProfit: number,
  numberOfDeals: number,
  boughtVolume: number,
  averageDealHours: number
};

export type BotQueryDealByDayReturn = BotQueryDealByDayQuery & {
  percentTotalVolume: number;
  percentTotalProfit: number;
};
