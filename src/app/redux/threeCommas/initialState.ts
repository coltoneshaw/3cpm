import { Type_ReservedFunds, Type_Profile } from '@/types/config'


import type {
  QueryPerformanceArray,
  Type_Query_bots,
  ActiveDeals,
  Type_Query_Accounts,
  Type_MetricData,
  ProfitArray,
  BotPerformanceMetrics,
  PerformanceMetrics,
  PairPerformanceMetrics,
  Type_SyncOptions
} from '@/types/3Commas'

export { Type_MetricData, PerformanceMetrics, Type_ReservedFunds }
// Define the initial state using that type
export const initialState = {
  botData: <Type_Query_bots[] | []>[],
  profitData: <ProfitArray[] | []>[],
  activeDeals: <ActiveDeals[] | []>[],
  performanceData: <PerformanceMetrics>{ pair_bot: [], bot: [], safety_order: [] },
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
    time: 0,
    syncCount: 0
  },
  autoRefresh: false,
}

export type typeString = 'botData' | 'profitData' | 'activeDeals' | 'performanceData' | 'metricsData' | 'accountData' | 'balanceData'

export type Type_SyncData = {
  time: number,
  syncCount: number
}

export type setDataType =
  { type: 'botData', data: typeof initialState.botData } |
  { type: 'profitData', data: typeof initialState.profitData } |
  { type: 'activeDeals', data: typeof initialState.activeDeals } |
  { type: 'performanceData', data: typeof initialState.performanceData } |
  { type: 'balanceData', data: typeof initialState.balanceData } |
  { type: 'accountData', data: typeof initialState.accountData } |
  { type: 'metricsData', data: Type_MetricData }