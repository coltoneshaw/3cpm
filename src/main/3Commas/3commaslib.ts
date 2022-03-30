import crypto from 'crypto';
import fetch from 'electron-fetch';
import log from 'electron-log';
import type { Deals, Accounts, Bots } from '@/types/3cAPI';

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

  async makeRequest(method: string, path: string, params: {} | undefined) {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('missing api key or secret');
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
        log.error('API call is in error:', response.status, 'url', `${this.url}${path}${u.toString()}`);
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

  async getDeals(params?: Deals.Params.GetDeals): Promise<Deals.Responses.Deal[] | []> {
    // join the scopes here to allow you to input them as an array and have it joined on the backend
    return this.makeRequest('GET', '/public/api/ver1/deals?', { ...params, scope: params?.scope?.join() });
  }

  /**
     * @returns a single deal data plus bot events for that deal.
     */
  async getDeal(params: { deal_id: number }): Promise<Deals.Responses.Deal> {
    return this.makeRequest('GET', `/public/api/ver1/deals/${params.deal_id}/show`, /* { deal_id } */ undefined);
  }

  async getDealSafetyOrders(deal_id: number): Promise<Deals.Responses.MarketOrders[]> {
    return this.makeRequest('GET', `/public/api/ver1/deals/${deal_id}/market_orders?`, /* { deal_id } */ undefined);
  }

  async updateDeal(params: Deals.Params.UpdateDeal): Promise<Deals.Responses.Deal> {
    return this.makeRequest('PATCH', `/public/api/ver1/deals/${params.deal_id}/update_deal?`, params);
  }

  /**
     * Bots methods
     */

  /**
  *
  * @apidocs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#user-bots-permission-bots_read-security-signed
  */
  async getBots(params?: Bots.Params.GetBots): Promise<Bots.Responses.Bot[] | []> {
    return this.makeRequest('GET', '/public/api/ver1/bots?', params);
  }

  async getBotsStats(params: Bots.Params.GetBotStats): Promise<Bots.Responses.BotStats> {
    return this.makeRequest('GET', '/public/api/ver1/bots/stats?', params);
  }

  /**
     *
     * @returns Returns the same data as the bot endpoint but includes all the currently active deals.
     * @apidocs https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#bot-info-permission-bots_read-security-signed
     */
  async botShow(params: Bots.Params.BotShow): Promise<Bots.Responses.Bot | {}> {
    return this.makeRequest('GET', `/public/api/ver1/bots/${params.bot_id}/show?`, params);
  }

  /**
     * Accounts methods
     */

  async accounts(params?: Accounts.Params.GetAccounts): Promise<Accounts.Responses.Account[]> {
    return this.makeRequest('GET', '/public/api/ver1/accounts?', params);
  }

  /**
     * @description Updates the data from the exchange into 3Commas then returns it.
     * @returns Same data as the /accounts endpoint
     */
  async accountLoadBalances(params: { account_id: string }): Promise<Accounts.Responses.Account[]> {
    return this.makeRequest('POST', `/public/api/ver1/accounts/${params.account_id}/load_balances?`, params);
  }

  async accountPieChartData(params: { account_id: string }): Promise<Accounts.Responses.PieChartData[]> {
    return this.makeRequest('POST', `/public/api/ver1/accounts/${params.account_id}/pie_chart_data?`, params);
  }

  /**
     * @returns Array containing AccountTableData for every pair on the account
     */
  async accountTableData(params: { account_id: string }): Promise<Accounts.Responses.AccountTableData[]> {
    return this.makeRequest('POST', `/public/api/ver1/accounts/${params.account_id}/account_table_data?`, params);
  }
}

export default ThreeCommasAPI;
