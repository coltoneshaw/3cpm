
type queryDealByPairByDayQuery = {
    pair: string[],
    averageHourlyProfitPercent: number,
    totalProfit: number,
    numberOfDeals: number,
    boughtVolume: number,
    averageDealHours: number
}


type queryDealByPairByDayReturn = queryDealByPairByDayQuery & {
    percentTotalVolume: number;
    percentTotalProfit: number;
}


type botQueryDealByDayQuery = {
    bot_name: string,
    bot_id: number,
    averageHourlyProfitPercent: number,
    totalProfit: number,
    numberOfDeals: number,
    boughtVolume: number,
    averageDealHours: number
}


type botQueryDealByDayReturn = botQueryDealByDayQuery & {
    percentTotalVolume: number;
    percentTotalProfit: number;
}
