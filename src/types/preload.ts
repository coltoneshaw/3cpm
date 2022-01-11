import { defaultCurrency, Type_Profile } from '@/types/config';
import { defaultConfig } from "@/utils/defaultConfig";
import type { UpdateDealRequest } from "@/main/3Commas/types/Deals";
import { Type_UpdateFunction } from '@/types/3Commas'
import type { getDealOrders } from '@/main/3Commas/index';
import type {Type_GithubRelease} from '@/app/Repositories/Types/GithubRelease'
import type {BinanceTicketPrice} from '@/app/Repositories/Types/Binance';

declare global {
    interface Window {
        mainPreload: mainPreload
    }
}

export interface config {
    get: <T extends 'all' | string>(value: T) => Promise<T extends 'all' ? typeof defaultConfig : T extends string ? any : never>,
    profile: (type: 'create', newProfile: Type_Profile, profileId: string) => Promise<void>,
    getProfile: (value: string, profileId: string) => Promise< Type_Profile | undefined >,
    reset: () => Promise<void>,
    set: (key: string, value: any) => Promise<void>,
    // setProfile: (key: string, value: any) => Promise<any>,
    bulk: (changes: typeof defaultConfig) => Promise<void>
}


export type tableNames = 'deals' | 'bots' | 'accountData'
export interface database {
    query: (profileId:string, queryString: string) => Promise<any>,
    update: (profileId:string, table: tableNames, updateData: object[]) => void,
    upsert: (profileId:string, table: tableNames, data: any[], id: string, updateColumn: string) => void,
    run: (profileId:string, query: string) => void,
    deleteAllData: (profileID?: string) => Promise<void>
}

export interface api {
    update: (type: string, options: Type_UpdateFunction, profileData: Type_Profile) => Promise<false | number>,
    updateBots: (profileData: Type_Profile) => Promise<void>,
    getAccountData: (profileData?: Type_Profile, key?: string, secret?: string, mode?: string) => Promise<{ id: number, name: string }[]>,
    getDealOrders: (profileData: Type_Profile, dealID: number) => ReturnType<typeof getDealOrders>,
}

export interface general {
    openLink: (link: string) => void
}

export interface binance {
    coinData: () => Promise< BinanceTicketPrice | false >
}
export interface pm {
    versions: () => Promise<Type_GithubRelease[] | false >
}

interface mainPreload {
    deals: {
        update: (profileData: Type_Profile, deal: UpdateDealRequest) => Promise<void>
    },
    api: api,
    config: config,
    database: database,
    general: general,
    binance: binance,
    pm: pm
};

export {
    mainPreload,
    Type_Profile,
    defaultConfig,
    UpdateDealRequest,
    Type_UpdateFunction,
    getDealOrders
}