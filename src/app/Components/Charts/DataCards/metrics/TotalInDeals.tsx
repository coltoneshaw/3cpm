import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import {formatCurrency, supportedCurrencies} from'@/utils/granularity'

interface Type_Card {
    metric: number
    additionalData: { on_orders: number, totalBoughtVolume:number }
    currency: (keyof typeof supportedCurrencies)[]

}

/**
 * 
 * @param metric - accepts the activeDealCount metric from the global data store.
 * @param additionalData - requires on_orders and totalBoughtVolume to be passed in.
 */
const Card_totalInDeals = ({metric, currency, additionalData: { on_orders, totalBoughtVolume }}:Type_Card) => {

    const title = "In deals"
    const message = descriptions.calculations.totalInDeals(on_orders, totalBoughtVolume, currency)
    const key = title.replace(/\s/g, '')

    return (
        <Card title={title} message={message} key={key} metric={formatCurrency(currency, metric)} />
    )
}

export default Card_totalInDeals;