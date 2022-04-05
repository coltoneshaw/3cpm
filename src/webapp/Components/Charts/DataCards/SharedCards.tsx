import React from 'react';

import descriptions from 'common/descriptions';
import { parseNumber } from 'common/utils/numberFormatting';
import { formatCurrency } from 'common/utils/granularity';
import {
  CardFunctions, MO, Keys, Metric,
} from './types';
import Card from './CardComponent';

const metricObject: MO = {
  'max-risk': {
    title: 'Risk %',
    description: descriptions.calculations.risk,
  },
  'active-deal-reserve': {
    title: 'Active Deal Reserve',
    description: descriptions.metrics['active-deal-reserves'],
  },
  'active-deals': {
    title: 'Active Deals',
    description: descriptions.calculations.activeDeals,
  },
  'average-daily-profit': {
    title: 'Average Daily Profit',
    description: descriptions.metrics.averageDailyProfit,
  },
  'average-deal-hours': {
    title: 'Avg. Deal Hours',
    description: descriptions.calculations.averageDealHours,
  },
  'drop-coverage': {
    title: 'Drop Coverage %',
    description: descriptions.calculations.dropCoverage,
  },
  'enabled-bots': {
    title: 'Enabled Bots',
    description: descriptions.calculations.activeBots,
  },
  'max-dca': {
    title: 'Max DCA',
    description: descriptions.calculations.maxDca,
  },
  'total-bankroll': {
    title: 'Total bankroll',
    description: descriptions.calculations.totalBankRoll,
  },
  'total-bought-volume': {
    title: 'Total Bought Volume',
    description: descriptions.metrics.totalBoughtVolume,
  },
  'todays-profit': {
    title: 'Todays Profit',
    description: descriptions.metrics.todaysProfit,
  },
  'total-deals': {
    title: 'Total Deals',
    description: descriptions.metrics.totalDeals,
  },
  'total-in-deals': {
    title: 'In Deals',
    description: descriptions.calculations.totalInDeals,
  },
  'total-profit': {
    title: 'Total Profit',
    description: descriptions.calculations.totalProfit,
  },
  'total-roi': {
    title: 'Total ROI',
    description: descriptions.calculations.totalRoi,
  },
  'total-unrealized-profit': {
    title: 'Unrealized Profit',
    description: descriptions.metrics.totalUnrealizedProfit,
  },
};

/**
 *
 * max-dca - accepts the `totalMaxRisk` metric from the global data store.
 * active-deal-reserve - accepts a sum of the active deal reserves. Which is just a total of `actual_usd_profit` together.
 * total-bankroll - accepts the `totalBankroll` metric from the global data store.
 * total-bought-volume - accepts the boughtVolume metric from the global data store.
 * total-daily-profit - accepts today's profit which can be calculated with `profitData[profitData.length - 1].profit` from the global data store.
 * total-deals - accepts the totalDeals metric from the global data store.
 * total-in-deals - accepts the activeDealCount metric from the global data store.
 * total-profit - accepts the `totalProfit` metric from the global data store.
 * total-unrealized-profit - - accepts the unrealized profit metric which is ( deal.take_profit / 100 ) * deal.bought_volume)
 */
const returnCardData = (
  type: CardFunctions['type'],
  additionalData: any,
  currency: CardFunctions['currency'],
  defaults: typeof metricObject[Keys],
  metric: CardFunctions['metric'],
) => {
  let message = defaults.description;

  let cardMetric: Metric = { metric, symbol: '' };

  if (type === 'max-risk') {
    // if (!additionalData) return { message: 'Invalid additional Data provided', cardMetric: { metric, symbol: '' } };
    const { totalBankroll, maxDCA, inactiveBotFunds } = additionalData;
    message = defaults.description(maxDCA, totalBankroll, inactiveBotFunds, currency);
    cardMetric = { metric: parseNumber(metric, 2), symbol: '%' };
  }

  if (type === 'average-daily-profit') {
    if (!currency) {
      return {
        message: 'No currency provided for average daily profit',
        cardMetric: { metric, symbol: '' },
      };
    }
    cardMetric = formatCurrency(currency, metric);
  }

  if (type === 'average-deal-hours') {
    if (!additionalData) return { message: 'Invalid additional Data provided', cardMetric: { metric, symbol: '' } };
    const { totalClosedDeals, totalDealHours } = additionalData;
    message = defaults.description(totalClosedDeals, totalDealHours);
  }

  if (type === 'drop-coverage' || type === 'active-deal-reserve') {
    cardMetric = { metric: parseNumber(metric, 2), symbol: '%' };
  }
  if (type === 'total-in-deals') {
    if (!additionalData) return { message: 'Invalid additional Data provided', cardMetric: { metric, symbol: '' } };
    const { onOrders, totalBoughtVolume } = additionalData;
    message = defaults.description(onOrders, totalBoughtVolume, currency);
  }
  if (type === 'total-roi') {
    if (!additionalData) return { message: 'Invalid additional Data provided', cardMetric: { metric, symbol: '' } };
    const { totalProfit, totalBankroll } = additionalData;
    message = defaults.description(totalProfit, totalBankroll, currency);
    cardMetric = { metric: `${parseNumber((metric * 100), 2)}%`, symbol: '' };
  }

  if (
    type === 'total-bankroll'
    || type === 'todays-profit'
    || type === 'total-in-deals'
    || type === 'total-unrealized-profit'
  ) {
    cardMetric = formatCurrency(currency, metric);
  }

  return {
    cardMetric,
    message,
  };
};

const MetricCard: React.FC<CardFunctions> = ({
  metric,
  additionalData,
  currency,
  type,
  title: CustomTitle,
}) => {
  const defaults = metricObject[type];
  if (!defaults) return null;
  const title = CustomTitle || defaults.title;
  const { cardMetric, message } = returnCardData(type, additionalData, currency, defaults, metric);
  const key = title.replace(/\s/g, '');

  return (
    <Card
      title={title}
      message={message}
      key={key}
      metric={cardMetric}
    />
  );
};

export default MetricCard;
