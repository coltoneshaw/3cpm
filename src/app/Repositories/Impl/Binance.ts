import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { BinanceRepository } from '@/app/Repositories/interfaces';

export default class BaseBinanceRepository extends BaseElectronRepository implements BinanceRepository{
    coinData = () => this.mainPreload.binance.coinData()
    
}
