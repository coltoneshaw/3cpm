# Accound Endpoints

## Balance Chart Data
Endpoint - `GET /public/api/ver1/accounts/{account_id}/balance_chart_data`
Notes:

Response:
```javascript
[
  {
    date: 1619308800, // Epoch date in seconds
    usd: 147.76,
    btc: 0.002991,
    btc_deposit_amount: 0, // The deposit metrics only get updated when you deposit through 3commas
    usd_deposit_amount: 0  //
  },
  ...
    {
    date: 1627862400,
    usd: 15634.38,
    btc: 0.401757,
    btc_deposit_amount: 0,
    usd_deposit_amount: 0
  }
]
```


## Load Balances
Endpoint - `POST /ver1/accounts/{account_id}/load_balances`
Notes: This endpoint updates the data from your Exchange to 3Commas and returns an array of the account data.

Endpoint - `GET /ver1/accounts/{account_id}`
Notes: A response of the single account. Account ID is required.

Response:

```javascript
[
  {
    id: 30035777,
    auto_balance_period: 12,
    auto_balance_portfolio_id: null,
    auto_balance_currency_change_limit: null,
    autobalance_enabled: false,
    is_locked: false,
    smart_trading_supported: true,
    smart_selling_supported: true,
    available_for_trading: {},
    stats_supported: true,
    trading_supported: true,
    market_buy_supported: true,
    market_sell_supported: true,
    conditional_buy_supported: true,
    bots_allowed: true,
    bots_ttp_allowed: true,
    bots_tsl_allowed: false,
    gordon_bots_available: true,
    multi_bots_allowed: true,
    created_at: '2021-04-25T10:44:25.648Z',
    updated_at: '2021-06-22T04:46:28.128Z',
    last_auto_balance: null,
    fast_convert_available: true,
    grid_bots_allowed: true,
    api_key_invalid: false,
    nomics_id: 'binance_us',
    market_icon: 'https://3commas.io/img/exchanges/binance.png',
    supported_market_types: [ 'spot' ],
    api_key: '',
    name: 'Binance US', // name that has been configured within 3C
    auto_balance_method: 'time',
    auto_balance_error: null,
    lock_reason: null,
    btc_amount: '0.40997708013273871104906805092618080738584', // total funds converted to BTC as of the current day's close.
    usd_amount: '15583.4994007182860145243690006177437680686530544', // total funds available in USD
    day_profit_btc: '0.001122175123597340587318102804499239978062',
    day_profit_usd: '-24.8593853526494418137533084188808801097469456', // portfolio balance 30 days ago compared with today divided by 30.
    day_profit_btc_percentage: '0.02',
    day_profit_usd_percentage: '-0.14',
    btc_profit: '-0.01083926501132428895093194907381919261416', // trailing 30 day profit
    usd_profit: '629.9757352158860145243690006177437680686530544', // trailing 30 day profit
    usd_profit_percentage: '4.21',
    btc_profit_percentage: '-2.58',
    total_btc_profit: '0.4069863069789086',
    total_usd_profit: '15435.739595083216', // this appears to count every dollar deposited as profit.
    pretty_display_type: 'BinanceUs',
    exchange_name: 'Binance US',
    market_code: 'binance_us'
  }
]
```

