
const { contextBridge, ipcRenderer } = require('electron')
import { defaultCurrency, Type_Profile } from '@/types/config';

import { mainPreload, UpdateDealRequest, Type_UpdateFunction, getDealOrders, defaultConfig } from '@/types/preload'




async function setupContextBridge() {

  contextBridge.exposeInMainWorld('mainPreload', {
    deals: {
      async update(profileData: Type_Profile, deal: UpdateDealRequest): Promise<mainPreload['deals']['update']> {
        return await ipcRenderer.invoke('api-deals-update', profileData, deal);
      },
    },
    api: {
      async update(type: string, options: Type_UpdateFunction, profileData: Type_Profile): Promise<mainPreload['api']['update']> {
        console.log('Updating 3Commas data.')
        return await ipcRenderer.invoke('api-updateData', type, options, profileData);
      },
      async updateBots(profileData: Type_Profile): Promise<void> {
        console.log('Fetching Bot Data')
        await ipcRenderer.invoke('api-getBots', profileData);
      },
      async getAccountData(profileData: Type_Profile, key?: string, secret?: string, mode?: string): Promise<ReturnType<typeof getDealOrders>> {
        return await ipcRenderer.invoke('api-getAccountData', profileData, key, secret, mode);
      },
      async getDealOrders(profileData: Type_Profile, dealID: number) {
        return await ipcRenderer.invoke('api-getDealOrders', profileData, dealID);
      },
    },
    config: {
      get: async (value: string | 'all'): Promise<any> => {
        console.log('fetching Config')
        return await ipcRenderer.invoke('allConfig', value);
      },
      profile: async (type: 'create' | 'delete', newProfile: Type_Profile, profileId: string) => {

        if (type == 'create') {
          // storing the initial config values
          await ipcRenderer.invoke('setStoreValue', 'profiles.' + profileId, newProfile);
          await ipcRenderer.invoke('database-checkOrMakeTables', profileId);
        }



      },

      // gets the value for the current profile
      getProfile: async (value: string, profileId: string): Promise<Type_Profile | undefined> => await ipcRenderer.invoke('allConfig', 'profiles.' + profileId + (value ? '.' + value : '')),

      async reset(): Promise<void> {
        /**
         * TODO
         * - Add error handling for default config here.
         */
        console.log('attempting to reset the config to default values.')
        await ipcRenderer.invoke('config-clear')
      },
      async set(key: string, value: any): Promise<void> {
        console.log('writing Config')
        await ipcRenderer.invoke('setStoreValue', key, value);

      },

      bulk: async (changes: typeof defaultConfig): Promise<void> => await ipcRenderer.invoke('setBulkValues', changes)
    },
    database: {
      async query(profileId: string, queryString: string) {
        console.log('running database query')
        console.log(queryString)
        return await ipcRenderer.invoke('query-database', profileId, queryString);
      },
      update(profileId: string, table: string, updateData: object[]): void {
        ipcRenderer.invoke('update-database', profileId, table, updateData);
      },
      upsert(profileId: string, table: string, data: any[], id: string, updateColumn: string): void {
        ipcRenderer.invoke('upsert-database', profileId, table, data, id, updateColumn);
      },
      run(profileId: string, query: string): void {
        ipcRenderer.invoke('run-database', profileId, query);
      },
      async deleteAllData(profileID?: string): Promise<void> {
        console.log('deleting all data!')
        await ipcRenderer.invoke('database-deleteAll', profileID);
      }
    },
    general: {
      openLink(link: string) {
        ipcRenderer.invoke('open-external-link', link);
      }
    },
    binance: {
      coinData: async () => await ipcRenderer.invoke('binance-getCoins')
    },
    pm: {
      versions: async () => await ipcRenderer.invoke('pm-versions')
    }
  })
}



async function preloadCheck() {
  await ipcRenderer.invoke('preload-check');
}

preloadCheck();
// databaseSetup();
setupContextBridge();

export { setupContextBridge }