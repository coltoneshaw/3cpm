import {
  TooltipProps,
} from 'recharts';

import {
  ProfitArray, QueryPerformanceArray, ActiveDeals, Type_MetricData, BotPerformanceMetrics, PairPerformanceMetrics, SODistributionArray,
} from '@/types/3CommasApi';

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
export declare type TooltipType<
  A extends string | number,
  B extends string | number> = TooltipProps<A, B> & {
    formatter: (value: any, defaultCurrency?: defaultCurrency) => string
  };
export interface Type_DealPerformanceCharts {
  data: QueryPerformanceArray[] | undefined | []
  defaultCurrency: defaultCurrency

}

export interface BotPerformanceChartsType {
  data: BotPerformanceMetrics[] | undefined | []
  defaultCurrency: defaultCurrency

}

export interface Type_ActiveDealCharts {
  // title: string
  data: ActiveDeals[]
  defaultCurrency: defaultCurrency

}
