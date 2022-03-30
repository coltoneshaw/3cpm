/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

type SupportedCurrencies =
  'AUD' | 'BIDR' | 'BNB' | 'BRL' | 'BTC' | 'BUSD' | 'BVND' | 'DAI' | 'ETH' | 'EUR' | 'GBP' | 'IDRT'
  | 'NGN' | 'RUB' | 'TRX' | 'TRY' | 'TUSD' | 'UAH' | 'USD' | 'USDC' | 'USDT' | 'USDP' | 'VAI' | 'XRP';

export namespace Deals {
  type DealStatus =
    'created' | 'base_order_placed' | 'bought' | 'cancelled' | 'completed' | 'failed' | 'panic_sell_pending'
    | 'panic_sell_order_placed' | 'panic_sold' | 'cancel_pending' | 'stop_loss_pending' | 'stop_loss_finished'
    | 'stop_loss_order_placed' | 'switched' | 'switched_take_profit' | 'ttp_activated' | 'ttp_order_placed'
    | 'liquidated' | 'bought_safety_pending' | 'bought_take_profit_pending' | 'settled';

  type BotEvents = {
    'message': string
    'created_at': string
  };

  namespace Params {
    type Scopes = 'active' | 'finished' | 'completed' | 'cancelled' | 'failed';
    interface GetDeals {
      limit?: number;
      offset?: number;
      from?: string;
      account_id?: number;
      bot_id?: number;
      scope?: Scopes[] | null;
      order?: 'created_at' | 'updated_at' | 'closed_at' | 'profit' | 'profit_percentage';
      order_direction?: 'asc' | 'desc';
      base?: string;
      quote?: string
    }

    interface UpdateDeal {
      deal_id: number;
      take_profit?: number;
      profit_currency?: 'quote_currency' | 'base_currency';
      take_profit_type?: string;
      trailing_enabled?: boolean;
      trailing_deviation?: number;
      stop_loss_percentage?: number;
      max_safety_orders?: number;
      active_safety_orders_count?: number;
      stop_loss_timeout_enabled?: boolean;
      stop_loss_timeout_in_seconds?: number;
      tsl_enabled?: boolean;
      stop_loss_type?: 'stop_loss' | 'stop_loss_and_disable_bot';
      close_timeout?: number
    }
  }

  namespace Responses {
    interface MarketOrders {
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
    }

    interface Deal {
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
      status: DealStatus;
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
      from_currency: SupportedCurrencies;
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
      bot_events: BotEvents[]
    }
  }

}

export namespace Accounts {

  type MarketCodes = 'binance_us';
  namespace Params {
    interface GetAccounts {
      page: number;
      per_page: number;
    }

    interface CurrencyRates {
      pretty_display_type?: string, // deprecated
      market_code?: 'binance' | 'binance_us'
      pair: string; // EX: USDT_BTC
      limit_type
    }
  }
  namespace Responses {
    interface Account {
      id: number;
      auto_balance_period: number;
      auto_balance_portfolio_id: number | null;
      auto_balance_currency_change_limit: number | null;
      autobalance_enabled: boolean;
      hedge_mode_available: boolean;
      hedge_mode_enabled: boolean;
      is_locked: boolean;
      smart_trading_supported: boolean;
      smart_selling_supported: boolean; // deprecated
      available_for_trading: {} | boolean; // on api call this may be an object... but it's a boolean
      stats_supported: boolean;
      trading_supported: boolean;
      market_buy_supported: boolean;
      market_sell_supported: boolean;
      conditional_buy_supported: boolean;
      bots_allowed: boolean;
      bots_ttp_allowed: boolean;
      bots_tsl_allowed: boolean;
      gordon_bots_available: boolean;
      multi_bots_allowed: boolean;
      created_at: string; // ISO Z string
      updated_at: string; // ISO Z string
      last_auto_balance: null;
      fast_convert_available: boolean; // Sell all to USD/BTC possibility
      grid_bots_allowed: boolean;
      api_key_invalid: false;
      nomics_id: string | 'binance_us';
      market_icon: string; // https url
      deposit_enabled: boolean;
      supported_market_types: ['spot'];
      api_key: string;
      name: string;
      auto_balance_method: 'time' | 'currency_change';
      auto_balance_error: null | string;
      customer_id: null;
      subaccount_name: null;
      lock_reason: null | string;
      btc_amount: string;
      usd_amount: string;
      day_profit_btc: string;
      day_profit_usd: string;
      day_profit_btc_percentage: string;
      day_profit_usd_percentage: string;
      btc_profit: string; // Month period
      usd_profit: string; //  Month period
      usd_profit_percentage: string; //  Month period
      btc_profit_percentage: string; //  Month period
      total_btc_profit: string;
      total_usd_profit: string;
      pretty_display_type: string;
      exchange_name: string;
      market_code: MarketCodes
    }

