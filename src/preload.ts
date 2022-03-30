import { ProfileType } from '@/types/config';

import {
  MainPreload, Type_UpdateFunction, getDealOrders, defaultConfig,
} from '@/types/preload';

import { Deals } from '@/types/3cAPI';

import { logToConsole } from './utils/logging';

const { contextBridge, ipcRenderer } = require('electron');

async function setupContextBridge() {
  contextBridge.exposeInMainWorld('mainPreload', {
    deals: {
      async update(profileData: ProfileType, deal: Deals.Params.UpdateDeal): Promise<MainPreload['deals']['update']> {
        return ipcRenderer.invoke('api-deals-update', profileData, deal);
      },
    },
    api: {
      async update(
        type: string,
        options: Type_UpdateFunction,
        profileData: ProfileType,
      ): Promise<MainPreload['api']['update']> {
        logToConsole('debug', 'Updating 3Commas data.');
        return ipcRenderer.invoke('api-updateData', type, options, profileData);
      },
      async updateBots(profileData: ProfileType): Promise<void> {
        logToConsole('debug', 'Fetching Bot Data');
        await ipcRenderer.invoke('api-getBots', profileData);
      },
      async getAccountData(
        profileData: ProfileType,
        key?: string,
        secret?: string,
        mode?: string,
      ): Promise<ReturnType<typeof getDealOrders>> {
        return ipcRenderer.invoke('api-getAccountData', profileData, key, secret, mode);
      },
      async getDealOrders(profileData: ProfileType, dealID: number) {
        return ipcRenderer.invoke('api-getDealOrders', profileData, dealID);
      },
    },
    config: {
      get: async (value: string | 'all'): Promise<any> => {
        logToConsole('debug', 'fetching Config');
        return ipcRenderer.invoke('allConfig', value);
      },
      profile: async (type: 'create', newProfile: ProfileType, profileId: string) => {
        if (type === 'create') {
          // storing the initial config values
          await ipcRenderer.invoke('setStoreValue', `profiles.${profileId}`, newProfile);
          await ipcRenderer.invoke('database-checkOrMakeTables', profileId);
        }
      },

      // gets the value for the current profile
      getProfile: async (
        value: string,
        profileId: string,
      ): Promise<ProfileType | undefined> => ipcRenderer.invoke(
        'allConfig',
        `profiles.${profileId}${value ? `.${value}` : ''}`,
      ),

      async reset(): Promise<void> {
        /**
         * TODO
         * - Add error handling for default config here.
         */
        logToConsole('debug', 'attempting to reset the config to default values.');
        await ipcRenderer.invoke('config-clear');
      },
      async set(key: string, value: any): Promise<void> {
        logToConsole('debug', 'writing Config');
        await ipcRenderer.invoke('setStoreValue', key, value);
      },

      bulk: async (changes: typeof defaultConfig): Promise<void> => ipcRenderer.invoke('setBulkValues', changes),
    },
    database: {
      async query(profileId: string, queryString: string) {
        logToConsole('debug', 'running database query');
        logToConsole('debug', queryString);
        return ipcRenderer.invoke('query-database', profileId, queryString);
      },
      update(profileId: string, table: string, updateData: object[]): void {
        ipcRenderer.invoke('update-database', profileId, table, updateData);
      },
      upsert(
        profileId: string,
        table: string,
        data: any[],
        id: string,
        updateColumn: string,
      ): void {
        ipcRenderer.invoke('upsert-database', profileId, table, data, id, updateColumn);
      },
      run(profileId: string, query: string): void {
        ipcRenderer.invoke('run-database', profileId, query);
      },
      async deleteAllData(profileID?: string): Promise<void> {
        logToConsole('debug', 'deleting all data!');
        await ipcRenderer.invoke('database-deleteAll', profileID);
      },
    },
    general: {
      openLink(link: string) {
        ipcRenderer.invoke('open-external-link', link);
      },
    },
    binance: {
      coinData: async () => ipcRenderer.invoke('binance-getCoins'),
    },
    pm: {
      versions: async () => ipcRenderer.invoke('pm-versions'),
    },
  });
}

async function preloadCheck() {
  await ipcRenderer.invoke('preload-check');
}

preloadCheck();
// databaseSetup();
setupContextBridge();

export default setupContextBridge;
