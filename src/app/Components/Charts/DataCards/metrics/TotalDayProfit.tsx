import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import {formatCurrency, supportedCurrencies} from'@/utils/granularity'

interface Type_Card {
    metric: number,
    currency: (keyof typeof supportedCurrencies)[]
}

/**
 * 
 * @param metric - accepts today's profit which can be calculated with `profitData[profitData.length - 1].profit` from the global data store.
 */
const Card_TotalDayProfit = ({metric, currency }:Type_Card) => {

    const title = "Today's Profit"
    const message = descriptions.metrics.todaysProfit
    const key = title.replace(/\s/g, '')

    return ( <Card title={title} message={message} key={key} metric={formatCurrency(currency, metric)} /> )

}

export default Card_TotalDayProfit;