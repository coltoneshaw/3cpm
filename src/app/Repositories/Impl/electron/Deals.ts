import BaseElectronRepository from '@/app/Repositories/Impl/electron/Base';
import { UpdateDealRequest } from '@/main/3Commas/types';
import { Type_Profile } from '@/types/config';
import { DealsRepository } from '@/app/Repositories/interfaces';

export default class ElectronDealsRepository extends BaseElectronRepository implements DealsRepository {
  update(profileData: Type_Profile, deal: UpdateDealRequest): any {
    return this.mainPreload.deals.update(profileData, deal);
  }
}
