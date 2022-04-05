import crypto from 'crypto';
import fetch from 'node-fetch';
import log from 'electron-log';
import type { Deals, Accounts, Bots } from 'types/3cAPI';

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

  async makeRequest<T>(method: string, path: string, params: {} | undefined): Promise<T | []> {
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

      return await response.json() as T;
    } catch (e) {
      log.error('error making api request', e);
      return [];
    }
  }

  /**
     * Deals methods
     */

  async getDeals(params?: Deals.Params.GetDeals) {
    // join the scopes here to allow you to input them as an array and have it joined on the backend
    return this.makeRequest<Deals.Responses.Deal[] | []>(
      'GET',
      '/public/api/ver1/deals?',
      {
        ...params,
        scope: params?.scope?.join(),
      },
    );
  }

  /**
     * @returns a single deal data plus bot events for that deal.
     */
  async getDeal(params: { deal_id: number }) {
    return this.makeRequest<Deals.Responses.Deal>(
      'GET',
      `/public/api/ver1/deals/${params.deal_id}/show`, /* { deal_id } */
      undefined,
    );
  }

  async getDealSafetyOrders(params: { deal_id: number | string }) {
    return this.makeRequest<Deals.Responses.MarketOrders[] | []>(
      'GET',
      `/public/api/ver1/deals/${params.deal_id}/market_orders?`,
      /* { deal_id } */ undefined,
    );
  }

  async updateDeal(params: Deals.Params.UpdateDeal) {
    return this.makeRequest<Deals.Responses.Deal>(
      'PATCH',
      `/public/api/ver1/deals/${params.deal_id}/update_deal?`,
      params,
    );
  }

  /**
     * Bots methods
     */

  /**
  *
  * @apidocs - https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#user-bots-permission-bots_read-security-signed
  */
  async getBots(params?: Bots.Params.GetBots) {
    return this.makeRequest<Bots.Responses.Bot[] | []>('GET', '/public/api/ver1/bots?', params);
  }

  async getBotsStats(params: Bots.Params.GetBotStats) {
    return this.makeRequest<Bots.Responses.BotStats>('GET', '/public/api/ver1/bots/stats?', params);
  }

  /**
     *
     * @returns Returns the same data as the bot endpoint but includes all the currently active deals.
     * @apidocs https://github.com/3commas-io/3commas-official-api-docs/blob/master/bots_api.md#bot-info-permission-bots_read-security-signed
     */
  async botShow(params: Bots.Params.BotShow) {
    return this.makeRequest<Bots.Responses.Bot | {}>('GET', `/public/api/ver1/bots/${params.bot_id}/show?`, params);
  }

  /**
     * Accounts methods
     */

  async accounts(params?: Accounts.Params.GetAccounts) {
    return this.makeRequest<Accounts.Responses.Account[] | []>('GET', '/public/api/ver1/accounts?', params);
  }

  /**
     * @description Updates the data from the exchange into 3Commas then returns it.
     * @returns Same data as the /accounts endpoint
     */
  async accountLoadBalances(params: { account_id: string }) {
    return this.makeRequest<Accounts.Responses.Account[] | []>(
      'POST',
      `/public/api/ver1/accounts/${params.account_id}/load_balances?`,
      params,
    );
  }

  async accountPieChartData(params: { account_id: string }) {
    return this.makeRequest<Accounts.Responses.PieChartData[] | []>(
      'POST',
      `/public/api/ver1/accounts/${params.account_id}/pie_chart_data?`,
      params,
    );
  }

  /**
     * @returns Array containing AccountTableData for every pair on the account
     */
  async accountTableData(params: { account_id: string }) {
    return this.makeRequest<Accounts.Responses.AccountTableData[] | []>(
      'POST',
      `/public/api/ver1/accounts/${params.account_id}/account_table_data?`,
      params,
    );
  }
}

export default ThreeCommasAPI;
