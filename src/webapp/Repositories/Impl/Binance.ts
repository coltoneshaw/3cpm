import BaseElectronRepository from '@/webapp/Repositories/Impl/electron/Base';
import { BinanceRepository } from '@/webapp/Repositories/interfaces';

export default class BaseBinanceRepository extends BaseElectronRepository implements BinanceRepository {
  coinData = () => this.mainPreload.binance.coinData();
}
