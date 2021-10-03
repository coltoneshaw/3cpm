import { Type_ReservedFunds, Type_Profile } from '@/types/config'


import type {
    Type_Query_PerfArray,
    Type_Query_bots,
    Type_ActiveDeals,
    Type_Query_Accounts,
    Type_MetricData,
    Type_Profit,
    Type_Bot_Performance_Metrics,
    Type_Performance_Metrics,
    Type_Pair_Performance_Metrics,
    Type_SyncOptions
} from '@/types/3Commas'

export {Type_MetricData, Type_Performance_Metrics, Type_ReservedFunds}
// Define the initial state using that type
export const initialState = {
    botData: <Type_Query_bots[] | []>[],
    profitData: <Type_Profit[] | []>[],
    activeDeals: <Type_ActiveDeals[] | []>[],
    performanceData: <Type_Performance_Metrics>{ pair_bot: [], bot: [], safety_order: [] },
    balanceData: { on_orders: 0, position: 0 },
    accountData: <Type_Query_Accounts[] | []>[],
    metricsData: <Type_MetricData>{
        activeDealCount: 0,
        totalProfit_perf: 0,
        totalDeals: 0,
        boughtVolume: 0,
        averageDealHours: 0,
        averageDailyProfit: 0,
        totalBoughtVolume: 0,
        maxRisk: 0,
        totalProfit: 0,
        maxRiskPercent: 0,
        bankrollAvailable: 0,
        totalBankroll: 0,
        position: 0,
        on_orders: 0,
        totalInDeals: 0,
        availableBankroll: 0,
        reservedFundsTotal: 0,
        totalClosedDeals: 0,
        totalDealHours: 0,
        inactiveBotFunds: 0,
        totalMaxRisk: 0
    },
    additionalData: [],
    isSyncing: false,
    isSyncingTime: 0,
    syncOptions: <Type_SyncData>{
            summary: false,
            notifications: true,
            time: 0,
            syncCount: 0
    },
    autoRefresh: false,
}

export type typeString = 'botData' | 'profitData' | 'activeDeals' | 'performanceData' | 'metricsData' | 'accountData' | 'balanceData'

export type Type_SyncData = {
    summary?: boolean,
    notifications?: boolean,
    time?: number,
    syncCount?: number
}

export type setDataType =
    { type: 'botData', data: typeof initialState.botData } |
    { type: 'profitData', data: typeof initialState.profitData } |
    { type: 'activeDeals', data: typeof initialState.activeDeals } |
    { type: 'performanceData', data: typeof initialState.performanceData } |
    { type: 'balanceData', data: typeof initialState.balanceData } |
    { type: 'accountData', data: typeof initialState.accountData } |
    { type: 'metricsData', data: Type_MetricData }