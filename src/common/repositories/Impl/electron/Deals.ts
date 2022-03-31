import { Deals } from 'types/3cAPI';
import { ProfileType } from 'types/config';
import BaseElectronRepository from 'common/repositories/Impl/electron/Base';
import { DealsRepository } from 'common/repositories/interfaces';

export default class ElectronDealsRepository extends BaseElectronRepository implements DealsRepository {
  update(profileData: ProfileType, deal: Deals.Params.UpdateDeal): Promise<Deals.Responses.Deal> {
    return this.mainPreload.deals.update(profileData, deal);
  }
}
