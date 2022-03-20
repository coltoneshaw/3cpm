import React, { useLayoutEffect, useState } from 'react';
import { useAppSelector } from '@/app/redux/hooks';

import {
  MetricCard,
} from '@/app/Components/Charts/DataCards';

import { Type_MetricData } from '@/types/3CommasApi';

const RoiCards = ({ metricsData, currentView }: { currentView: string, metricsData: Type_MetricData }) => {
  const { defaultCurrency } = useAppSelector((state) => state.config.currentProfile.general);

  const additionalMetrics = () => {
    const {
      activeDealCount, totalInDeals, maxRisk, totalMaxRisk, totalBankroll, position, on_orders: onOrders,
      totalProfit, totalBoughtVolume, reservedFundsTotal, maxRiskPercent, totalDeals,
      averageDailyProfit, averageDealHours, totalClosedDeals, totalDealHours,
    } = metricsData;

    const beginningCards = (
      <>
        <MetricCard
          metric={totalMaxRisk}
          currency={defaultCurrency}
          type="max-dca"
        />
        <MetricCard
          additionalData={{ totalProfit, totalBankroll }}
          currency={defaultCurrency}
          metric={(totalProfit / (totalBankroll - totalProfit))}
          type="total-roi"
        />
      </>
    );
    if (currentView === 'performance-monitor') {
      return (
        <>
          {beginningCards}
          <MetricCard
            metric={totalProfit}
            currency={defaultCurrency}
            type="total-profit"
          />
          <MetricCard
            metric={totalDeals}
            type="total-deals"
          />
          <MetricCard
            metric={averageDailyProfit}
            currency={defaultCurrency}
            type="average-daily-profit"
          />
          <MetricCard
            metric={averageDealHours}
            additionalData={{ totalClosedDeals, totalDealHours }}
            type="average-deal-hours"
          />
        </>
      );
    } if (currentView === 'risk-monitor') {
      return (
        <>
          {beginningCards}
          <MetricCard
            metric={maxRiskPercent}
            additionalData={{ totalBankroll, maxDCA: maxRisk, inactiveBotFunds: 0 }}
            currency={defaultCurrency}
            type="max-risk"
          />
          <MetricCard
            metric={activeDealCount}
            type="active-deals"
          />
          <MetricCard
            metric={totalInDeals}
            currency={defaultCurrency}
            additionalData={{ onOrders, totalBoughtVolume }}
            type="total-in-deals"
          />
          <MetricCard
            metric={totalBankroll}
            currency={defaultCurrency}
            additionalData={{ position, totalBoughtVolume, reservedFundsTotal }}
            type="total-bankroll"
          />
        </>
      );
    }

    return (
      <>
        {beginningCards}
        <MetricCard
          metric={totalProfit}
          currency={defaultCurrency}
          type="total-profit"
        />
        <MetricCard
          metric={activeDealCount}
          type="active-deals"
        />
        <MetricCard
          metric={totalInDeals}
          currency={defaultCurrency}
          additionalData={{ onOrders, totalBoughtVolume }}
          type="total-in-deals"
        />
        <MetricCard
          metric={totalBankroll}
          currency={defaultCurrency}
          additionalData={{ position, totalBoughtVolume, reservedFundsTotal }}
          type="total-bankroll"
        />
      </>
    );
  };

  const [cards, updateCards] = useState(() => additionalMetrics());
  useLayoutEffect(() => {
    updateCards(() => additionalMetrics());
  }, [metricsData, currentView, defaultCurrency]);

  return (
    <div className="flex-column" style={{ alignItems: 'center' }}>
      <div className="riskDiv" style={{ paddingBottom: '32px' }}>
        {cards}
      </div>
    </div>
  );
};

export default RoiCards;
