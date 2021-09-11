export interface TconfigValues {
    profiles: Record<string, Type_Profile>,
    current: string,
    general: {
        version: string
    },
}

export interface Type_Profile {
    name: string,
    apis: {
        threeC: {
            key: string,
            secret: string,
            mode: string,
        }
    },
    general: {
        defaultCurrency: string[],
        globalLimit: number
        updated: boolean
    },
    syncStatus: {
        deals: {
            lastSyncTime: number | null
        }
    },
    statSettings: {
        startDate: number
        account_id: number[],
        reservedFunds: Type_ReservedFunds[]
    }

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