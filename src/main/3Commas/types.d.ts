export type CurrencyRatesParams = {
  pretty_display_type?: string, // deprecated
  market_code: 'binance' | 'binance_us'
  pair: string // EX: USDT_BTC
};

export type GetBotsParams = {
  limit?: number, // max limit 100
  offset?: number,
  from?: string,
  account_id?: number,
  scope?: 'enabled' | 'disabled',
  strategy?: 'long' | 'short',
  sort_by?: 'profit' | 'created_at' | 'updated_at',
  sort_direction?: 'asc' | 'desc',
  quote?: string
};

export type GridBotParams = {
  account_ids: number[],
  account_types: string[],
  state: 'enabled' | 'disabled',
  sort_by?: 'current_profit' | 'profit' | 'bot_id' | 'pair' | 'created_at' | 'updated_at',
  sort_direction?: 'asc' | 'desc',
  limit?: 10, // max limit 100
  offset?: number,
  from?: string,
  base?: string,
  quote?: string
};

export type UpdateDealRequest = {
  deal_id: number
  take_profit?: number
};

export type GetBotStatsParams = {
  account_id?: string,
  bot_id?: null | string
};
