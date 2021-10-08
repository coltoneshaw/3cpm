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
 * @param metric - accepts the unrealized profit metric which is ( deal.take_profit / 100 ) * deal.bought_volume) 
 */
const Card_TotalUnrealizedProfit = ({metric, currency }:Type_Card) => {

    const title = "Unrealized Profit"
    const message = descriptions.metrics.totalUnrealizedProfit
    const key = title.replace(/\s/g, '')

    return ( <Card title={title} message={message} key={key} metric={formatCurrency(currency, metric)} /> )

}

export default Card_TotalUnrealizedProfit;