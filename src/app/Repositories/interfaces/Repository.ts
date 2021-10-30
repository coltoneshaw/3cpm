import {APIRepository, DealsRepository, DBRepository, BinanceRepository, ConfigRepository} from '@/app/Repositories/interfaces';

export default interface Repository {
    readonly Deals: DealsRepository;
    readonly API: APIRepository;
    readonly Database: DBRepository;
    readonly Binance: BinanceRepository;
    readonly Config: ConfigRepository;
}