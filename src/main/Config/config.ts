import log from 'electron-log';

import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';
import { run } from '@/main/Database/database';
import { ConfigValuesType, ProfileType } from '@/types/config';
import { defaultConfig } from '@/utils/defaultConfig';
import convertToProfileDatabases from './migrations/2.0.0';

const migrationToProfiles = async (config: any) => {
  // if(config.get('general.version') === 'v0.5.0') {
  //     log.debug('looks like this is already on the latest version.')
  //     return false
  // }
  const id = uuidv4();
  config.delete('general.version');
  const {
    apis, general, syncStatus, statSettings,
  } = config.store;
  if (!apis || !general || !syncStatus || !statSettings) return;

  config.store = {
    profiles: {
      [id]: {
        name: 'default',
        id,
        apis: {
          threeC: {
            ...apis.threeC,
            mode: 'real',
          },
        },
        general,
        syncStatus,
        statSettings,
      },
    },
    general: {
      version: 'v1.0.0',
    },
    current: id,
  };

  try {
    await Promise.all([
      run(id, 'ALTER TABLE accountData ADD profile_id VARCHAR(36)'),
      run(id, 'ALTER TABLE bots ADD profile_id VARCHAR(36)'),
      run(id, 'ALTER TABLE deals ADD profile_id VARCHAR(36)'),
    ]).then(() => {
      run(
        id,
        `UPDATE accountData SET profile_id='${id}' WHERE profile_id IS NULL`,
      );
      run(id, `UPDATE bots SET profile_id='${id}' WHERE profile_id IS NULL`);
      run(id, `UPDATE deals SET profile_id='${id}' WHERE profile_id IS NULL`);
    });
  } catch (e) {
    log.error(e);
    log.error('error migrating to v1.0.0 ');
  }

  log.info('completed migration to v1.0.0');
};

// establishing a config store.
export const config = new Store<ConfigValuesType>({
  migrations: {
    '1.0.0': async (store) => {
      log.info('migrating the config store to 1.0.0');
      await migrationToProfiles(store);
    },
    '2.0.0': async (store) => {
      log.info('migrating the config store to 2.0.0');
      store.set('globalSettings.notifications', { enabled: true, summary: false });

      const profileIds = Object.keys(store.store.profiles);
      const resetLastSyncTime = async (profileIds: string[]) => {
        if (!profileIds || profileIds.length === 0) return;
        profileIds.forEach((profileId) => {
          store.set(`profiles.${profileId}.syncStatus.deals.lastSyncTime`, null);
        });
      };

      await resetLastSyncTime(profileIds);
      await convertToProfileDatabases(profileIds);
    },
  },
  defaults: <ConfigValuesType>defaultConfig,
});

const getProfileConfig = (key: string): any => {
  const current = config.get('current');
  return config.get(`profiles.${current}${key ? `.${key}` : ''}`);
};

const getProfileConfigAll = (profileId?: string) => {
  if (!profileId) profileId = <string>config.get('current');

  return <ProfileType>config.get(`profiles.${profileId}`);
};

const setProfileConfig = (key: string, value: any, profileId: string) => {
  if (!profileId) {
    log.error(`No profile ID to set the config${key} - ${value}`);
    return null;
  }
  return config.set(`profiles.${profileId}.${key}`, value);
};

const setDefaultConfig = () => {
  config.store = defaultConfig;
};

export {
  getProfileConfig,
  setProfileConfig,
  setDefaultConfig,
  getProfileConfigAll,
};
