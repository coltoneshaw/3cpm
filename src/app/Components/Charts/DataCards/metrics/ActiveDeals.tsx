import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";


interface Type_Card {
    metric: number
}

/**
 * 
 * @param metric - accepts the activeDealCount metric from the global data store.
 */
const Card_ActiveDeals = ({metric}:Type_Card) => {

    const title = "Active Deals"
    const message = descriptions.calculations.activeDeals
    const key = title.replace(/\s/g, '')
    return (
        <Card title={title} message={message} key={key} metric={metric} />
    )
}

export default Card_ActiveDeals;