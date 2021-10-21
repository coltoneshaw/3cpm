import {UpdateDealRequest} from "@/main/3Commas/types/Deals";

const { contextBridge, ipcRenderer } = require('electron')
import {Type_UpdateFunction } from '@/types/3Commas'
import {Type_Profile} from '@/types/config'

async function setupContextBridge() {

  contextBridge.exposeInMainWorld('electron', {
    deals: {
      async update( profileData: Type_Profile, deal: UpdateDealRequest ) {
        return await ipcRenderer.invoke('api-deals-update', profileData, deal);
      },
    },
    api: {
      async update( type: string, options: Type_UpdateFunction, profileData:Type_Profile ) {
        console.log('Updating 3Commas data.')
        return await ipcRenderer.invoke('api-updateData', type, options, profileData);
      },
      async updateBots(profileData:Type_Profile) {
        console.log('Fetching Bot Data')
        return await ipcRenderer.invoke('api-getBots', profileData);
      },
      async getAccountData(profileData:Type_Profile, key?:string , secret?:string, mode?:string) {
        return await ipcRenderer.invoke('api-getAccountData', profileData, key , secret, mode);
      },
      async getDealOrders(profileData:Type_Profile, dealID: number) {
        return await ipcRenderer.invoke('api-getDealOrders', profileData, dealID);
      },
    },
    config: {
      async get( value:string ) {
        console.log('fetching Config')
        return await ipcRenderer.invoke('allConfig', value);
      },

      // gets the value for the current profile
      async getProfile( value:string ) {
          const profile = await ipcRenderer.invoke('allConfig', 'current');
          return await ipcRenderer.invoke('allConfig',  'profiles.'+profile+ (value ?'.' + value : ''));
      },
      async reset() {
        /**
         * TODO
         * - Add error handling for default config here.
         */
        console.log('attempting to reset the config to default values.')
        await ipcRenderer.invoke('config-clear')
      },
      async set(key:string, value:any) {
        console.log('writing Config')
        return await ipcRenderer.invoke('setStoreValue', key, value);

      },
      async setProfile( key:string, value:any ) {
        const profile = await ipcRenderer.invoke('allConfig', 'current');
        return await ipcRenderer.invoke('setStoreValue', 'profiles.'+profile+'.' + key, value);
      },
      async bulk(changes:object) {
        console.log('writing Config bulk', changes)
        return await ipcRenderer.invoke('setStoreValue', null, changes);
      }
    },
    database: {
      async query(queryString:string) {
        console.log('running database query')
        console.log(queryString)
        return await ipcRenderer.invoke('query-database', queryString);
      },
      async update(table:string, updateData:object[]) {
        console.log('updating the database.')
        return await ipcRenderer.invoke('update-database', table, updateData);
      },
      async upsert(table:string, data:any[], id:string, updateColumn:string) {
        console.log('running upsert on the database.')
        return await ipcRenderer.invoke('upsert-database', table, data, id, updateColumn);
      },
      async run(query:string) {
        console.log('running query' + query)
        return await ipcRenderer.invoke('run-database', query);
      },
      async deleteAllData(profileID: string) {
        console.log('deleting all data!')
        return await ipcRenderer.invoke('database-deleteAll', profileID);
      }
    },
    general: {
      openLink(link: string){
        ipcRenderer.invoke('open-external-link', link);
      }
    },
    binance: {
      async coinData(){
        return await ipcRenderer.invoke('binance-getCoins');
      }
    },
    pm: {
      async versions(){
        return await ipcRenderer.invoke('pm-versions');
      }
    }
  })
}



async function databaseSetup() {
  await ipcRenderer.invoke('database-checkOrMakeTables');
}


databaseSetup();

setupContextBridge();