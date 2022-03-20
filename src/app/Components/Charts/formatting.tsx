import { formatCurrency, supportedCurrencies } from '@/utils/granularity';
import type { defaultCurrency } from '@/types/config';
import { dynamicSort } from '@/utils/helperFunctions';
import { BotPerformanceMetrics, PairPerformanceMetrics } from '@/types/3CommasApi';

const yAxisWidth = (defaultCurrency: defaultCurrency) => {
  const firstCurrency = defaultCurrency[0] ?? ['USD'];
  const yWidth = supportedCurrencies[firstCurrency].rounding * 10 ?? undefined;
  return (yWidth < 50) ? undefined : yWidth;
};

const currencyTickFormatter = (value: any, defaultCurrency: defaultCurrency) => {
  if (value === 0) return value;
  return String(formatCurrency([defaultCurrency[0]], value).metric);
};

const currencyTooltipFormatter = (value: any, defaultCurrency: defaultCurrency) => {
  if (value === 0) return value;

  const { metric, symbol } = formatCurrency([defaultCurrency[0]], value);
  return String(`${symbol} ${metric}`);
};

const filterData = (data: BotPerformanceMetrics[] | PairPerformanceMetrics[], filter: string) => {
  let newData = [...data];
  newData = newData.sort(dynamicSort('-total_profit'));
  const { length } = data;
  const fiftyPercent = length / 2;
  const twentyPercent = length / 5;

  if (filter === 'top20') {
    newData = newData.sort(dynamicSort('-total_profit'));
    return newData.filter((bot, index) => index < twentyPercent);
  } if (filter === 'top50') {
    newData = newData.sort(dynamicSort('-total_profit'));
    return newData.filter((bot, index) => index < fiftyPercent);
  } if (filter === 'bottom50') {
    newData = newData.sort(dynamicSort('total_profit'));
    return newData.filter((bot, index) => index < fiftyPercent);
  } if (filter === 'bottom20') {
    newData = newData.sort(dynamicSort('total_profit'));
    return newData.filter((bot, index) => index < twentyPercent);
  }

  return newData;
};

export {
  yAxisWidth,
  currencyTickFormatter,
  currencyTooltipFormatter,
  filterData,
};
