export type MarketOrders3CAPI = {
  order_id: string
  deal_order_type: string;
  order_type: string // buy / sell
  status_string: 'Filled' | 'Cancelled' | 'Active';
  quantity: number;
  quantity_remaining: number;
  total: number;
  rate: number;
  average_price: number;
  cancellable: boolean
  created_at: string // ISO string
  updated_at: string // ISO string
};

export type Deals3CAPI = {
  id: number
  type: 'Deal'
  bot_id: number
  max_safety_orders: number
  deal_has_error: boolean
  from_currency_id: number // DEPRECATED
  to_currency_id: number // DEPRECATED
  account_id: number
  active_safety_orders_count: number
  created_at: string
  updated_at: string
  closed_at: string
  // closed_at_iso_string: number
  finished: boolean
  current_active_safety_orders_count: boolean
  current_active_safety_orders: number // DEPRECATED
  completed_safety_orders_count: number
  completed_manual_safety_orders_count: number
  cancellable: boolean
  panic_sellable: boolean
  trailing_enabled: boolean
  tsl_enabled: boolean
  stop_loss_timeout_enabled: boolean
  stop_loss_timeout_in_seconds: number
  active_manual_safety_orders: number
  pair: string
  status: 'created' | 'base_order_placed' | 'bought' | 'cancelled' | 'completed' | 'failed' | 'panic_sell_pending'
  | 'panic_sell_order_placed' | 'panic_sold' | 'cancel_pending' | 'stop_loss_pending' | 'stop_loss_finished'
  | 'stop_loss_order_placed' | 'switched' | 'switched_take_profit' | 'ttp_activated' | 'ttp_order_placed'
  | 'liquidated' | 'bought_safety_pending' | 'bought_take_profit_pending' | 'settled'
  localized_status: string
  take_profit: number // percent
  base_order_volume: string
  safety_order_volume: string
  safety_order_step_percentage: string
  leverage_type: string | 'not_specified'
  leverage_custom_value: string | null
  bought_amount: string | null
  bought_volume: string
  bought_average_price: string
  base_order_average_price: string
  sold_amount: string
  sold_volume: string
  sold_average_price: string
  take_profit_type: 'total'
  final_profit: string
  martingale_coefficient: string
  martingale_volume_coefficient: string
  martingale_step_coefficient: string
  stop_loss_percentage: string
  error_message: string | null
  profit_currency: 'quote_currency' | 'base_currency'
  stop_loss_type: 'stop_loss' | 'stop_loss_and_disable_bot'
  safety_order_volume_type: 'quote_currency' | 'percent'
  base_order_volume_type: 'quote_currency' | 'percent'
  from_currency: 'AUD' | 'BIDR' | 'BNB' | 'BRL' | 'BTC' | 'BUSD' | 'BVND' | 'DAI' | 'ETH' | 'EUR'
  | 'GBP' | 'IDRT' | 'NGN' | 'RUB' | 'TRX' | 'TRY' | 'TUSD' | 'UAH' | 'USD' | 'USDC' | 'USDT' | 'USDP' | 'VAI' | 'XRP'
  to_currency: string
  current_price: string
  take_profit_price: string
  stop_loss_price: string | null
  final_profit_percentage: string
  actual_profit_percentage: string
  bot_name: string
  account_name: string | null // usually null
  usd_final_profit: string
  actual_profit: string
  actual_usd_profit: string
  failed_message: string | null
  reserved_base_coin: string
  reserved_second_coin: string
  trailing_deviation: string | null
  trailing_max_price: string | null
  tsl_max_price: string | null
  strategy: 'long' | 'short'
  reserved_quote_funds: string
  reserved_base_funds: string
};

export type PreStorageDeals3cAPI = Deals3CAPI & {
  max_safety_orders: number;
  realized_actual_profit_usd: null | number;
  deal_hours: number;
  pair: string;
  currency: string;
  completed_manual_safety_orders_count: number;
  max_deal_funds: number | null;
  impactFactor: number | null;
  profitPercent: string | null;
  closed_at_iso_string: number | null
};

type BotEvent3CAPI = {
  'message': string
  'created_at': string
};

export type GetDeal3CAPI = Deals3CAPI & {
  'bot_events': BotEvent3CAPI[]
};
