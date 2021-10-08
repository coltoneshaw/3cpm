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
 * @param metric - accepts the `totalMaxRisk` metric from the global data store.
 */
const Card_MaxDca = ({metric, currency }:Type_Card) => {

    const title = "Max DCA"
    const message = descriptions.calculations.maxDca
    const key = title.replace(/\s/g, '')

    return ( <Card title={title} message={message} key={key} metric={formatCurrency(currency, metric)} /> )

}

export default Card_MaxDca;