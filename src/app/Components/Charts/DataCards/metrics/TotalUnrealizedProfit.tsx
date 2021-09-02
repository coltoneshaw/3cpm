import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from '@/utils/number_formatting'

interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts the unrealized profit metric which is ( deal.take_profit / 100 ) * deal.bought_volume) 
 */
const Card_TotalUnrealizedProfit = ({metric }:Type_Card) => {

    const title = "Total Unrealized Profit"
    const message = descriptions.metrics.totalUnrealizedProfit
    const key = title.replace(/\s/g, '')

    return (
        <Card title={title} message={message} key={key} metric={'$' + parseNumber(metric, 2)} />
    )
}

export default Card_TotalUnrealizedProfit;