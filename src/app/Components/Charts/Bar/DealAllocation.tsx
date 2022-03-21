import React from 'react';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { parseNumber } from '@/utils/numberFormatting';
import type { TooltipType, DealPerformanceChartsType } from '@/types/Charts';
import { dynamicSort } from '@/utils/helperFunctions';
import { currencyTooltipFormatter } from '@/app/Components/Charts/formatting';

import NoData from '@/app/Pages/Stats/Components/NoData';

const CustomTooltip: React.FC<TooltipType<number, string>> = ({ active, payload, formatter }) => {
  if (!active || !payload || !payload[0]?.payload) return null;

  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    total_profit, bot_name, pair, percentTotalVolume, percentTotalProfit, bought_volume,
  } = payload[0].payload;
  return (
    <div className="tooltip">
      <h4>{pair}</h4>
      <p>
        <strong>Bot: </strong>
        {bot_name}
      </p>
      <p>
        <strong>Total Profit: </strong>
        {formatter(total_profit)}
      </p>
      <p>
        <strong>Bought Volume: </strong>
        {formatter(bought_volume)}
      </p>
      <p>
        <strong>% of Total Volume: </strong>
        {`${parseNumber(percentTotalVolume, 3)}%`}
      </p>
      <p>
        <strong>% of Total Profit: </strong>
        {`${parseNumber(percentTotalProfit, 3)}%`}
      </p>
    </div>
  );
};

const DealAllocationBar: React.FC<DealPerformanceChartsType> = ({ data = [], defaultCurrency }) => {
  let localData = [...data];
  const renderChart = () => {
    if (localData.length === 0) {
      return (<NoData />);
    }

    // removing everything over a specific percent of total volume.
    localData = localData.filter((row) => row.percentTotalVolume > 0.15)
      .sort(dynamicSort('-percentTotalProfit'));
    return (
      <ResponsiveContainer width="100%" minHeight="300px">
        <BarChart
          width={500}
          height={200}
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
                formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)}
              />
            )}
            cursor={{ strokeDasharray: '3 3', opacity: 0.2 }}
          />
          <XAxis
            dataKey="pair"
            angle={45}
            axisLine={false}
            height={75}
            textAnchor="start"
            fontSize=".75em"
            minTickGap={-200}

          />
          <YAxis
            tickFormatter={(tick) => `${tick}%`}
          />

          <Bar dataKey="percentTotalVolume" fill="var(--chart-metric1-color)" name="% Total Volume" />
          <Bar dataKey="percentTotalProfit" fill="var(--chart-metric3-color)" name="% Total Profit" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="boxData stat-chart ">
      <h3 className="chartTitle">Deal Allocation</h3>
      {renderChart()}

    </div>
  );
};

export default DealAllocationBar;
