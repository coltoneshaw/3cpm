import crypto from 'crypto';
import fetch from 'electron-fetch';
import log from 'electron-log';
import type {
  Deals3CAPI, MarketOrders3CAPI, GetDeal3CAPI,
} from '@/types/3CommasAPI/Deals';
import type {
  Accounts3CAPI, AccountCurrencyRates3CAPI, AccountsMarketList3CAPI, AccountTableData3CAPI, AccountPieChartData3CAPI,
} from '@/types/3CommasAPI/Accounts';
import type { Bots3CAPI, GetBotsStats3CAPI, ShowBot3CAPI } from '@/types/3CommasAPI/Bots';
import type {
  GridBots3CAPI, GridMarketOrders3CAPI, GridBotProfits3CAPI, GridBotShow3CAPI, GridRequiredBalance3CAPI,
} from '@/types/3CommasAPI/GridBots';

import type {
  CurrencyRatesParams, GetBotsParams, GetBotStatsParams, GridBotParams, UpdateDealRequest,
} from './types';

class ThreeCommasAPI {
  private url: any;

  private apiKey: string;

  private apiSecret: string;

  private mode: string;

  constructor(opts = { apiKey: '', apiSecret: '', mode: 'real' }) {
    this.url = 'https://api.3commas.io';
    this.apiKey = opts.apiKey;
    this.apiSecret = opts.apiSecret;

    this.mode = opts.mode ?? 'real';
  }

  generateSignature(requestUri: string, reqData: string) {
    const request = requestUri + reqData;
    return crypto.createHmac('sha256', this.apiSecret).update(request).digest('hex');
  }

  async makeRequest(method: string, path: string, params: {} | null) {
    if (!this.apiKey || !this.apiSecret) {
      return new Error('missing api key or secret');
    }

    const u = new URLSearchParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        u.append(key, params[key as keyof typeof params]);
      });
    }

    const sig = this.generateSignature(path, u.toString());

    try {
      const response = await fetch(
        `${this.url}${path}${u.toString()}`,
        {
          method,
          timeout: 30000,
          headers: {
            APIKEY: this.apiKey,
            Signature: sig,
            'Forced-Mode': this.mode,
          },
        },
      );

      if (response.status >= 400) {
        console.error('API call is in error:', response.status, 'url', `${this.url}${path}${u.toString()}`);
      }

      return await response.json();
    } catch (e) {
      log.error('error making api request', e);
      return false;
    }
  }

  /**
     * Deals methods
     */

  async getDeals(params: any): Promise<Deals3CAPI[]> {
    return this.makeRequest('GET', '/public/api/ver1/deals?', params);
  }

  /**
     * @returns a single deal data plus bot events for that deal.
     */
  async getDeal(deal_id: string): Promise<GetDeal3CAPI> {
    return this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/show?`, { deal_id });
  }

  async getDealSafetyOrders(deal_id: string): Promise<MarketOrders3CAPI[]> {
    return this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/market_orders?`, { deal_id });
  }

  async updateDeal(params: UpdateDealRequest): Promise<Deals3CAPI> {
    return this.makeRequest('PATCH', `/public/api/ver1/deals/${params.deal_id}/update_deal?`, { ...params });
  }

  /**
     * Bots methods
     */

  /**
     *
     * @apidocs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#user-bots-permission-bots_read-security-signed
     */
  async getBots(params: GetBotsParams): Promise<Bots3CAPI[]> {
    return this.makeRequest('GET', '/public/api/ver1/bots?', params);
  }

  async getBotsStats(params: GetBotStatsParams): Promise<GetBotsStats3CAPI> {
    return this.makeRequest('GET', '/public/api/ver1/bots/stats?', params);
  }

  /**
     *
     * @returns Returns the same data as the bot endpoint but includes all the currently active deals.
     * @apidocs https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#bot-info-permission-bots_read-security-signed
     */
  async botShow(params: {
    bot_id: string,
    include_events?: boolean
  }): Promise<ShowBot3CAPI> {
    return this.makeRequest('GET', `/public/api/ver1/bots/${params.bot_id}/show?`, params);
  }

  /**
     * Accounts methods
     */

  async accounts(): Promise<Accounts3CAPI[]> {
    return this.makeRequest('GET', '/public/api/ver1/accounts?', {});
  }

  async accountsCurrencyRates(options: CurrencyRatesParams): Promise<AccountCurrencyRates3CAPI[]> {
    return this.makeRequest(
      'GET',
      '/public/api/ver1/accounts/currency_rates?',
      { ...options, pair: options.pair.toUpperCase() },
    );
  }

  /**
     *
     * @returns All specific market codes that 3commas supports
     */
  async accountsMarketList(): Promise<AccountsMarketList3CAPI[]> {
    return this.makeRequest('GET', '/public/api/ver1/accounts/market_list?', {});
  }

  /**
     *
     * @returns All pairs that are supported on a specific market code.
     */
  async accountsMarketPairs(market_code: string): Promise<string[]> {
    return this.makeRequest('GET', '/public/api/ver1/accounts/market_pairs?', { market_code });
  }

  /**
     * @description Updates the data from the exchange into 3Commas then returns it.
     * @returns Same data as the /accounts endpoint
     */
  async accountLoadBalances(account_id: string): Promise<Accounts3CAPI[]> {
    return this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/load_balances?`, { account_id });
  }

  async accountPieChartData(account_id: string): Promise<AccountPieChartData3CAPI[]> {
    return this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/pie_chart_data?`, { account_id });
  }

  /**
     * @returns Array containing AccountTableData for every pair on the account
     */
  async accountTableData(account_id: string): Promise<AccountTableData3CAPI[]> {
    return this.makeRequest('POST', `/public/api/ver1/accounts/${account_id}/account_table_data?`, { account_id });
  }

  /**
     * Grid Bots
     */

  async gridBots(params: GridBotParams): Promise<GridBots3CAPI[]> {
    return this.makeRequest('POST', '/public/api/ver1/grid_bots?', { params });
  }

  async gridBotMarketOrders(id: number): Promise<GridMarketOrders3CAPI> {
    return this.makeRequest('POST', `/ver1/grid_bots/${id}/market_orders?`, null);
  }

  async gridBotProfits(id: number): Promise<GridBotProfits3CAPI[]> {
    return this.makeRequest('POST', `/ver1/grid_bots/${id}/profits?`, null);
  }

  async gridBotShow(id: number): Promise<GridBotShow3CAPI> {
    return this.makeRequest('POST', `/ver1/grid_bots/${id}?`, null);
  }

  async gridBotRequiredBalance(id: number): Promise<GridRequiredBalance3CAPI> {
    return this.makeRequest('POST', `/ver1/grid_bots/${id}/required_balances?`, null);
  }
}

export default ThreeCommasAPI;
