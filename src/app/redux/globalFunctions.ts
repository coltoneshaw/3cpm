import { ProfileType } from '@/types/config';

export const configPaths = {
  apis: {
    threeC: {
      main: 'apis.threeC',
      key: 'apis.threeC.key',
      secret: 'apis.threeC.secret',
      mode: 'apis.threeC.mode',
    },
  },
  syncStatus: {
    deals: {
      lastSyncTime: 'syncStatus.deals.lastSyncTime',
    },
  },
  statSettings: {
    reservedFunds: 'statSettings.reservedFunds',
    startDate: 'statSettings.startDate',
    account_id: 'statSettings.account_id',
  },
  name: 'name',
  writeEnabled: 'writeEnabled',
  general: {
    defaultCurrency: 'general.defaultCurrency',
  },
  globalSettings: {
    notifications: {
      enabled: 'globalSettings.notifications.enabled',
      summary: 'globalSettings.notifications.summary',
    },
  },
};

export const updateProfileByPath = (data: any, profileData: ProfileType, path: any) => {
  // let newProfile = Object.assign({}, { ...state.currentProfile })
  switch (path) {
    case configPaths.apis.threeC.main: // update all the api data.
      profileData.apis.threeC = data;
      break;
    case configPaths.statSettings.reservedFunds: // update all the api data.
      profileData.statSettings.reservedFunds = data;
      break;
    case configPaths.name: // update all the api data.
      profileData.name = data;
      break;
    case configPaths.writeEnabled: // update all the api data.
      profileData.writeEnabled = data;
      break;
    case configPaths.general.defaultCurrency: // update all the currency data
      profileData.general.defaultCurrency = data;
      break;
    case configPaths.statSettings.startDate: // update all the api data.
      profileData.statSettings.startDate = data;
      break;
    case configPaths.syncStatus.deals.lastSyncTime:
      profileData.statSettings.startDate = data;
      break;
    default:
      break;
  }

  return profileData;
};
