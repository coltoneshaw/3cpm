import { defaultConfig } from 'common/utils/defaultConfig';
import type { getDealOrders } from 'electron/main/3Commas/index';
import { UpdateFunctionType } from 'types/DatabaseQueries';
import type { Deals } from 'types/3cAPI';
import { ProfileType } from 'types/config';

declare global {
  interface Window {
    mainPreload: MainPreload
  }
}

export interface Config {
  get: <T extends 'all' | string>(value: T) => Promise<T extends 'all'
    ? typeof defaultConfig : T extends string ? any : never>,
  profile: (type: 'create', newProfile: ProfileType, profileId: string) => Promise<void>,
  getProfile: (value: string, profileId: string) => Promise<ProfileType | undefined>,
  reset: () => Promise<void>,
  set: (key: string, value: any) => Promise<void>,
  // setProfile: (key: string, value: any) => Promise<any>,
  bulk: (changes: typeof defaultConfig) => Promise<void>
}

export type TableNames = 'deals' | 'bots' | 'accountData';
export interface Database {
  query: (profileId: string, queryString: string) => Promise<any>,
  update: (profileId: string, table: TableNames, updateData: object[]) => void,
  upsert: (profileId: string, table: TableNames, data: any[], id: string, updateColumn: string) => void,
  run: (profileId: string, query: string) => void,
  deleteAllData: (profileID?: string) => Promise<void>
}

export interface API {
  update: (type: string, options: UpdateFunctionType, profileData: ProfileType) => Promise<false | number>,
  updateBots: (profileData: ProfileType) => Promise<void>,
  getAccountData: (
    profileData?: ProfileType,
    key?: string,
    secret?: string,
    mode?: string
  ) => Promise<{ id: number, name: string }[]>,
  getDealOrders: (profileData: ProfileType, dealID: number) => ReturnType<typeof getDealOrders>,
}

export interface General {
  openLink: (link: string) => void
}

interface MainPreload {
  deals: {
    update: (profileData: ProfileType, deal: Deals.Params.UpdateDeal) => Promise<Deals.Responses.Deal>
  },
  api: API,
  config: Config,
  database: Database,
  general: General,
}

export {
  MainPreload,
  ProfileType,
  defaultConfig,
  UpdateFunctionType as Type_UpdateFunction,
  getDealOrders,
};
