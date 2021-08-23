import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from "@/utils/number_formatting"


interface Type_Card {
    metric: number, 
    additionalData: {
        totalClosedDeals: number
        totalDealHours: number
    }
}

/**
 * 
 * @param metric - accepts the averageDailyProfit metric from the global data store.
 */
const Card_AverageDealHours = ({metric, additionalData}:Type_Card) => {

    const {totalClosedDeals, totalDealHours} = additionalData

    const title = "Avg. Deal Hours"
    const message = descriptions.calculations.averageDealHours( totalClosedDeals, totalDealHours)
    const key = title.replace(/\s/g, '')
    return (
        <Card title={title} message={message} key={key} metric={metric.toFixed(2)} />
    )
}

export default Card_AverageDealHours;