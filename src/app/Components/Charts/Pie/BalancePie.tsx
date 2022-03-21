import React from 'react';
import {
  PieChart, Pie, Legend, Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { currencyTooltipFormatter } from '../formatting';

// types
import type { TooltipType } from '@/types/Charts';
import type { MetricDataType } from '@/types/3CommasApi';
import type { DefaultCurrency } from '@/types/config';

const CustomTooltip = ({ active, payload, formatter }: TooltipType<string, number>) => {
  if (!active || !payload || !payload[0]?.payload) return null;

  const { name, metric, percent } = payload[0].payload;
  return (
    <div className="tooltip">
      <h4>{name}</h4>
      <p>{formatter(metric)}</p>
      <p>
        {(percent) ? percent.toFixed(2) : 0}
        %
      </p>
    </div>
  );
};
interface PieMetricsType {
  title: string
  metrics: MetricDataType
  defaultCurrency: DefaultCurrency
}
const BalancePie = ({ title, metrics, defaultCurrency }: PieMetricsType) => {
  const {
    availableBankroll, totalBoughtVolume, on_orders: onOrders, totalBankroll,
  } = metrics;
  const chartData = [{
    name: 'Available',
    metric: availableBankroll,
    percent: (availableBankroll / totalBankroll) * 100,
    key: 1,
    color: 'var(--chart-metric2-color)',
  },
  {
    name: 'Limit Orders',
    metric: onOrders,
    percent: (onOrders / totalBankroll) * 100,
    key: 2,
    color: 'var(--chart-metric1-color)',
  },
  {
    name: 'Purchased',
    metric: totalBoughtVolume,
    percent: (totalBoughtVolume / totalBankroll) * 100,
    key: 3,
    color: 'var(--chart-metric3-color)',
  },

  ];

  return (
    <div
      className="boxData"
      style={{
        height: '250px',
        minWidth: '300px',
        maxWidth: '300px',
      }}
    >
      <div style={{
        width: '300px',
        height: '250px',
      }}
      >
        <h3 className="chartTitle">{title}</h3>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={300}>
            <Pie
              data={chartData}
              dataKey="metric"
              cx="50%"
              cy="50%"
              outerRadius={85}
              style={{ outline: 'none' }}
            >
              {chartData.map((entry) => (
                <Cell key={`cell-${entry.key}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            {/* TODO - pass the custom props down properly here.  */}
            <Tooltip
              content={(
                <CustomTooltip
                  formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)}
                />
              )}
            />
          </PieChart>
        </ResponsiveContainer>

      </div>

    </div>

  );
};

export default BalancePie;
