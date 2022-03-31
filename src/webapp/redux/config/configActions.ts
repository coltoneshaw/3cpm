/* eslint-disable no-restricted-globals */
import {
  setConfig, setCurrentProfile, updateCurrentProfileByPath, deleteProfileById, updateNotificationsSettings,
} from 'webapp/redux/config/configSlice';
import { setSyncData } from 'webapp/redux/threeCommas/threeCommasSlice';
import { showAlert, showConfirm } from 'webapp/Components/Popups/Popups';
import { logToConsole } from 'common/utils/logging';

import { removeDuplicatesInArray } from 'common/utils/helperFunctions';
import {
  ConfigValuesType, NotificationsSettingsType, ProfileType, ReservedFundsType,
} from 'types/config';

import store from '../store';

const updateCurrentProfile = (profileData: ProfileType) => {
  store.dispatch(setCurrentProfile(profileData));
  // setting this to zero here to prevent a spam of notifications with auto sync enabled.
  store.dispatch(setSyncData({ syncCount: 0, time: 0 }));
};
const updateConfig = async () => {
  await window.ThreeCPM.Repository.Config.get('all')
    .then((config) => {
      store.dispatch(setConfig(config));
      updateCurrentProfile(config.profiles[config.current]);
    });
};

const storeConfigInFile = async () => {
  try {
    await window.ThreeCPM.Repository.Config.bulk(store.getState().config.config);
    updateConfig();
    return true;
  } catch (e) {
    logToConsole('error', e);
    return false;
  }
};

/**
 *
 * @param data data to be stored on the current profile
 * @param path string path to represent where to store the data.
 */
const updateNestedCurrentProfile = (data: string | {} | [], path: string) => {
  store.dispatch(updateCurrentProfileByPath({ data, path }));
};

const updateReservedFundsArray = async (
  key: string,
  secret: string,
  mode: string,
  reservedFunds: ReservedFundsType[],
) => {
  const accountSummary = await window.ThreeCPM.Repository.API.getAccountData(undefined, key, secret, mode);

  if (accountSummary !== undefined) {
    const prevState = <any[]>[];

    // new data coming in, removing the dups from the array
    const filteredAccountData = removeDuplicatesInArray(accountSummary, 'id');

    // checking to see if any reserved funds exist
    if (reservedFunds.length === 0 || reservedFunds === []) {
      logToConsole('debug', 'setting since there are no account IDs!');
      return filteredAccountData.map((account) => {
        const { id, name } = account;
        return {
          id,
          account_name: name,
          reserved_funds: 0,
          is_enabled: false,
        };
      });
    }

    // getting account IDs from the reserved funds
    // const configuredAccountIds = removeDuplicatesInArray(reservedFunds.map(account => account.id), 'id')

    // finding any accounts that did not exist since the last sync.
    return filteredAccountData
      // .filter( account => !configuredAccountIds.includes(account.id) )
      .map((account) => {
        const { id, name } = account;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        let reserved_funds = 0;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        let is_enabled = false;

        const filteredAccount = prevState.find((a) => a.id === id);
        if (filteredAccount !== undefined) {
          reserved_funds = filteredAccount.reserved_funds;
          is_enabled = filteredAccount.is_enabled;
        }
        return {
          id,
          account_name: name,
          reserved_funds,
          is_enabled,
        };
      });
  }

  return null;
};

const deleteProfileByIdGlobal = (
  config: ConfigValuesType,
  profileId: string,
  setOpen?: CallableFunction | undefined,
) => {
  const profileKeys = Object.keys(config.profiles);
  if (profileKeys.length <= 1) {
    // eslint-disable-next-line max-len
    showAlert('Hold on cowboy. You seem to be trying to delete your last profile. If you want to reset your data use Menu > Help > Reset all data.');
    return;
  }
  // eslint-disable-next-line max-len
  const accept = showConfirm('Deleting this profile will delete all information attached to it including API keys, and the database. This action will not impact your 3Commas account in any way. Confirm you would like to locally delete this profile.');
  if (accept) {
    logToConsole('debug', 'deleted the profile!');

    store.dispatch(deleteProfileById({ profileId }));
    storeConfigInFile();

    window.ThreeCPM.Repository.Database.deleteAllData(profileId);

    // delete the profile command
    // route the user back to a their default profile OR route the user to a new blank profile..?
    // What happens if it's the last profile? Show a warning maybe saying:
    // "This is your only profile. Unable to delete. If you want to reset your 3C Portfolio Manager use Menu > Help > Reset all data."
    if (setOpen) setOpen(true);
  }
};

const updateNotificationsSettingsGlobal = async (settings: Partial<NotificationsSettingsType>) => {
  store.dispatch(updateNotificationsSettings(settings));
  await storeConfigInFile();
};

export {
  updateConfig,
  updateReservedFundsArray,
  updateNestedCurrentProfile,
  storeConfigInFile,
  deleteProfileByIdGlobal,
  updateNotificationsSettingsGlobal,
};
