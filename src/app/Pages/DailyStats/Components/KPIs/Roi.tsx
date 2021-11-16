import React from 'react';
import { queryProfitDataByDay } from '@/app/Pages/DailyStats/Components'
import { Type_Profit } from '@/types/3Commas';
import { formatCurrency } from '@/utils/granularity';
/**
 * 
 * TODO
 * 
 * - Pull 60 day metrics
 * - Calculate last 30 / 7 / 1
 */

type statsReturn = {
    profitData: Type_Profit[] | [];
    metrics: {
        totalProfit: number;
        averageDailyProfit: number;
        averageDealHours: number;
        totalClosedDeals: number;
        totalDealHours: number;
    },
    priors: {
        month: number,
        week: number,
        day: number
    },
    current: {
        month: number,
        week: number,
        day: number
    }
}



type RoiMetrics = {
    stats: statsReturn,
    bankroll: number
}

const returnPercent = (percent: number) => {
    if (percent > 0) return <span className="green-text roi-percent">(↑ {percent.toFixed(2)}%)</span>
    return <span className="red-text roi-percent">(↓ {percent.toFixed(2)}%)</span>

}

const calcRoi = (bankroll: number, currentProfit: number, priorProfit: number) => {

    const current = (currentProfit / (bankroll - currentProfit)) * 100
    const prior = (priorProfit / (bankroll - currentProfit - priorProfit)) * 100
    const change = current - prior

    return {
        prior,
        current,
        change
    }

}

const RoiMetrics = ({ stats, bankroll }: RoiMetrics) => {

    const monthDiff = calcRoi(bankroll, stats.current.month, stats.priors.month)
    const weekDiff = calcRoi(bankroll, stats.current.week, stats.priors.week)
    const dayDiff = calcRoi(bankroll, stats.current.day, stats.priors.day)

    return (
        <>
            <div className="roiSpan">
                <strong>Day:</strong> 
                <p>${formatCurrency( ['USD'], stats.current.day ).metric } {returnPercent(dayDiff.change)}</p>
            </div>
            <div className="roiSpan">
                <strong>7 days:</strong> 
                <p>${formatCurrency( ['USD'],stats.current.week ).metric} {returnPercent(weekDiff.change)}</p>
            </div>
            <div className="roiSpan">
                <strong>30 days:</strong> 
                <p>${formatCurrency( ['USD'],stats.current.month).metric } {returnPercent(monthDiff.change)}</p>
            </div>
        </>
    )

}

export default RoiMetrics;