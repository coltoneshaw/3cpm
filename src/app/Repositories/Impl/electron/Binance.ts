import BaseElectronRepository from "@/app/Repositories/Impl/electron/Base";

export default class ElectronBinanceRepository extends BaseElectronRepository implements BinanceRepository{
    coinData(): any {
        return this.electron.binance.coinData()
    }
}
