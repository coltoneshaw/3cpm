export type FetchDealDataFunctionQuery = {
  closed_at_str: string,
  final_profit: number
  deal_hours: number
  total_deals: number
};

export type FetchPerformanceData = {
  performance_id: string,
  bot_name: string,
  pair: string[],
  averageHourlyProfitPercent: number,
  total_profit: number,
  number_of_deals: number,
  bought_volume: number,
  averageDealHours: number
};

export type FetchBotPerformanceMetrics = {
  bot_id: number,
  pairs: string,
  total_profit: string,
  avg_profit: number,
  number_of_deals: number,
  bought_volume: number,
  avg_deal_hours: number,
  avg_completed_so: number,
  bot_name: string,
  type: 'Bot::SingleBot' | 'Bot::MultiBot'
};

export type FetchPairPerformanceMetrics = {
  pair: string
  avg_completed_so: number
  total_profit: number
  number_of_deals: number
  avg_profit: number
  bought_volume: number
  avg_deal_hours: number
};

export type FetchSoData = {
  completed_safety_orders_count: number,
  total_profit: number,
  total_deals: number
};
