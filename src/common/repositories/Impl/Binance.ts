import BaseElectronRepository from 'common/repositories/Impl/electron/Base';
import { BinanceRepository } from 'common/repositories/interfaces';

export default class BaseBinanceRepository extends BaseElectronRepository implements BinanceRepository {
  coinData = () => this.mainPreload.binance.coinData();
}
