import { UpdateFunctionType } from '@/types/DatabaseQueries';
import { ProfileType } from '@/types/config';
import BaseElectronRepository from '@/webapp/Repositories/Impl/electron/Base';
import { APIRepository } from '@/webapp/Repositories/interfaces';

export default class ElectronAPIRepository extends BaseElectronRepository implements APIRepository {
  update = (
    type: string,
    options: UpdateFunctionType,
    profileData: ProfileType,
  ) => this.mainPreload.api.update(type, options, profileData);

  updateBots = (profileData: ProfileType) => this.mainPreload.api.updateBots(profileData);

  getAccountData = (
    profileData?: ProfileType,
    key?: string,
    secret?: string,
    mode?: string,
  ) => this.mainPreload.api.getAccountData(profileData, key, secret, mode);

  getDealOrders = (
    profileData: ProfileType,
    dealID: number,
  ) => this.mainPreload.api.getDealOrders(profileData, dealID);
}
