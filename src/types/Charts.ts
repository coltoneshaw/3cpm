import { Type_Profit, Type_Query_PerfArray, Type_ActiveDeals, Type_MetricData, Type_Bot_Performance_Metrics, Type_Pair_Performance_Metrics } from '@/types/3Commas';

export interface Type_SoDistribution {
    title: string
    data: Type_ActiveDeals[]
    metrics: Type_MetricData
}


export interface Type_ProfitChart {
    data: Type_Profit[]
    X: string
}

export interface Type_Pair_Performance {
    title: string
    data: Type_Pair_Performance_Metrics[] | undefined | []
}


export interface Type_Tooltip  {
    active: boolean
    payload: any[]
    label: string
}

export interface Type_DealPerformanceCharts{
    title: string
    data: Type_Query_PerfArray[] | undefined | []
}

export interface Type_BotPerformanceCharts{
    title: string
    data: Type_Bot_Performance_Metrics[] | undefined | []
}

export interface Type_ActiveDealCharts{
    title: string
    data: Type_ActiveDeals[]
}