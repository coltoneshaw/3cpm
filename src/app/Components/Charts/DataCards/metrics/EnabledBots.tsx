import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";


interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts the botCount metric. This is should be locally filtered and is the total number of enabled bots.
 */
const Card_EnabledBots = ({metric}:Type_Card) => {

    const title = "Active Bots"
    const message = descriptions.calculations.activeBots
    const key = title.replace(/\s/g, '')
    return (
        <Card title={title} message={message} key={key} metric={metric} />
    )
}

export default Card_EnabledBots;