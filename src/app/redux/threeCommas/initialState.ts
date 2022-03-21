import { ReservedFundsType } from '@/types/config';

import type {
  QueryBotsType,
  ActiveDeals,
  QueryAccountsType,
  MetricDataType,
  ProfitArray,
  PerformanceMetrics,
} from '@/types/3CommasApi';

export { MetricDataType as Type_MetricData, PerformanceMetrics, ReservedFundsType };
// Define the initial state using that type
export const initialState = {
  botData: <QueryBotsType[] | []>[],
  profitData: <ProfitArray[] | []>[],
  activeDeals: <ActiveDeals[] | []>[],
  performanceData: <PerformanceMetrics>{ pair_bot: [], bot: [], safety_order: [] },
  balanceData: { on_orders: 0, position: 0 },
  accountData: <QueryAccountsType[] | []>[],
  metricsData: <MetricDataType>{
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
    totalMaxRisk: 0,
  },
  additionalData: [],
  isSyncing: false,
  isSyncingTime: 0,
  syncOptions: <SyncDataType>{
    time: 0,
    syncCount: 0,
  },
  autoRefresh: false,
};

export type TypeString =
  'botData' | 'profitData' | 'activeDeals'
  | 'performanceData' | 'metricsData' | 'accountData' | 'balanceData';

export type SyncDataType = {
  time: number,
  syncCount: number
};

export type SetDataType =
  { type: 'botData', data: typeof initialState.botData } |
  { type: 'profitData', data: typeof initialState.profitData } |
  { type: 'activeDeals', data: typeof initialState.activeDeals } |
  { type: 'performanceData', data: typeof initialState.performanceData } |
  { type: 'balanceData', data: typeof initialState.balanceData } |
  { type: 'accountData', data: typeof initialState.accountData } |
  { type: 'metricsData', data: MetricDataType };
