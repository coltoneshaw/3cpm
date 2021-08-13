import { parseNumber } from "./utils/number_formatting";

const descriptions = {
    calculations: {
        dropCoverage: `is essentially the average % drop that your deals can take before you're out of funds. This is calculated by taking your total bankroll and dividing it by total active deals. Each deal is then given those funds to drop and it calculates how much of a drop that the deal can handle.`,
        maxDca: ` factors in each active deal's max possible funds plus any manual safety orders you've made on that deal.`,
        activeBots: ` are the bots that you have enabled on this table below. It will not match 3C if you've added custom bots to be enabled.`,
        risk: (maxDCA:number, totalBankroll:number) => ` is calculated by diving your total DCA max risk of ${parseNumber(maxDCA)} by your current bankroll of ${parseNumber(totalBankroll)}.`,
        totalBankRoll: (position:number, totalBoughtVolume:number, reservedFundsTotal:number ) => ` is calculated by taking your total amount of funds in your filtered currencies of ${parseNumber(position)} and adding them with the amount you have in bought volume of an existing deal of ${parseNumber(totalBoughtVolume)} then subtracting reserved funds of ${parseNumber(reservedFundsTotal)}.`,
        activeDeals: ` is the total number of deals that are actually active within 3C. This will not always match active bots if you have specific start conditions.`,
        totalInDeals: ( on_orders:number , totalBoughtVolume:number ) => ` adds together the total amount of funds that you have within a deal. This consists of funds on order of ${parseNumber(on_orders)} and total bought volume of your deals of ${parseNumber(totalBoughtVolume)}.`,
        totalProfit: ` is the sum of all the profit you've made within the filtered time period.`,
        totalRoi: ( totalProfit_perf:number , boughtVolume:number ) => ` calculates the total return on your investment based on the bought volume of ${parseNumber(boughtVolume)} divided by the total profit of ${parseNumber(totalProfit_perf)}`,

    },
    metrics: {
        totalBoughtVolume: ` is the total that your bots have put into a deal.`,
        totalDeals: ` is the total amount of deals closed during the filtered period.`,
        averageDailyProfit: ` is the amount of total profit you've made divided by the total number of days included in your filter.`,
        averageDealHours: ` is the total average amount of time it takes for your deals to close.`,
        todaysProfit: ` is the sum of the profit you've made in UTC today. Note this does not always reset at midnight, depending on your timezone`,
        activeDealReserves: ` is the sum of all your deals current profit. This number can be postive / negative based on where all your deals are currently.`
    }
}

export default descriptions;