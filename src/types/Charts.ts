import {
  ProfitArray, QueryPerformanceArray, ActiveDeals, Type_MetricData, BotPerformanceMetrics, PairPerformanceMetrics, SODistributionArray,
} from '@/types/3Commas';

import type { defaultCurrency } from '@/types/config';

export interface Type_SoDistribution {
  data: ActiveDeals[]
  metrics: Type_MetricData
  defaultCurrency: defaultCurrency
}

export type Type_SoDealDis = {
  defaultCurrency: defaultCurrency
  data: SODistributionArray[] | undefined
};

export interface ProfitArrayChart {
  data: ProfitArray[]
  X: string
  defaultCurrency: defaultCurrency
}

export interface Type_Pair_Performance {
  data: PairPerformanceMetrics[] | undefined | []
  defaultCurrency: defaultCurrency

}

export interface Type_Tooltip {
  active: boolean
  payload: any[]
  label: string,
  formatter: Function
}

export interface Type_DealPerformanceCharts {
  data: QueryPerformanceArray[] | undefined | []
  defaultCurrency: defaultCurrency

}

export interface Type_BotPerformanceCharts {
  data: BotPerformanceMetrics[] | undefined | []
  defaultCurrency: defaultCurrency

}

export interface Type_ActiveDealCharts {
  // title: string
  data: ActiveDeals[]
  defaultCurrency: defaultCurrency

}
