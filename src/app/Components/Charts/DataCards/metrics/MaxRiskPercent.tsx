import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from "@/utils/number_formatting"
import type {supportedCurrencies} from'@/utils/granularity'

interface Type_Card {
    metric: number,
    additionalData: { maxDCA:number , totalBankroll:number, inactiveBotFunds:number }
    currency: (keyof typeof supportedCurrencies)[]

}

/**
 * 
 * @param metric - accepts the risk metric calculated locally.
 * @param additionalData - accepts totalBankroll, maxDCA 
 */
const Card_MaxRiskPercent = ({metric, additionalData, currency}:Type_Card) => {

    const { totalBankroll, maxDCA, inactiveBotFunds } = additionalData;

    const title = "Risk %"
    const message = descriptions.calculations.risk(maxDCA, totalBankroll, inactiveBotFunds, currency)
    const key = title.replace(/\s/g, '')
    return (<Card title={title} message={message} key={key} metric={ {metric: parseNumber( metric, 2), symbol: '%'} } />)

}

export default Card_MaxRiskPercent;