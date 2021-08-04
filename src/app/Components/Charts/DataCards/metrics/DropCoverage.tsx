import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";


interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts the dropCoverage metric calculated locally.
 */
const Card_DropCoverage = ({metric}:Type_Card) => {

    const title = "Drop Coverage %"
    const message = descriptions.calculations.dropCoverage
    const key = title.replace(/\s/g, '')
    return (
        <Card title={title} message={message} key={key} metric={metric.toFixed(2) + "%"} />
    )
}

export default Card_DropCoverage;