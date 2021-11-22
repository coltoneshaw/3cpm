import React from 'react';
import { Type_Profit } from '@/types/3Commas';
import { formatCurrency } from '@/utils/granularity';

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

const ReturnPercent = ({ percent }: { percent: number }) => {
    if (percent > 0) return <span className="green-text roi-percent">(↑ {percent.toFixed(2)}%)</span>
    return <span className="red-text roi-percent">(↓ {percent.toFixed(2)}%)</span>
}

const MetricDiv = ({ current, percent, name }: {name: string, current: number, percent: number}) => {
    return (
        <div className="roiSpan">
            <strong>{name}:</strong>
            <p>${formatCurrency(['USD'], current).metric} <ReturnPercent percent={percent} /></p>
        </div>
    )
}

const calcRoi = (bankroll: number, currentProfit: number, priorProfit: number) => {
    const current = (currentProfit / (bankroll - currentProfit)) * 100
    const prior = (priorProfit / (bankroll - currentProfit - priorProfit)) * 100
    const change = current - prior
    return { prior, current, change }
}


const RoiMetrics = ({ stats, bankroll }: RoiMetrics) => {
    const dayDiff = calcRoi(bankroll, stats.current.day, stats.priors.day)
    const weekDiff = calcRoi(bankroll, stats.current.week, stats.priors.week)
    const monthDiff = calcRoi(bankroll, stats.current.month, stats.priors.month)

    return (<>
        <MetricDiv name="Day" current={stats.current.day} percent={dayDiff.change} />
        <MetricDiv name="Week" current={stats.current.week} percent={weekDiff.change} />
        <MetricDiv name="Month" current={stats.current.month} percent={monthDiff.change} />
    </>)
}

export default RoiMetrics;