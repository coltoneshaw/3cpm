import crypto from "crypto";
import fetch from 'electron-fetch';
const log = require('electron-log');
import type { threeCommas_Api_Deals, MarketOrders, GetDeal } from './types/Deals'
import type { accounts, AccountCurrencyRates, AccountsMarketList, AccountTableData, AccountPieChartData } from './types/Accounts'
import type { Bots, GetBotsStats, ShowBot } from './types/Bots'
import type {GridBots, GridMarketOrders, GridBotProfits, GridBotShow, GridRequiredBalance} from './types/GridBots'

type currencyRates = {
    pretty_display_type?: string, // deprecated
    market_code: 'binance' | 'binance_us'
    pair: string // EX: USDT_BTC
}

type getBots = {
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

type getGridBots = {
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
}




class threeCommasAPI {

    private _url: any;
    private _apiKey: string;
    private _apiSecret: string;
    private _mode: "paper" | "real";

    constructor(opts = { apiKey: '', apiSecret: '', mode: '' }) {
        this._url = 'https://api.3commas.io'
        this._apiKey = opts.apiKey
        this._apiSecret = opts.apiSecret

        // @ts-ignore
        this._mode = opts.mode ?? 'real'
    }

    generateSignature(requestUri: string, reqData: string) {
        const request = requestUri + reqData
        return crypto.createHmac('sha256', this._apiSecret).update(request).digest('hex')
    }

    async makeRequest(method: string, path: string, params: any) {
        if (!this._apiKey || !this._apiSecret) {
            return new Error('missing api key or secret')
        }

        let u = new URLSearchParams();
        for (const key in params)
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

    async getDeals(params: any): Promise<threeCommas_Api_Deals[]> {
        return await this.makeRequest('GET', '/public/api/ver1/deals?', params)
    }

    /**
     * @returns a single deal data plus bot events for that deal.
     */
    async getDeal(deal_id: string): Promise<GetDeal> {
        return await this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/show?`, { deal_id })
    }

    async getDealSafetyOrders(deal_id: string): Promise<MarketOrders[]> {
        return await this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/market_orders?`, { deal_id })
    }

    /**
     * Bots methods
     */

    /**
     * 
     * @apidocs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#user-bots-permission-bots_read-security-signed
     */
    async getBots(params: getBots): Promise<Bots[]> {
        return await this.makeRequest('GET', `/public/api/ver1/bots?`, params)
    }

    async getBotsStats(params: { account_id?: string, bot_id?: null | string }): Promise<GetBotsStats> {
        return await this.makeRequest('GET', `/public/api/ver1/bots/stats?`, params)
    }

    /**
     * 
     * @returns Returns the same data as the bot endpoint but includes all the currently active deals.
     * @apidocs https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#bot-info-permission-bots_read-security-signed
     */
    async botShow(params: { bot_id: string, include_events?: boolean }): Promise<ShowBot> {
        return await this.makeRequest('GET', `/public/api/ver1/bots/${params.bot_id}/show?`, params)
    }


    /**
     * Accounts methods
     */


    async accounts(): Promise<accounts[]> {
        return await this.makeRequest('GET', `/public/api/ver1/accounts?`, null)
    }

    async accountsCurrencyRates(options: currencyRates): Promise<AccountCurrencyRates[]> {
        return await this.makeRequest('GET', `/public/api/ver1/accounts/currency_rates?`, { ...options, pair: options.pair.toUpperCase() })
    }

    /**
     * 
     * @returns All specific market codes that 3commas supports
     */
    async accountsMarketList(): Promise<AccountsMarketList[]> {
        return await this.makeRequest('GET', `/public/api/ver1/accounts/market_list?`, null)
    }

    /**
     * 
     * @returns All pairs that are supported on a specific market code.
     */
    async accountsMarketPairs(market_code: string): Promise<string[]> {
        return await this.makeRequest('GET', `/public/api/ver1/accounts/market_pairs?`, { market_code })
    }

    /**
     * @description Updates the data from the exchange into 3Commas then returns it.
     * @returns Same data as the /accounts endpoint
     */
    async accountLoadBalances(account_id: string): Promise<accounts[]> {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/load_balances?`, { account_id })
    }

    async accountPieChartData(account_id: string): Promise<AccountPieChartData[]> {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/pie_chart_data?`, { account_id })
    }

    /**
     * @returns Array containing AccountTableData for every pair on the account
     */
    async accountTableData(account_id: string): Promise<AccountTableData[]> {
        return await this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/account_table_data?`, { account_id })
    }

    /**
     * Grid Bots
     */

    async gridBots(params: getGridBots):Promise<GridBots[]> {
        return await this.makeRequest('POST', `/public/api/ver1/grid_bots?`, { params })
    }

    async gridBotMarketOrders(id: number):Promise<GridMarketOrders> {
        return await this.makeRequest('POST', `/ver1/grid_bots/${id}/market_orders?`, null)
    }

    async gridBotProfits(id: number):Promise<GridBotProfits[]> {
        return await this.makeRequest('POST', `/ver1/grid_bots/${id}/profits?`, null)
    }

    async gridBotShow(id: number):Promise<GridBotShow> {
        return await this.makeRequest('POST', `/ver1/grid_bots/${id}?`, null)
    }

    async gridBotRequiredBalance(id: number):Promise<GridRequiredBalance> {
        return await this.makeRequest('POST', `/ver1/grid_bots/${id}/required_balances?`, null)
    }

}

export default threeCommasAPI
