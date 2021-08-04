import React from "react";

import Card from "../Card";
import descriptions from "@/descriptions";
import { parseNumber } from '@/utils/number_formatting'

interface Type_Card {
    additionalData: { totalProfit_perf: number, boughtVolume: number}
}

/**
 * 
 * @param additionalData - accepts the `totalProfit_perf` and `boughtVolume` metric from the global data store.
 * @param
 */
const Card_TotalRoi = ({additionalData}:Type_Card) => {

    const { totalProfit_perf, boughtVolume } = additionalData

    // 

    const title = "Total ROI"
    const message = descriptions.calculations.totalRoi(totalProfit_perf, boughtVolume)
    const key = title.replace(/\s/g, '')
    const metric = ((totalProfit_perf / boughtVolume) * 100).toFixed(2) + "%"

    return (
        <Card title={title} message={message} key={key} metric={metric} />
    )
}

export default Card_TotalRoi;