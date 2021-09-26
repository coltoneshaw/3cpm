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
 * @param metric - accepts a sum of the active deal reserves. Which is just a total of `actual_usd_profit` together.
 */
const Card_ActiveDealReserve = ({metric, currency }:Type_Card) => {

    const title = "Active Deal Reserve"
    const message = descriptions.metrics.activeDealReserves
    const key = title.replace(/\s/g, '')

    return ( <Card title={title} message={message} key={key} metric={formatCurrency(currency, metric)} /> )
}

export default Card_ActiveDealReserve;