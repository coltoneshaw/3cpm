import { FetchBotPerformanceMetrics, FetchPairPerformanceMetrics } from '@/webapp/Features/3Commas/Type_3Commas';

export type QueryPerformanceArray = {
  performance_id: string
  bot_name: string
  pair: string[]
  averageHourlyProfitPercent: number
  total_profit: number
  number_of_deals: number
  bought_volume: number
  averageDealHours: number
  percentTotalVolume: number
  percentTotalProfit: number
};

export type PairPerformanceMetrics = FetchPairPerformanceMetrics;

export type SODistributionArray = {
  completed_safety_orders_count: number // the actual SO level. 0 = BO.
  total_profit: number
  percent_total: number // percent of total profit at that SO level
  percent_deals: number // percent of deals against the total filtered at that SO level
  total_deals: number // total count of completed deals at that SO level
};

export type PerformanceMetrics = {
  pair_bot?: QueryPerformanceArray[] | []
  bot?: BotPerformanceMetrics[] | []
  pair?: PairPerformanceMetrics[] | []
  safety_order?: SODistributionArray[] | []
};

export type BotPerformanceMetrics = FetchBotPerformanceMetrics;

export type DealDataQuery = {
  final_profit: number,
  closed_at: string
  id: number
  deal_hours: number,
  total_deals: number
};

export type ProfitArray = {
  utc_date: string
  profit: number
  runningSum: number
  total_deals: number

};
export type Deals = {
  id: number // in use
  type: string // in use
  bot_id: number // in use
  max_safety_orders: number // in use
  deal_has_error: boolean
  from_currency_id: number // in use
  to_currency_id: number // in use
  account_id: number // in use
  active_safety_orders_count: number // in use
  created_at: string // in use
  updated_at: string // in use
  closed_at: string // in use
  closed_at_iso_string: number | null // in use
  finished: boolean // in use
  current_active_safety_orders_count: boolean // in use
  current_active_safety_orders: number // in use
  completed_safety_orders_count: number // in use
  completed_manual_safety_orders_count: number // in use
  cancellable: boolean
  panic_sellable: boolean
  trailing_enabled: boolean
  tsl_enabled: boolean
  stop_loss_timeout_enabled: boolean
  stop_loss_timeout_in_seconds: number
  active_manual_safety_orders: number // in use
  pair: string // in use
  status: string // in use
  localized_status: string
  take_profit: number // in use
  base_order_volume: number // in use
  safety_order_volume: number // in use
  safety_order_step_percentage: number // in use
  leverage_type: string
  leverage_custom_value: number
  bought_amount: number // in use
  bought_volume: number // in use
  bought_average_price: number
  base_order_average_price: number
  sold_amount: number
  sold_volume: number
  sold_average_price: number
  take_profit_type: string
  final_profit: number // in use
  martingale_coefficient: number
  martingale_volume_coefficient: number
  martingale_step_coefficient: number
  stop_loss_percentage: number
  error_message: string
  profit_currency: 'quote_currency' | 'base_currency'
  stop_loss_type: 'stop_loss' | 'stop_loss_and_disable_bot'
  safety_order_volume_type: 'quote_currency' | 'percent'
  base_order_volume_type: 'quote_currency' | 'percent'
  from_currency:
  'AUD' | 'BIDR' | 'BNB' | 'BRL' | 'BTC' | 'BUSD' | 'BVND' | 'DAI' | 'ETH' | 'EUR' | 'GBP'
  | 'IDRT' | 'NGN' | 'RUB' | 'TRX' | 'TRY' | 'TUSD' | 'UAH' | 'USD' | 'USDC' | 'USDT' | 'USDP' | 'VAI' | 'XRP'
  to_currency: string
  current_price: number
  take_profit_price: number
  stop_loss_price: number
  final_profit_percentage: number
  actual_profit_percentage: number
  bot_name: string
  account_name: string
  usd_final_profit: number
  actual_profit: number
  actual_usd_profit: number
  failed_message: string
  reserved_base_coin: number
  reserved_second_coin: number
  trailing_deviation: number
  trailing_max_price: number
  tsl_max_price: number
  strategy: 'long' | 'short'
  reserved_quote_funds: string
  reserved_base_funds: string
  realized_actual_profit_usd: number
  deal_hours: number
  currency: string
  max_deal_funds: number
  profitPercent: number
  impactFactor: number
};

