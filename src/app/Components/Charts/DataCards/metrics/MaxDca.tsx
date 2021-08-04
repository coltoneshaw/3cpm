import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from '@/utils/number_formatting'

interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts the `maxRisk` metric from the global data store.
 */
const Card_MaxDca = ({metric }:Type_Card) => {

    const title = "Max DCA"
    const message = descriptions.calculations.maxDca
    const key = title.replace(/\s/g, '')

    return (
        <Card title={title} message={message} key={key} metric={parseNumber(metric)} />
    )
}

export default Card_MaxDca;