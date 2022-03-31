import type { API } from 'types/preload';

export default interface APIRepository {
  update: API['update'];
  updateBots: API['updateBots'];
  getAccountData: API['getAccountData']
  getDealOrders: API['getDealOrders']
}
