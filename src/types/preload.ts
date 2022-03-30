import { ProfileType } from '@/types/config';
import { defaultConfig } from '@/utils/defaultConfig';
import type { Deals } from '@/types/3cAPI';
import { UpdateFunctionType } from '@/types/DatabaseQueries';
import type { getDealOrders } from '@/main/3Commas/index';
import type { GithubReleaseType } from '@/webapp/Repositories/Types/GithubRelease';
import type { BinanceTicketPrice } from '@/webapp/Repositories/Types/Binance';

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

export interface Binance {
  coinData: () => Promise<BinanceTicketPrice[] | false>
}
export interface PM {
  versions: () => Promise<GithubReleaseType[] | false>
}

interface MainPreload {
  deals: {
    update: (profileData: ProfileType, deal: Deals.Params.UpdateDeal) => Promise<Deals.Responses.Deal>
  },
  api: API,
  config: Config,
  database: Database,
  general: General,
  binance: Binance,
  pm: PM
}

export {
  MainPreload,
  ProfileType,
  defaultConfig,
  UpdateFunctionType as Type_UpdateFunction,
  getDealOrders,
};
