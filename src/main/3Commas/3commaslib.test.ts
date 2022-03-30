/**
 * @jest-environment node
 */

// import fetch from 'electron-fetch';
// import * as fetch from 'electron-fetch';
import log from 'electron-log';
import ThreeCommasAPI from './3commaslib';
import { deals } from '@/tests/mocks/mockData';

// const MOCK_DEAL = [{}];

// jest.mock('electron-fetch', () => jest.fn());
// const mockFetch = fetch as unknown as jest.Mock;

// it('some example test', async () => {
//   mockFetch.mockImplementation(async (url) => {
//     if (url.includes('https://api.3commas.io')) {
//       return {
//         status: 200,
//         json: async () => ({ foo: 'bar' }),
//       };
//     }
//     throw new Error(`unmocked fetch call ${url}`);
//   });

//   const api = new ThreeCommasAPI({ apiKey: '1', apiSecret: '1', mode: 'paper' });
//   const deals = await api.getDeals();

//   expect(deals).toBe([]);
// });

// it('some example test', async () => {
//   jest.spyOn(fetch, 'default').mockImplementation(async (url) => {
//     if (url.toString().includes('https://api.3commas.io')) {
//       return new Promise<any>((resolve) => {
//         resolve({ status: 200, json: async () => ({ foo: 'bar' }) });
//       });
//     }
//     throw new Error(`unmocked fetch call ${url}`);
//   });
//   const api = new ThreeCommasAPI({ apiKey: '1', apiSecret: '1', mode: 'paper' });
//   const deals = await api.getDeals();

//   expect(deals).toBe({ foo: 'bar' });
// });

const error = {
  error: 'not_found',
  error_description: 'Not Found',
};
describe('3Commas API Library', () => {
  test('Invalid API data', async () => {
    const api = new ThreeCommasAPI({ apiKey: '', apiSecret: '', mode: '' });
    await expect(api.getDeals()).rejects.toThrowError('missing api key or secret');

  });

  describe('Deals', () => {
    test('Returns Deal Array', async () => {
      const api = new ThreeCommasAPI({ apiKey: '1', apiSecret: '1', mode: 'paper' });
      const dealAPICall = await api.getDeals({ account_id: 30030251, scope: ['active'] });

      expect(dealAPICall).toStrictEqual(deals);
    });

    describe('Fetching Deals', () => {
      test('Returns single deal', async () => {
        const api = new ThreeCommasAPI({ apiKey: '1', apiSecret: '1', mode: 'paper' });
        const dealAPICall = await api.getDeal({ deal_id: 1418900498 });

        expect(dealAPICall).toStrictEqual(deals[0]);
      });

      test('Returns error when no deal exists', async () => {
        jest.spyOn(log, 'error').mockImplementation();
        const api = new ThreeCommasAPI({ apiKey: '1', apiSecret: '1', mode: 'paper' });
        const dealAPICall = await api.getDeal({ deal_id: 5 });

        expect(dealAPICall)
          .toStrictEqual(error);
        expect(log.error)
          .toHaveBeenCalledWith(
            'API call is in error:',
            404,
            'url',
            'https://api.3commas.io/public/api/ver1/deals/5/show',
          );
      });
    });
  });
});
