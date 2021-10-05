import { Type_Profit, Type_Query_PerfArray, Type_ActiveDeals, Type_MetricData, Type_Bot_Performance_Metrics, Type_Pair_Performance_Metrics } from '@/types/3Commas';

import type {defaultCurrency} from '@/types/config'
export interface Type_SoDistribution {
    data: Type_ActiveDeals[]
    metrics: Type_MetricData
    defaultCurrency: defaultCurrency
}

export interface Type_SoDealDis {
    defaultCurrency: defaultCurrency
}


export interface Type_ProfitChart {
    data: Type_Profit[]
    X: string
    defaultCurrency: defaultCurrency
}

export interface Type_Pair_Performance {
    data: Type_Pair_Performance_Metrics[] | undefined | []
    defaultCurrency: defaultCurrency

}


export interface Type_Tooltip  {
    active: boolean
    payload: any[]
    label: string,
    formatter: Function
}

export interface Type_DealPerformanceCharts{
    data: Type_Query_PerfArray[] | undefined | []
    defaultCurrency: defaultCurrency

}

export interface Type_BotPerformanceCharts{
    data: Type_Bot_Performance_Metrics[] | undefined | []
    defaultCurrency: defaultCurrency

}

export interface Type_ActiveDealCharts{
    // title: string
    data: Type_ActiveDeals[]
    defaultCurrency: defaultCurrency

}