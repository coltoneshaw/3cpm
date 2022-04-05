import React from 'react';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { formatPercent, parseNumber } from 'common/utils/numberFormatting';
import { dynamicSort } from 'common/utils/helperFunctions';

import NoData from 'webapp/Pages/Stats/Components/NoData';
import { currencyTooltipFormatter } from 'webapp/Components/Charts/formatting';

import type { ActiveDeals } from 'types/DatabaseQueries';
import type { TooltipType, ActiveDealChartsType } from 'types/Charts';

const CustomTooltip: React.FC<TooltipType<number, string>> = ({
  active, payload, label, formatter,
}) => {
  if (!active || !payload || !payload[0] || !payload[0]?.payload) return null;

  const deal: ActiveDeals = payload[0].payload;

  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    bought_volume, so_volume_remaining, max_deal_funds, bot_name,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    completed_safety_orders_count, completed_manual_safety_orders_count, max_safety_orders,
  } = deal;

  const totalSOs = completed_safety_orders_count + completed_manual_safety_orders_count;
  return (
    <div className="tooltip">
      <h4>{label}</h4>
      <p>
        <strong>Bot: </strong>
        {bot_name}
      </p>
      <p>
        <strong>SO: </strong>
        {`${totalSOs} / ${max_safety_orders}`}
      </p>
      <p>
        <strong>Bought Volume: </strong>
        {formatter(payload[0].value)}
        {` (${formatPercent(bought_volume, max_deal_funds)})`}
      </p>
      <p>
        <strong>SO Volume Remaining: </strong>
        {formatter(payload[1].value)}
        {` (${formatPercent(so_volume_remaining, max_deal_funds)})`}
      </p>
    </div>
  );
};

const DealSoUtilizationBar: React.FC<ActiveDealChartsType> = ({ data = [], defaultCurrency }) => {
  let localData = [...data];

  const renderChart = () => {
    if (localData.length === 0) {
      return (<NoData />);
    }
    localData = localData.sort(dynamicSort('-bought_volume'));

    return (
      <ResponsiveContainer width="100%" height="90%" minHeight="300px">
        <BarChart
          // width={500}
          data={localData}
          stackOffset="expand"
          maxBarSize={50}
          barGap={1}
        >
          <Legend />
          <CartesianGrid opacity={0.3} vertical={false} />

          {/* TODO - pass the custom props down properly here.  */}
          <Tooltip
            content={(
              // @ts-ignore
              <CustomTooltip
                formatter={
                  (value: any) => currencyTooltipFormatter(value, defaultCurrency)
                }
              />
            )}
            cursor={{ strokeDasharray: '3 3', opacity: 0.2 }}
          />
          <XAxis
            dataKey="pair"
            angle={(localData.length > 20) ? 90 : 45}
            textAnchor="start"
            dx={5}
            // // dx={15}
            // dy={10}
            fontSize=".75em"
            minTickGap={-200}
            axisLine={false}
            height={75}
          />
          <YAxis tickFormatter={(tick) => `${parseNumber(tick * 100, 0)}%`} />

          <Bar
            dataKey="bought_volume"
            stackId="a"
            fill="var(--chart-metric4-color)"
            opacity={1}
            name="% Bought Volume"
          />
          <Bar
            dataKey="so_volume_remaining"
            stackId="a"
            fill="var(--chart-metric3-color)"
            opacity={0.4}
            name="% SO Volume Remaining"
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="boxData stat-chart ">
      <h3 className="chartTitle">Deal Max Utilization</h3>
      {renderChart()}
    </div>
  );
};

export default DealSoUtilizationBar;