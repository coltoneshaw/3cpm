/* eslint-disable max-len */
import { formatCurrency, supportedCurrencies } from 'common/utils/granularity';
import { parseNumber } from './utils/numberFormatting';

const descriptions = {
  calculations: {
    dropCoverage: 'is an approximation of the average % drop that your deals can take before you\'re out of funds. This is calculated by taking your total bankroll and dividing it by total active deals. Each deal is then given those funds to drop and it calculates how much of a drop that the deal can handle.',
    maxDca: ' factors in each active deal\'s max possible funds plus any manual safety orders you\'ve made on that deal.',
    activeBots: ' are the bots that you have enabled on this table below. It will not match 3C if you\'ve added custom bots to be enabled.',
    risk: (maxDCA: number, totalBankroll: number, inactiveBotFunds: number, currency: (keyof typeof supportedCurrencies)[]) => ` is calculated by dividing your total DCA max risk of ${formatCurrency(currency, maxDCA + inactiveBotFunds).metric} by your current bankroll of ${formatCurrency(currency, totalBankroll).metric}. ${(inactiveBotFunds) ? `This includes your bots that have the ability to open additional deals worth ${formatCurrency(currency, inactiveBotFunds).metric}.` : ''}`,
    totalBankRoll: (position: number, totalBoughtVolume: number, reservedFundsTotal: number, currency: (keyof typeof supportedCurrencies)[]) => ` is calculated by taking your total amount of funds in your filtered currencies of ${formatCurrency(currency, position).metric} and adding them with the amount you have in bought volume of an existing deal of ${formatCurrency(currency, totalBoughtVolume).metric} then subtracting reserved funds of ${formatCurrency(currency, reservedFundsTotal).metric}.`,
    activeDeals: ' is the total number of deals that are actually active within 3C. This will not always match active bots if you have specific start conditions.',
    totalInDeals: (on_orders: number, totalBoughtVolume: number, currency: (keyof typeof supportedCurrencies)[]) => ` adds together the total amount of funds that you have within a deal. This consists of funds on order of ${formatCurrency(currency, on_orders).metric} and total bought volume of your deals of ${formatCurrency(currency, totalBoughtVolume).metric}.`,
    totalProfit: ' is the sum of all the profit you\'ve made within the filtered time period.',
    totalRoi: (totalProfit: number, totalBankroll: number, currency: (keyof typeof supportedCurrencies)[]) => ` calculates the total return on your investment based on total bankroll of ${formatCurrency(currency, totalBankroll).metric} and your current profit of ${formatCurrency(currency, totalProfit).metric}. This formula is "Total Profit / ( Bankroll - Total Profit)"`,
    averageDealHours: (totalClosedDeals: number, totalDealHours: number) => ` is the average amount of time it takes for your deals to close. You have ${parseNumber(totalClosedDeals)} deals and ${parseNumber(totalDealHours)} hours in those deals.`,

  },
  metrics: {
    totalBoughtVolume: ' is the total that your bots have put into a deal.',
    totalDeals: ' is the total amount of deals closed during the filtered period.',
    averageDailyProfit: ' is the amount of total profit you\'ve made divided by the total number of days included in your filter.',
    todaysProfit: ' is the sum of the profit you\'ve made today (in UTC time). Note this does not always reset at midnight, depending on your timezone',
    'active-deal-reserves': ' is the sum of all your deals current profit. This number can be positive / negative based on where all your deals are currently.',
    totalUnrealizedProfit: ' is the total you would make if all your deals closed at their current settings.',
  },
};

export default descriptions;
