'use strict'
import crypto from "crypto";
import fetch from 'electron-fetch';
const log = require('electron-log');


const API_URL = 'https://api.3commas.io'

class threeCommasAPI {
    private _url: any;
    private _apiKey: any;
    private _apiSecret: any;
    private _mode: any;

    constructor(opts = {url: '', apiKey: '',  apiSecret: '',  mode: ''}) {
        this._url = opts.url ?? API_URL
        this._apiKey = opts.apiKey
        this._apiSecret = opts.apiSecret
        this._mode = opts.mode ?? 'real'
    }

    generateSignature (requestUri: string, reqData: string) {
        const request = requestUri + reqData
        return crypto.createHmac('sha256', this._apiSecret).update(request).digest('hex')
    }

    async makeRequest (method: string, path:string, params:any) {
        if (!this._apiKey || !this._apiSecret) {
            return new Error('missing api key or secret')
        }

        let u = new URLSearchParams();
        for(const key in params)
            u.append(key, params[key]);


        const sig = this.generateSignature(path, u.toString())

        try {
            let response = await fetch(
                `${this._url}${path}${u.toString()}`,
                {
                    method: method,
                    timeout: 30000,
                    headers: {
                        'APIKEY': this._apiKey,
                        'Signature': sig,
                        'Forced-Mode': this._mode
                    }
                }
            )

            return await response.json()
        } catch (e) {
            log.error(e);
            return false
        }
    }

    /**
     * Deals methods
     */

    async getDeals (params: any) {
        return await this.makeRequest('GET', '/public/api/ver1/deals?', params)
    }

    async dealUpdateMaxSafetyOrders (deal_id: string, max_safety_orders: any) {
        return await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/update_max_safety_orders?`, { deal_id, max_safety_orders })
    }

    async dealPanicSell (deal_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/panic_sell?`, { deal_id })
    }

    async dealCancel (deal_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/cancel?`, { deal_id })
    }

    async dealUpdateTp (deal_id: string, new_take_profit_percentage: any) {
        return await this.makeRequest('POST', `/public/api/ver1/deals/${deal_id}/update_tp?`, { deal_id, new_take_profit_percentage })
    }

    async getDeal (deal_id: string) {
        return await this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/show?`, { deal_id })
    }

    async getDealSafetyOrders (deal_id: string) {
        return await this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/market_orders?`, { deal_id })
    }

    async dealAddFunds (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/deals/${params.deal_id}/add_funds?`, params)
    }

    /**
     * Bots methods
     */

    async getBotsBlackList () {
        return await this.makeRequest('GET', `/public/api/ver1/bots/pairs_black_list?`, null)
    }

    async botsUpdateBlackList (params: any) {
        return await this.makeRequest('POST', '/public/api/ver1/bots/update_pairs_black_list?', params)
    }

    async botCreate (params: any) {
        return await this.makeRequest('POST', '/public/api/ver1/bots/create_bot?', params)
    }

    async getBots (params: any) {
        return await this.makeRequest('GET', `/public/api/ver1/bots?`, params)
    }

    async getBotsStats (params: any) {
        return await this.makeRequest('GET', `/public/api/ver1/bots/stats?`, params)
    }

    async botUpdate (params: any) {
        return await this.makeRequest('PATCH', `/public/api/ver1/bots/${params.bot_id}/update?`, params)
    }

    async botDisable (bot_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/disable?`, { bot_id })
    }

    async botEnable (bot_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/enable?`, { bot_id })
    }

    async botStartNewDeal (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/bots/${params.bot_id}/start_new_deal?`, params)
    }

    async botDelete (bot_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/delete?`, { bot_id })
    }

    async botPaniceSellAllDeals (bot_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/panic_sell_all_deals?`, { bot_id })
    }

    async botCancelAllDeals (bot_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/bots/${bot_id}/cancel_all_deals?`, { bot_id })
    }

    async botShow (bot_id: string) {
        return await this.makeRequest('GET', `/public/api/ver1/bots/${bot_id}/show?`, { bot_id })
    }

    /**
     * Smart Trades methods
     */

    async smartTradesCreateSimpleSell (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_simple_sell?`, params)
    }

    async smartTradesCreateSimpleBuy (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_simple_buy?`, params)
    }

    async smartTradesCreateSmartSell (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_smart_sell?`, params)
    }

    async smartTradesCreateSmartCover (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_smart_cover?`, params)
    }

    async smartTradesCreateSmartTrade (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/create_smart_trade?`, params)
    }

    async smartTrades (params: any) {
        return await this.makeRequest('GET', `/public/api/ver1/smart_trades?`, params)
    }

    async smartTradesV2 (params: any) {
        return await this.makeRequest('GET', `/public/api/v2/smart_trades?`, params)
    }

    async smartTradesStepPanicSell (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/${params.smart_trade_id}/step_panic_sell?`, params)
    }

    async smartTradesUpdate (params: any) {
        return await this.makeRequest('PATCH', `/public/api/ver1/smart_trades/${params.smart_trade_id}/update?`, params)
    }

    async smartTradesCancel (smart_trade_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/${smart_trade_id}/cancel?`, { smart_trade_id })
    }

    async smartTradesPanicSell (smart_trade_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/${smart_trade_id}/panic_sell?`, { smart_trade_id })
    }

    async smartTradesForceProcess (smart_trade_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/smart_trades/${smart_trade_id}/force_process?`, { smart_trade_id })
    }

    /**
     * Accounts methods
     */

    async accountsNew (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/new?`, params)
    }

    async accounts () {
        return await this.makeRequest('GET', `/public/api/ver1/accounts?`, null)
    }

    async accountsMarketList () {
        return await this.makeRequest('GET', `/public/api/ver1/accounts/market_list?`, null)
    }

    async accountsCurrencyRates () {
        return await this.makeRequest('GET', `/public/api/ver1/accounts/currency_rates?`, null)
    }

    async accountSellAllToUsd (account_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/sell_all_to_usd?`, { account_id })
    }

    async accountSellAllToBtc (account_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/sell_all_to_btc?`, { account_id })
    }

    async accountLoadBalances (account_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/load_balances?`, { account_id })
    }

    async accountRename (params: any) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${params.account_id}/rename?`, params)
    }

    async accountPieChartData (account_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/pie_chart_data?`, { account_id })
    }

    async accountTableData (account_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/account_table_data?`, { account_id })
    }

    async accountRemove (account_id: string) {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/remove?`, { account_id })
    }

}

module.exports = threeCommasAPI
