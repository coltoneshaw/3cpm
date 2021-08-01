export interface TconfigValues {
    "apis": {
        "threeC": {
            key: string,
            secret: string
        }
    },
    "general": {
        defaultCurrency: string,
        globalLimit: number
    },
    "syncStatus": {
        "deals": {
            lastSyncTime: number | null
        }
    },
    statSettings: {
        startDate: number
        account_id: number[]
    }
}

export interface Type_ApiKeys {
    key: string
    secret: string
}