import type { supportedCurrencies } from 'common/utils/granularity';

export type DefaultCurrency = (keyof typeof supportedCurrencies)[] | [];

export interface ProfileType {
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
    defaultCurrency: DefaultCurrency
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
    reservedFunds: ReservedFundsType[]
  },
  writeEnabled: boolean,
}

export type NotificationsSettingsType = {
  enabled: boolean,
  summary: boolean,
};

export type GlobalSettingsType = {
  notifications: NotificationsSettingsType
};

export interface ReservedFundsType {
  id: number
  account_name: string
  reserved_funds: string | number
  is_enabled: boolean
}

export interface ApiKeys {
  key: string
  secret: string
}

export type ConfigValuesType = {
  profiles: Record<string, ProfileType>,
  current: string | 'default',
  globalSettings: GlobalSettingsType,
  general: {
    version: string
  },
};

export interface ConfigContextType {
  config: ConfigValuesType
  currentProfile: ProfileType
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
    reservedFunds: ReservedFundsType[],
    updateReservedFunds: any
    currentProfileId: string
    updateCurrentProfileId: any
  },
  actions: {
    fetchAccountsForRequiredFunds: any
  }
}
