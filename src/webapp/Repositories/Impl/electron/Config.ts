import BaseElectronRepository from '@/webapp/Repositories/Impl/electron/Base';
import { ConfigRepository } from '@/webapp/Repositories/interfaces';
import { ProfileType } from '@/types/config';
import type { defaultConfig } from '@/utils/defaultConfig';

export default class ElectronConfigRepository extends BaseElectronRepository implements ConfigRepository {
  get = (value: 'all' | string) => this.mainPreload.config.get(value);

  profile = (
    type: 'create',
    profileData: ProfileType,
    profileId: string,
  ) => this.mainPreload.config.profile(type, profileData, profileId);

  getProfile = (value: string, profileId: string) => this.mainPreload.config.getProfile(value, profileId);

  reset = async () => {
    await this.mainPreload.config.reset();
  };

  set = async (key: string, value: any) => {
    await this.mainPreload.config.set(key, value);
  };

  bulk = async (changes: typeof defaultConfig) => {
    await this.mainPreload.config.bulk(changes);
  };
}
