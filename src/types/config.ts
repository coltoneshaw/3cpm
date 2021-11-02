import type { supportedCurrencies } from '@/utils/granularity'

export type TconfigValues = {
    profiles: Record<string, Type_Profile>,
    current: string,
    globalSettings: Type_GlobalSettings,
    general: {
        version: string
    },
}

export type defaultCurrency = (keyof typeof supportedCurrencies)[] | []

export interface Type_Profile {
    id: string
    name: string,
    apis: {
        threeC: {
            key: string,
            secret: string,
            mode: string,
        }
    },
    general: {
        defaultCurrency: defaultCurrency
        globalLimit: number
        updated: boolean
    },
    syncStatus: {
        deals: {
            lastSyncTime: number 
        }
    },
    statSettings: {
        startDate: number
        account_id: number[],
        reservedFunds: Type_ReservedFunds[]
    },
    writeEnabled: boolean,
}

export interface Type_GlobalSettings {
    notifications: Type_NotificationsSettings
}

export type Type_NotificationsSettings = {
    enabled: boolean,
    summary: boolean,
}


export interface Type_ReservedFunds {
    id: number
    account_name: string
    reserved_funds: number
    is_enabled: boolean
}

export interface Type_ApiKeys {
    key: string
    secret: string
}

export interface Type_ConfigContext {
    config: TconfigValues
    currentProfile: Type_Profile
    updateConfig: any
    setConfigBulk: any
    reset: any
    state: {
        accountID: number[]
        updateAccountID: any
        date: number
        updateDate: any
        currency: string[]
        updateCurrency: any
        updateApiData: any
        apiData: { key: string, secret: string, mode: string }
        reservedFunds: Type_ReservedFunds[],
        updateReservedFunds: any
        currentProfileId: string
        updateCurrentProfileId: any
    },
    actions: {
        fetchAccountsForRequiredFunds: any
    }
}