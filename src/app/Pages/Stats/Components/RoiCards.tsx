import React, { useLayoutEffect, useState } from "react";
import { useAppSelector } from '@/app/redux/hooks';

import {
    Card_ActiveDeals, Card_totalInDeals, Card_MaxDca,
    Card_TotalBankRoll, Card_TotalProfit, Card_MaxRiskPercent,
    Card_TotalBoughtVolume, Card_TotalDeals, Card_TotalRoi,
    Card_AverageDailyProfit, Card_AverageDealHours
} from '@/app/Components/Charts/DataCards';

import { Type_MetricData } from "@/types/3Commas";

const RoiCards = ({ metricsData, currentView }: { currentView: string, metricsData: Type_MetricData }) => {
    const { defaultCurrency } = useAppSelector(state => state.config.currentProfile.general);




    const additionalMetrics = (currentView: string, metricsData: Type_MetricData) => {
        const {
            activeDealCount, totalInDeals, maxRisk, inactiveBotFunds, totalMaxRisk, totalBankroll, position, on_orders,
            totalProfit, totalBoughtVolume, reservedFundsTotal, maxRiskPercent, totalDeals,
            boughtVolume, totalProfit_perf, averageDailyProfit, averageDealHours, totalClosedDeals, totalDealHours } = metricsData

        const beginningCards = (
            <>
                <Card_MaxDca metric={totalMaxRisk} currency={defaultCurrency} />
                <Card_TotalRoi title="Total ROI" additionalData={{ totalProfit, totalBankroll }} currency={defaultCurrency} />
            </>)
        if (currentView === 'performance-monitor') {
            return (
                <>
                {beginningCards }
                    <Card_TotalProfit metric={totalProfit} currency={defaultCurrency} />
                    <Card_TotalDeals metric={totalDeals} />
                    <Card_AverageDailyProfit metric={averageDailyProfit} currency={defaultCurrency} />
                    <Card_AverageDealHours metric={averageDealHours} additionalData={{ totalClosedDeals, totalDealHours }} />
                </>)
        } else if (currentView === 'risk-monitor') {
            return (
                <>
                {beginningCards}
                    <Card_MaxRiskPercent metric={maxRiskPercent} additionalData={{ totalBankroll, maxDCA: maxRisk, inactiveBotFunds }} currency={defaultCurrency} />
                    <Card_ActiveDeals metric={activeDealCount} />
                    <Card_totalInDeals metric={totalInDeals} currency={defaultCurrency} additionalData={{ on_orders, totalBoughtVolume }} />
                    <Card_TotalBankRoll metric={totalBankroll} currency={defaultCurrency} additionalData={{ position, totalBoughtVolume, reservedFundsTotal }} />
                </>)
        }

        return (
            <>
            {beginningCards}
                <Card_TotalProfit metric={totalProfit} currency={defaultCurrency} />
                <Card_ActiveDeals metric={activeDealCount} />
                <Card_totalInDeals metric={totalInDeals} currency={defaultCurrency} additionalData={{ on_orders, totalBoughtVolume }} />
                <Card_TotalBankRoll metric={totalBankroll} currency={defaultCurrency} additionalData={{ position, totalBoughtVolume, reservedFundsTotal }} />
            </>)
    }

    const [cards, updateCards] = useState(() => additionalMetrics(currentView, metricsData))
    useLayoutEffect(()=>{
        updateCards(() => additionalMetrics(currentView, metricsData))
    }, [metricsData, currentView, defaultCurrency])


    return (
        <div className="flex-column" style={{ alignItems: 'center' }}>
            <div className="riskDiv" style={{ paddingBottom: '32px' }}>
                {cards}
            </div>
        </div>
    )
}

export default RoiCards