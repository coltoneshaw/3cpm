import BaseElectronRepository from '@/webapp/Repositories/Impl/electron/Base';
import { Deals } from '@/types/3cAPI';
import { ProfileType } from '@/types/config';
import { DealsRepository } from '@/webapp/Repositories/interfaces';

export default class ElectronDealsRepository extends BaseElectronRepository implements DealsRepository {
  update(profileData: ProfileType, deal: Deals.Params.UpdateDeal): Promise<Deals.Responses.Deal> {
    return this.mainPreload.deals.update(profileData, deal);
  }
}
