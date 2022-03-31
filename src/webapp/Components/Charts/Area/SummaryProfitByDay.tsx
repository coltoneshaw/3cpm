import React from 'react';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import NoData from 'webapp/Pages/Stats/Components/NoData';

import { getLang } from 'common/utils/helperFunctions';

import { ProfitArrayChart, TooltipType } from 'types/Charts';

import {
  yAxisWidth,
  currencyTickFormatter,
  currencyTooltipFormatter,
} from 'webapp/Components/Charts/formatting';

const lang = getLang();

const CustomTooltip = ({
  active, payload, formatter, label,
}: TooltipType<string, number>) => {
  if (!active || !payload || !payload[0]?.payload) return null;

  const formattedLabel = new Date(label).toLocaleString(getLang(), {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="tooltip">
      <h4>{formattedLabel}</h4>
      <p>{formatter(payload[0].value)}</p>
    </div>
  );
};

const SummaryProfitByDay = ({
  data = [],
  X,
  defaultCurrency,
}: ProfitArrayChart) => {
  const yWidth = yAxisWidth(defaultCurrency);

  const renderChart = () => {
    if (data.length === 0) {
      return (<NoData />);
    }

    return (
      <ResponsiveContainer width="100%" height="100%" minHeight="300px">
        <AreaChart
          width={500}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}

        >
          <CartesianGrid opacity={0.3} vertical={false} />
          <XAxis
            dataKey="utc_date"
            axisLine={false}
            tickLine={false}
            minTickGap={50}
            tickFormatter={(str) => {
              if (str === 'auto') return '';
              return new Date(str)
                .toLocaleDateString(lang, { month: '2-digit', day: '2-digit' });
            }}
          />
          <YAxis
            dataKey={X}
            tickLine={false}
            axisLine={false}
            // tickFormatter={tick => parseNumber(tick, 0)}
            tickCount={6}
            width={yWidth}
            tickFormatter={
              (value: any) => currencyTickFormatter(value, defaultCurrency)
            }
            type="number"
            allowDecimals
            domain={[0, 'auto']}
          />

          {/* TODO - pass the custom props down properly here.  */}
          <Tooltip
            content={(
              // @ts-ignore
              <CustomTooltip
                formatter={
                  (value: TooltipType<string, number>) => currencyTooltipFormatter(
                    value,
                    defaultCurrency,
                  )
                }
              />
            )}
            cursor={{ strokeDasharray: '3 3' }}
          />

          <defs>
            <linearGradient id="gradiant" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={20}
                stopColor="var(--chart-metric1-color)"
                stopOpacity={0.2}
              />
              <stop
                offset={0}
                stopColor="var(--chart-metric1-color)"
                stopOpacity={0.2}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={X}
            stroke="var(--chart-metric3-color)"
            strokeWidth={2}
            fill="url(#gradiant)"
          />
        </AreaChart>

      </ResponsiveContainer>
    );
  };

  return (
    <div className="boxData stat-chart">
      <h3 className="chartTitle">Cumulative profit by day </h3>
      {renderChart()}

    </div>
  );
};

export default SummaryProfitByDay;
