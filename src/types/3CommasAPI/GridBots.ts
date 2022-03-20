export type GridBots3CAPI = {
  'id': number,
  'account_id': number,
  'account_name': string,
  'is_enabled': boolean,
  'grids_quantity': string,
  'created_at': string // "2021-06-17T16:58:44.450Z",
  'updated_at': string // "2021-06-24T19:52:56.525Z",
  'strategy_type': 'manual' | 'ai',
  'lower_price': string,
  'upper_price': string,
  'quantity_per_grid': string,
  'leverage_type': null | string,
  'leverage_custom_value': null | string,
  'name': string,
  'pair': string,
  'start_price': string,
  'grid_price_step': string,
  'current_profit': string,
  'current_profit_usd': string,
  'total_profits_count': string,
  'bought_volume': string,
  'sold_volume': string,
  'profit_percentage': string,
  'current_price': string,
  'investment_base_currency': string,
  'investment_quote_currency': string,
  'grid_lines': {
    'price': string,
    'side': null | string,
    'order_placed': boolean
  }[]
};

export type GridBotShow3CAPI = GridBots3CAPI & {
  editable: boolean
};

export type GridMarketOrders3CAPI = {
  'grid_lines_orders':
  {
    'order_id': string,
    'order_type': 'SELL' | 'BUY',
    'status_string': 'Filled' | string,
    'created_at': string,
    'updated_at': string,
    'quantity': string,
    'quantity_remaining': string,
    'total': string,
    'rate': string,
    'average_price': string
  }[],
  'balancing_orders': any[]
};

export type GridBotProfits3CAPI = {
  'grid_line_id': number,
  'profit': string,
  'usd_profit': string,
  'created_at': string
};

export type GridRequiredBalance3CAPI = {
  'need_balancing': boolean,
  'necessary_quantities': {
    'quantity': string,
    'currency': string
  }
};
