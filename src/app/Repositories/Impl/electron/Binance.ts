import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";
import { BinanceRepository } from '@/app/Repositories/interfaces';

export default class ElectronBinanceRepository extends BaseElectronRepository implements BinanceRepository{
    coinData(): any {
        return this.mainPreload.binance.coinData()
    }
}
