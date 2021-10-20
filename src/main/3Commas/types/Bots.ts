import {threeCommas_Api_Deals} from './Deals'

export type Bots = {
        id: number,
        account_id: number,
        is_enabled: boolean,
        max_safety_orders: number,
        active_safety_orders_count: number,
        pairs: string[],
        strategy_list: {strategy: string}[],
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
        type: 'Bot::SingleBot',
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
        stop_loss_type: 'stop_loss',
        safety_order_volume_type: 'quote_currency' | 'base_currency',
        base_order_volume_type: 'quote_currency' | 'base_currency',
        account_name: string,
        trailing_deviation: string,
        finished_deals_profit_usd: string,
        finished_deals_count: string,
        leverage_type: 'not_specified' | string,
        leverage_custom_value: null,
        start_order_type: 'limit' | 'market',
        active_deals_usd_profit: string
}

export type ShowBot = Bots & {
    active_deals: threeCommas_Api_Deals[],
    bot_events?: {message: string, created_at:string}[]
}


export type GetBotsStats = {
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