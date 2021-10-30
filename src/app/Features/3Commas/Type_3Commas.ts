
type fetchDealDataFunctionQuery = {
    closed_at_str: string,
    final_profit: number
    deal_hours: number
    total_deals: number
}

type fetchPerformanceData = {
    performance_id: string,
    bot_name: string,
    pair: string[],
    averageHourlyProfitPercent: number,
    total_profit: number,
    number_of_deals: number,
    bought_volume: number,
    averageDealHours: number
}

type fetchBotPerformanceMetrics = {
    total_profit: string,
    avg_profit: number,
    number_of_deals : number,
    bought_volume : number,
    avg_deal_hours : number,
    avg_completed_so: number,
    bot_name : string,
    type: 'Bot::SingleBot' | 'Bot::MultiBot'
}

type fetchPairPerformanceMetrics = {
    pair:string
    avg_completed_so: number
    total_profit: number
    number_of_deals: number
    avg_profit: number
    bought_volume: number
    avg_deal_hours: number
}

type fetchSoData = {
    completed_safety_orders_count : number, 
    total_profit: number,
    total_deals : number
}