export type ActiveDeals = Deals & {
  max_deal_funds: number
  bought_volume: number
  so_volume_remaining: number
};

export type QueryAccountsType = {
  currency_code: string
  id: number | string
  account_id: number
  account_name: string
  exchange_name: string
  percentage: number
  position: number
  on_orders: number
  btc_value: number
  usd_value: number
  market_code: string
};

export type PairByDateType = {
  date: string
  pair: string
  profit: number
};

export type BotsType = {
  id: number | string
  origin: string
  account_id: number
  account_name?: string
  name: string
  active_deals_count: number
  active_deals_usd_profit?: number
  active_safety_orders_count?: number
  base_order_volume: number
  safety_order_volume: number
  base_order_volume_type: 'quote_currency' | 'percent'
  safety_order_volume_type: 'quote_currency' | 'percent'
  created_at?: string
  updated_at?: string
  enabled_active_funds?: number
  enabled_inactive_funds: number
  finished_deals_count?: number
  finished_deals_profit_usd?: number
  // TODO - Fix this to pull the currencyKeys
  from_currency:
  'AUD' | 'BIDR' | 'BNB' | 'BRL' | 'BTC' | 'BUSD' | 'BVND' | 'DAI' | 'ETH' | 'EUR'
  | 'GBP' | 'IDRT' | 'NGN' | 'RUB' | 'TRX' | 'TRY' | 'TUSD' | 'UAH' | 'USD' | 'USDC' | 'USDT' | 'USDP' | 'VAI' | 'XRP'
  is_enabled: number | boolean

  // TODO -- all of these are null in the database. Why?
  martingale_coefficient?: number
  martingale_volume_coefficient: number
  martingale_step_coefficient: number
  max_active_deals: number
  max_funds: number
  max_funds_per_deal?: number
  max_inactive_funds?: number
  max_safety_orders: number
  profit_currency: string
  safety_order_step_percentage: number
  stop_loss_percentage: number
  strategy: string
  take_profit: number
  take_profit_type: string
  trailing_deviation: number
  type: string
  price_deviation: number

  // TODO - this is blank in the database
  // TODO - Need to break this into another type that extends bots since the data coming in does not have this.
  drawdown?: number
  maxCoveragePercent: number | null
  maxSoReached?: number
  hide: boolean
};

export type QueryBotsType = BotsType & {
  pairs: string
};

export type MetricDataType = {
  activeDealCount: number
  totalProfit_perf: number
  totalDeals: number
  boughtVolume: number
  averageDealHours: number
  averageDailyProfit: number
  totalBoughtVolume: number
  maxRisk: number
  totalProfit: number
  maxRiskPercent: number
  bankrollAvailable: number
  totalBankroll: number
  position: number
  on_orders: number // total number of funds in an exchange order that's not filled
  totalInDeals: number
  availableBankroll: number,
  reservedFundsTotal: number,
  totalClosedDeals: number, // total number of deals closed for the filtered time
  totalDealHours: number // this is the total hours in deals you have for the filtered time
  inactiveBotFunds: number // this is active bots that have an open deal (inactive funds).
  totalMaxRisk: number // adding maxRisk and inactiveBotFunds together.
};

export type MarketOrdersType = {
  order_id: string
  deal_order_type: string;
  order_type: string // buy / sell
  status_string: string;
  quantity: number;
  quantity_remaining: number;
  total: number;
  rate: number;
  average_price: number;
  cancellable: boolean
  created_at: string // ISO string
  updated_at: string // ISO string
};

export type ManualSOs = {
  deal_order_type: string;
  status_string: string,
  quantity: number,
  quantity_remaining: number,
  total: number,
  rate: number,
  average_price: number,
};
export interface UpdateFunctionType {
  offset: number
  time: number
  syncCount: number
}

// export interface SyncOptionsType {
//   time: number,
//   summary: boolean,
//   offset: number,
//   notifications: boolean
// }
