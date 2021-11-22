import type {api} from '@/types/preload'

export default interface APIRepository {
    update: api['update'];
    updateBots: api['updateBots'];
    getAccountData: api['getAccountData']
    getDealOrders: api['getDealOrders']
}