import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from '@/utils/number_formatting'

interface Type_Card {
    metric: number
    additionalData: { on_orders: number, totalBoughtVolume:number }
}

/**
 * 
 * @param metric - accepts the activeDealCount metric from the global data store.
 * @param additionalData - requires on_orders and totalBoughtVolume to be passed in.
 */
const Card_totalInDeals = ({metric, additionalData: { on_orders, totalBoughtVolume }}:Type_Card) => {

    const title = "Total in deals"
    const message = descriptions.calculations.totalInDeals(on_orders, totalBoughtVolume)
    const key = title.replace(/\s/g, '')

    return (
        <Card title={title} message={message} key={key} metric={parseNumber(metric)} />
    )
}

export default Card_totalInDeals;