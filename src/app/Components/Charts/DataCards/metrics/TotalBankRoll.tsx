import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import {formatCurrency, supportedCurrencies} from'@/utils/granularity'

interface Type_Card {
    metric: number
    currency: (keyof typeof supportedCurrencies)[]
    additionalData: { position: number, totalBoughtVolume: number, reservedFundsTotal: number}
}

/**
 * 
 * @param metric - accepts the `totalBankroll` metric from the global data store.
 * @param 
 */
const Card_TotalBankRoll = ({metric, additionalData, currency }:Type_Card) => {

    const { position, totalBoughtVolume, reservedFundsTotal } = additionalData

    const title = "Total bankroll"
    const message = descriptions.calculations.totalBankRoll(position, totalBoughtVolume, reservedFundsTotal, currency)
    const key = title.replace(/\s/g, '')

    return ( <Card title={title} message={message} key={key} metric={formatCurrency(currency, metric)} /> )

}

export default Card_TotalBankRoll;