import {
  TooltipProps,
} from 'recharts';

import {
  ProfitArray, QueryPerformanceArray, ActiveDeals, MetricDataType,
  BotPerformanceMetrics, PairPerformanceMetrics, SODistributionArray,
} from 'types/DatabaseQueries';

import type { DefaultCurrency } from 'types/config';

export interface SoDistributionType {
  data: ActiveDeals[]
  metrics: MetricDataType
  defaultCurrency: DefaultCurrency
}

export type SoDealDisType = {
  defaultCurrency: DefaultCurrency
  data: SODistributionArray[] | undefined
};

export interface ProfitArrayChart {
  data: ProfitArray[]
  X: string
  defaultCurrency: DefaultCurrency
}

export interface PairPerformanceType {
  data: PairPerformanceMetrics[] | undefined | []
  defaultCurrency: DefaultCurrency

}
export declare type TooltipType<
  A extends string | number,
  B extends string | number> = TooltipProps<A, B> & {
    formatter: (value: any, defaultCurrency?: DefaultCurrency) => string
  };
export interface DealPerformanceChartsType {
  data: QueryPerformanceArray[] | undefined | []
  defaultCurrency: DefaultCurrency

}

export interface BotPerformanceChartsType {
  data: BotPerformanceMetrics[] | undefined | []
  defaultCurrency: DefaultCurrency

}

export interface ActiveDealChartsType {
  // title: string
  data: ActiveDeals[]
  defaultCurrency: DefaultCurrency

}
