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

# Deals Endpoint

```javascript
{
id: 1                                     
type: Deal::ShortDeal                     
bot_id: 111                               
max_safety_orders: 2                      
deal_has_error: true                      
from_currency_id: 5                      DEPRECATED 
to_currency_id: 10                       DEPRECATED 
account_id: 121                           
active_safety_orders_count: 1         // do not use this endpoint, it's not reliable    
created_at: 2018-08-08 08:08:08           
updated_at: 2018-09-09 09:09:09           
closed_at: 2018-10-10 10:10:10            
finished?:                                
current_active_safety_orders_count: 1     // this will not always match active_safety_orders_count
current_active_safety_orders: 1          DEPRECATED 
completed_safety_orders_count: 2         completed safeties (not including manual) 
completed_manual_safety_orders_count: 2  completed manual safeties 
cancellable?:                             
panic_sellable?:                          
trailing_enabled: true                    
tsl_enabled: true                         
stop_loss_timeout_enabled: true           
stop_loss_timeout_in_seconds: 2           
active_manual_safety_orders: 2            
pair: 'BTC_ADA'                          Format: QUOTE_BASE 
status: 'failed'                         Values: created, base_order_placed, bought, cancelled, completed, failed, panic_sell_pending, panic_sell_order_placed, panic_sold, cancel_pending, stop_loss_pending, stop_loss_finished, stop_loss_order_placed, switched, switched_take_profit, ttp_activated, ttp_order_placed, liquidated, bought_safety_pending, bought_take_profit_pending, settled 
localized_status:                         
take_profit: '1.23'                      Percentage 
base_order_volume: '0.001'                
safety_order_volume: '0.0015'             
safety_order_step_percentage: '1.11'      
leverage_type: 'isolated'                 
leverage_custom_value: '20.1'             
bought_amount: '1.5'                      
bought_volume: '150'                      
bought_average_price: '100'               
base_order_average_price: '100'           
sold_amount: '1.5'                        
sold_volume: '150'                        
sold_average_price: '100'                 
take_profit_type: 'base'                 Values: base, total 
final_profit: '-0.00051'                  
martingale_coefficient: '1.2'            Percentage 
martingale_volume_coefficient: '1.0'     Percentage 
martingale_step_coefficient: '1.0'       Percentage 
stop_loss_percentage: '3.6'               
error_message: 'Error placing base order' 
profit_currency: 'quote_currency'        Values: quote_currency, base_currency 
stop_loss_type: 'stop_loss'              Values: stop_loss, stop_loss_and_disable_bot 
safety_order_volume_type: 'quote_currency'Values: quote_currency, base_currency, percent, xbt 
base_order_volume_type: 'base_currency,' Values: quote_currency, base_currency, percent, xbt 
from_currency: 'BTC'                      
to_currency: 'ADA'                        
current_price: '102'                      
take_profit_price: '105'                  
stop_loss_price: '95.3'                   
final_profit_percentage: '4.2'            
actual_profit_percentage: '3.4'           
bot_name: My bot                          
account_name: My Account                  
usd_final_profit: '3.3523452' // Use this metric for calculating stats.           
actual_profit: '0.0023'                   
actual_usd_profit: '0.0023' // This value will show a value, even if the deal is cancelled / failed. Do not use this field for metric calculations. This may be tied to the coin somehow...
failed_message: Failed                    
reserved_base_coin: 1.3423523             
reserved_second_coin: 0.1412454           
trailing_deviation: 0.14                  
trailing_max_price: 0.1412454            Highest price met in case of long deal, lowest price otherwise 
tsl_max_price: 0.1412454                 Highest price met in TSL in case of long deal, lowest price otherwise 
strategy: 'short'                        short or long 
reserved_quote_funds:                    Sum of reserved in active deals funds in QUOTE 
reserved_base_funds:                     Sum of reserved in active deals funds in BASE 
} 
```

## Market orders

Endpoint: `GET /ver1/deals/{deal_id}/market_orders`



```javascript
[
    {
        "order_id": "MATICUSD_166773403",
        "order_type": "BUY",
        "deal_order_type": "Manual Safety",
        "cancellable": false,
        "status_string": "Filled",
        "created_at": "2021-09-08T23:08:13.796Z",
        "updated_at": "2021-09-08T23:08:13.830Z",
        "quantity": "2490.0",
        "quantity_remaining": "0.0",
        "total": "3376.4804625",
        "rate": "1.357",
        "average_price": "1.355"
    },
    {
        "order_id": "MATICUSD_166772169",
        "order_type": "BUY",
        "deal_order_type": "Manual Safety",
        "cancellable": false,
        "status_string": "Cancelled",
        "created_at": "2021-09-08T23:06:52.548Z",
        "updated_at": "2021-09-08T23:07:48.685Z",
        "quantity": "2506.7",
        "quantity_remaining": "2506.7",
        "total": "0.0",
        "rate": "1.348",
        "average_price": "0.0"
    },
    ```