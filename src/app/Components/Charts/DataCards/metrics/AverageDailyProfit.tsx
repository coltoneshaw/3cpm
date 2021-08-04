import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from "@/utils/number_formatting"


interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts the averageDailyProfit metric from the global data store.
 */
const Card_AverageDailyProfit = ({metric}:Type_Card) => {

    const title = "Average Daily Profit"
    const message = descriptions.metrics.averageDailyProfit
    const key = title.replace(/\s/g, '')
    return (
        <Card title={title} message={message} key={key} metric={parseNumber(metric)} />
    )
}

export default Card_AverageDailyProfit;