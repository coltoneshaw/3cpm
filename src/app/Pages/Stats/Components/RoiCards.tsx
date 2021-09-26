import React from "react";
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

    const {
        activeDealCount, totalInDeals, maxRisk, inactiveBotFunds, totalMaxRisk, totalBankroll, position, on_orders,
        totalProfit, totalBoughtVolume, reservedFundsTotal, maxRiskPercent, totalDeals,
        boughtVolume, totalProfit_perf, averageDailyProfit, averageDealHours, totalClosedDeals, totalDealHours } = metricsData

    const additionalMetrics = (currentView: string) => {
        if (currentView === 'performance-monitor') {
            return (
                <>
                    <Card_TotalProfit metric={totalProfit} currency={defaultCurrency} />
                    <Card_TotalDeals metric={totalDeals} />
                    <Card_AverageDailyProfit metric={averageDailyProfit}  currency={defaultCurrency} />
                    <Card_AverageDealHours metric={averageDealHours} additionalData={{ totalClosedDeals, totalDealHours }} />
                </>)
        } else if (currentView === 'risk-monitor') {
            return (
                <>
                    <Card_MaxRiskPercent metric={maxRiskPercent} additionalData={{ totalBankroll, maxDCA: maxRisk,  inactiveBotFunds }} currency={defaultCurrency} />
                    <Card_ActiveDeals metric={activeDealCount} />
                    <Card_totalInDeals metric={totalInDeals}  currency={defaultCurrency}  additionalData={{ on_orders, totalBoughtVolume }} />
                    <Card_TotalBankRoll metric={totalBankroll}  currency={defaultCurrency} additionalData={{ position, totalBoughtVolume, reservedFundsTotal }} />
                </>)
        }

        return (
            <>
                <Card_TotalProfit metric={totalProfit} currency={defaultCurrency} />
                <Card_ActiveDeals metric={activeDealCount} />
                <Card_totalInDeals metric={totalInDeals} currency={defaultCurrency}  additionalData={{ on_orders, totalBoughtVolume }} />
                <Card_TotalBankRoll metric={totalBankroll} currency={defaultCurrency} additionalData={{ position, totalBoughtVolume, reservedFundsTotal }} />
            </>)
    }


    return (
        <div className="flex-column" style={{ alignItems: 'center' }}>
            <div className="riskDiv" style={{ paddingBottom: '32px' }}>
                <Card_MaxDca metric={totalMaxRisk} currency={defaultCurrency}/>
                <Card_TotalRoi additionalData={{ totalProfit, totalBankroll }} currency={defaultCurrency}  />
                {additionalMetrics(currentView)}
            </div>
        </div>
    )
}

export default RoiCards