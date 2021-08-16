import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from '@/utils/number_formatting'

interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts a sum of the active deal reserves. Which is just a total of `actual_usd_profit` together.
 */
const Card_ActiveDealReserve = ({metric }:Type_Card) => {

    const title = "Active Deal Reserve"
    const message = descriptions.metrics.activeDealReserves
    const key = title.replace(/\s/g, '')

    return (
        <Card title={title} message={message} key={key} metric={'$' + parseNumber(metric, 2)} />
    )
}

export default Card_ActiveDealReserve;