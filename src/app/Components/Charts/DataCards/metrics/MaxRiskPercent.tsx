import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from "@/utils/number_formatting"


interface Type_Card {
    metric: number,
    additionalData: { maxDCA:number , totalBankroll:number, inactiveBotFunds:number }
}

/**
 * 
 * @param metric - accepts the risk metric calculated locally.
 * @param additionalData - accepts totalBankroll, maxDCA 
 */
const Card_MaxRiskPercent = ({metric, additionalData}:Type_Card) => {

    const { totalBankroll, maxDCA, inactiveBotFunds } = additionalData;

    const title = "Risk %"
    const message = descriptions.calculations.risk(maxDCA, totalBankroll, inactiveBotFunds)
    const key = title.replace(/\s/g, '')
    return (
        <Card title={title} message={message} key={key} metric={ parseNumber( metric, 2) + "%"} />
    )
}

export default Card_MaxRiskPercent;