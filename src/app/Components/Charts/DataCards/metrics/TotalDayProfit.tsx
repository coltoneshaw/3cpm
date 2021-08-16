import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from '@/utils/number_formatting'

interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts today's profit which can be calculated with `profitData[profitData.length - 1].profit` from the global data store.
 */
const Card_TotalDayProfit = ({metric }:Type_Card) => {

    const title = "Today's Profit"
    const message = descriptions.metrics.todaysProfit
    const key = title.replace(/\s/g, '')

    return (
        <Card title={title} message={message} key={key} metric={'$' + parseNumber(metric, 2)} />
    )
}

export default Card_TotalDayProfit;