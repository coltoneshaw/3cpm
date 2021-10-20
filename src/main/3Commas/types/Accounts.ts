export type accounts = {
    id: number,
    auto_balance_period: number,
    auto_balance_portfolio_id: number | null,
    auto_balance_currency_change_limit: number | null,
    autobalance_enabled: boolean,
    hedge_mode_available: boolean,
    hedge_mode_enabled: boolean,
    is_locked: boolean,
    smart_trading_supported: boolean,
    smart_selling_supported: boolean, // deprecated
    available_for_trading: {} | boolean, // on api call this may be an object... but it's a boolean
    stats_supported: boolean,
    trading_supported: boolean,
    market_buy_supported: boolean,
    market_sell_supported: boolean,
    conditional_buy_supported: boolean,
    bots_allowed: boolean,
    bots_ttp_allowed: boolean,
    bots_tsl_allowed: boolean,
    gordon_bots_available: boolean,
    multi_bots_allowed: boolean,
    created_at: string , // ISO Z string
    updated_at: string, // ISO Z string
    last_auto_balance: null,
    fast_convert_available: boolean, //Sell all to USD/BTC possibility 
    grid_bots_allowed: boolean,
    api_key_invalid: false,
    nomics_id: string | 'binance_us',
    market_icon: string, // https url
    deposit_enabled: boolean,
    supported_market_types: ['spot'],
    api_key: string,
    name: 'Binance US',
    auto_balance_method: 'time' | 'currency_change',
    auto_balance_error: null | string,
    customer_id: null,
    subaccount_name: null,
    lock_reason: null | string,
    btc_amount: string,
    usd_amount: string,
    day_profit_btc: string,
    day_profit_usd: string,
    day_profit_btc_percentage: string,
    day_profit_usd_percentage: string,
    btc_profit: string, // Month period 
    usd_profit: string, //  Month period 
    usd_profit_percentage: string, //  Month period 
    btc_profit_percentage: string, //  Month period 
    total_btc_profit: string,
    total_usd_profit: string,
    pretty_display_type: string,
    exchange_name: string,
    market_code: 'binance_us'
}

export type AccountCurrencyRates = {
        last: string
        bid: string,
        ask: string,
        orderbook_ask: string,
        orderbook_bid: string,
        orderbook_last: string,
        orderbook_price_currency: 'USD',
        strategy_name: 'orderbook_price',
        contract_strategy_name: 'orderbook_price',
        minPrice: string,
        maxPrice: string,
        priceStep: string,
        minLotSize: string,
        lotStep: string,
        minTotal: string,
        maxMarketBuyAmount: string,
        maxMarketSellAmount: string,
        maxLotSize: string
}

export type AccountsMarketList = {
        market_name: string,
        market_url: URL,
        market_icon: URL,
        help_link: URL,
        nomics_id: string,
        market_code: string
}

export type AccountTableData = {
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

export type AccountPieChartData = {
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