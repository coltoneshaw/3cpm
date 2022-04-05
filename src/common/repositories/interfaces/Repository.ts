import {
  APIRepository, DealsRepository,
  DBRepository, ConfigRepository, GeneralRepository,
} from 'common/repositories/interfaces';

export default interface Repository {
  readonly Deals: DealsRepository;
  readonly API: APIRepository;
  readonly Database: DBRepository;
  readonly Config: ConfigRepository;
  readonly General: GeneralRepository;
}
