import React from 'react';

import { useAppSelector } from '@/app/redux/hooks';
import { Type_Query_bots } from '@/types/3CommasApi';

import { MetricCard } from '@/app/Components/Charts/DataCards';

// Need to import metric contexts here
const Risk = ({ localBotData }: { localBotData: Type_Query_bots[] }) => {
  const { defaultCurrency } = useAppSelector((state) => state.config.currentProfile.general);
  const {
    metricsData: {
      totalBankroll, totalBoughtVolume, position, reservedFundsTotal,
    },
  } = useAppSelector((state) => state.threeCommas);
  /**
     * Bankroll - sum, on_orders, position all added together. Needs to come from global state most likely.
     * risk - bank roll / total DCA risk
     * active bots - count of bots with enabled flagged.
     * DCA Max risk - sum of the max_bot_usage.
     */

  const enabledDeals = localBotData.filter((bot) => bot.is_enabled && !bot.hide);

  /**
     * TODO
     * - Can move these calculations on to the data card itself to clean up these functions. That would mean not every card gets a metric since most are calculated.
     */
  const maxDCA = (enabledDeals.length > 0)
    ? enabledDeals
      .map((deal) => deal.max_funds)
      .reduce((sum, max) => sum + max)
    : 0;
  // const inactiveBotFunds = result.map(r => r.enabled_inactive_funds).reduce((sum, funds) => sum + funds ) ?? 0;

  const risk = (maxDCA / totalBankroll) * 100;
  const botCount = localBotData.filter((deal) => deal.is_enabled).length;

  const sumDropCoverage = (enabledDeals.length > 0)
    ? enabledDeals
      .map((deal) => ((deal.maxCoveragePercent) ? deal.maxCoveragePercent : 0))
      .reduce((sum, max) => sum + max)
    : 0;
  const dropCoverage = sumDropCoverage / enabledDeals.length;

  return (
    <div className="riskDiv activeDealCards" style={{ flex: 1 }}>
      <MetricCard
        metric={totalBankroll}
        currency={defaultCurrency}
        additionalData={{ position, totalBoughtVolume, reservedFundsTotal }}
        type="total-bankroll"
      />
      <MetricCard
        metric={risk}
        additionalData={{ totalBankroll, maxDCA, inactiveBotFunds: 0 }}
        currency={defaultCurrency}
        type="max-risk"
      />
      <MetricCard
        metric={botCount}
        type="enabled-bots"
      />
      <MetricCard
        metric={maxDCA}
        currency={defaultCurrency}
        type="max-dca"
      />
      <MetricCard
        metric={dropCoverage}
        type="drop-coverage"
      />

    </div>
  );
};

export default Risk;
