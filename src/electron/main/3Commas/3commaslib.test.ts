/**
 * @jest-environment node
 */

import log from 'electron-log';
import ThreeCommasAPI from './3commaslib';
import mocks from '@/tests/mocks/mockData';

const deals = mocks.threeCommas.DealsArray;

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
