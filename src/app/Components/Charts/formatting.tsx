import { formatCurrency, supportedCurrencies } from '@/utils/granularity'
import type {defaultCurrency} from '@/types/config'
import { dynamicSort } from '@/utils/helperFunctions';
import { Type_Bot_Performance_Metrics, Type_Pair_Performance_Metrics } from '@/types/3Commas';


const yAxisWidth = (defaultCurrency: defaultCurrency) => {

    const firstCurrency = defaultCurrency[0] ?? ['USD'];
    return supportedCurrencies[firstCurrency].rounding * 10 ?? 45
}

const currencyTickFormatter = (value: any, defaultCurrency: defaultCurrency) => {
    if(value === 0) return value
    return String(formatCurrency([defaultCurrency[0]], value).metric)
}

const currencyTooltipFormatter = (value: any, defaultCurrency: defaultCurrency) => {
    if(value === 0) return value

    const {metric, symbol} = formatCurrency([defaultCurrency[0]], value);
    return String(symbol + ' ' + metric)
}

const filterData = (data: Type_Bot_Performance_Metrics[] | Type_Pair_Performance_Metrics[], filter:string ) => {
    let newData = [...data]
    newData = newData.sort(dynamicSort('-total_profit'));
    const length = data.length;
    const fiftyPercent = length / 2
    const twentyPercent = length / 5

    if (filter === 'top20')  {
        newData = newData.sort(dynamicSort('-total_profit'));
        return newData.filter( (bot, index) => index < twentyPercent)
    } else if (filter === 'top50')  {
        newData = newData.sort(dynamicSort('-total_profit'));
        return newData.filter( (bot, index) => index < fiftyPercent)
    } else if (filter === 'bottom50')  {
        newData = newData.sort(dynamicSort('total_profit'));
        return newData.filter( (bot, index) => index < fiftyPercent)
    } else if (filter === 'bottom20')  {
        newData = newData.sort(dynamicSort('total_profit'));
        return newData.filter( (bot, index) => index < twentyPercent)
    }

    return newData;
}

export {
    yAxisWidth,
    currencyTickFormatter,
    currencyTooltipFormatter,
    filterData
};