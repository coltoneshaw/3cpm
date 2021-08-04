import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from '@/utils/number_formatting'

interface Type_Card {
    metric: number
    additionalData: { position: number, totalBoughtVolume: number, reservedFundsTotal: number}
}

/**
 * 
 * @param metric - accepts the `totalBankroll` metric from the global data store.
 * @param
 */
const Card_TotalBankRoll = ({metric, additionalData }:Type_Card) => {

    const { position, totalBoughtVolume, reservedFundsTotal } = additionalData

    const title = "Total bankroll"
    const message = descriptions.calculations.totalBankRoll(position, totalBoughtVolume, reservedFundsTotal)
    const key = title.replace(/\s/g, '')

    return (
        <Card title={title} message={message} key={key} metric={parseNumber(metric)} />
    )
}

export default Card_TotalBankRoll;