    interface PieChartData {
      code: string,
      coinmarketcapid: string,
      name: string,
      y: number,
      percentage: number,
      amount: number,
      btc_value: string,
      usd_value: string,
      account_id: number
    }

    interface AccountTableData {
      currency_code: string,
      currency_name: string,
      currency_icon: URL,
      currency_slug: string,
      percentage: number,
      position: number,
      position_type: number,
      borrowed: number,
      on_orders: number,
      on_orders_long: number,
      on_orders_short: number,
      equity: number,
      current_price: BigInteger,
      current_price_usd: number,
      day_change_percent: number,
      day_change_percent_btc: number,
      day_change_percent_usd: number,
      btc_value: number,
      usd_value: number,
      available_long: number,
      available_short: number,
      available_with_leverage_long: number,
      available_with_leverage_short: number,
      account_id: number
    }
  }
}

export namespace Bots {
  namespace Params {
    interface GetBots {
      limit?: number, // max limit 100
      offset?: number,
      from?: string,
      account_id?: number,
      scope?: 'enabled' | 'disabled',
      strategy?: 'long' | 'short',
      sort_by?: 'profit' | 'created_at' | 'updated_at',
      sort_direction?: 'asc' | 'desc',
      quote?: string
    }

    interface GetBotStats {
      account_id?: number;
      bot_id?: number;
    }

    interface BotShow {
      bot_id: number;
      include_events?: boolean;
    }
  }

  namespace Responses {
    interface Bot {
      id: number,
      account_id: number,
      is_enabled: boolean,
      max_safety_orders: number,
      active_safety_orders_count: number,
      pairs: string[],
      strategy_list: { strategy: string }[],
      max_active_deals: number,
      active_deals_count: number,
      deletable?: boolean,
      created_at: string,
      updated_at: string,
      trailing_enabled: boolean,
      tsl_enabled: boolean,
      deal_start_delay_seconds: null | string,
      stop_loss_timeout_enabled: boolean,
      stop_loss_timeout_in_seconds: number,
      disable_after_deals_count: null | string,
      deals_counter: null | string,
      allowed_deals_on_same_pair: null | boolean,
      easy_form_supported: boolean,
      close_deals_timeout: null | string,
      url_secret: string,
      name: string,
      take_profit: string,
      base_order_volume: string,
      safety_order_volume: string,
      safety_order_step_percentage: string,
      take_profit_type: 'total',
      type: 'Bot::SingleBot' | 'Bot::MultiBot',
      martingale_volume_coefficient: string,
      martingale_step_coefficient: string,
      stop_loss_percentage: string,
      cooldown: string,
      btc_price_limit: string,
      strategy: 'long' | 'short',
      min_volume_btc_24h: string,
      profit_currency: 'quote_currency' | 'base_currency',
      min_price: null | 'quote_currency',
      max_price: null | 'quote_currency',
      stop_loss_type: 'stop_loss' | 'stop_loss_and_disable_bot'
      safety_order_volume_type: 'quote_currency' | 'percent',
      base_order_volume_type: 'quote_currency' | 'percent',
      account_name: string,
      trailing_deviation: string,
      finished_deals_profit_usd: string,
      finished_deals_count: string,
      leverage_type: 'not_specified' | string,
      leverage_custom_value: null,
      start_order_type: 'limit' | 'market',
      active_deals_usd_profit: string
    }

    interface BotStats {
      overall_stats: {
        USD?: string,
        BUSD?: string,
        USDT?: string,
      },
      today_stats: {
        USD?: string,
        BUSD?: string,
        USDT?: string,
      },
      profits_in_usd: {
        overall_usd_profit: number,
        today_usd_profit: number,
        active_deals_usd_profit: number,
        funds_locked_in_active_deals: number
      }
    }
  }
}
