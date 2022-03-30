import React from 'react';
import {
  InputLabel, MenuItem, FormControl, Select,
} from '@mui/material';
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter,
} from 'recharts';

import type { BotPerformanceMetrics } from '@/types/DatabaseQueries';
import type { TooltipType, BotPerformanceChartsType } from '@/types/Charts';

import { parseNumber } from '@/utils/numberFormatting';
import { currencyTickFormatter, currencyTooltipFormatter } from '@/webapp/Components/Charts/formatting';
import { usePerformanceSortAndFilter, useLocalDataWithHeight } from './Components/barCustomState';

const defaultSortAndFilter = {
  total_profit: false,
  bought_volume: false,
  avg_deal_hours: false,
  avg_profit: false,
};

const CustomTooltip: React.FC<TooltipType<number, string>> = ({ active, payload, formatter }) => {
  if (!active || !payload || payload[0] === undefined) return null;

  const data: BotPerformanceMetrics = payload[0].payload;
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    total_profit, avg_deal_hours, bought_volume, number_of_deals, bot_name, type, avg_profit,
  } = data;
  return (
    <div className="tooltip">
      <h4>{bot_name}</h4>
      <p>{type}</p>
      <p>
        <strong>Bought volume: </strong>
        {formatter(bought_volume)}
      </p>
      <p>
        <strong>Deal count: </strong>
        {number_of_deals}
      </p>
      <p>
        <strong>Avg profit per deal: </strong>
        {formatter(avg_profit)}
      </p>
      <p>
        <strong>Total Profit: </strong>
        {formatter(total_profit)}
      </p>
      <p>
        <strong>Avg deal hours: </strong>
        {parseNumber(avg_deal_hours, 2)}
      </p>
    </div>
  );
};
const BotPerformanceBar: React.FC<BotPerformanceChartsType> = ({ data = [], defaultCurrency }) => {
  const {
    sort: { sort, handleSortChange },
    filter: { filter, handleFilterChange },
    metrics: { metricsDisplayed, updatedMetricsDisplayed },
  } = usePerformanceSortAndFilter('BotPerformanceBar', defaultSortAndFilter);
  const { chartHeight, newData } = useLocalDataWithHeight(data, filter, sort);

  return (
    <div className="boxData stat-chart  ">
      <div style={{ position: 'relative' }}>
        <h3 className="chartTitle">Bot Performance</h3>
        <div style={{
          position: 'absolute', right: 0, top: 0, height: '50px', zIndex: 5,
        }}
        >
          <FormControl>
            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
            <Select
              variant="standard"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sort}
              onChange={handleSortChange}
              style={{ width: '150px' }}
            >
              <MenuItem value="-total_profit">Profit</MenuItem>
              <MenuItem value="-bought_volume">Bought Volume</MenuItem>
              <MenuItem value="-avg_deal_hours">Avg. Deal Hours</MenuItem>
              <MenuItem value="-avg_profit">Avg. Profit</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div style={{
          position: 'absolute', left: 0, top: 0, height: '50px', zIndex: 5,
        }}
        >
          <FormControl>
            <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
            <Select
              variant="standard"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              onChange={handleFilterChange}
              style={{ width: '150px' }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="top20">Top 20%</MenuItem>
              <MenuItem value="top50">Top 50%</MenuItem>
              <MenuItem value="bottom50">Bottom 50%</MenuItem>
              <MenuItem value="bottom20">Bottom 20%</MenuItem>
            </Select>
          </FormControl>
        </div>

      </div>
      <ResponsiveContainer width="100%" height={chartHeight}>

        <ComposedChart
          data={newData ?? undefined}
          margin={{
            top: 40,
            right: 0,
            left: 0,
            bottom: 5,
          }}
          layout="vertical"
          // stackOffset="expand"
          maxBarSize={30}
          barGap={1}
        >
          <Legend
            verticalAlign="top"
            height={50}
            style={{
              cursor: 'pointer',
              margin: '1em',
            }}
            onClick={(e) => {
              updatedMetricsDisplayed((prevState) => {
                const newState = { ...prevState };
                newState[e.dataKey as keyof typeof prevState] = !newState[e.dataKey as keyof typeof prevState];
                return newState;
              });
            }}
          />
          <CartesianGrid opacity={0.3} vertical horizontal={false} />

          {/* TODO - pass the custom props down properly here.  */}
          <Tooltip
            content={(
              // @ts-ignore
              <CustomTooltip
                formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)}
              />
            )}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <YAxis
            dataKey="bot_name"
            type="category"
            axisLine={false}
            width={140}
            textAnchor="end"
            tickFormatter={(str) => ((str.length > 14) ? `${str.slice(0, 11)}...` : str)}
            fontSize=".75em"
            minTickGap={-30}
          />
          <XAxis
            xAxisId="total_profit"
            type="number"
            hide={sort !== '-total_profit'}
            domain={[0, 'auto']}
            allowDataOverflow
            height={50}
            allowDecimals
            label={{
              value: 'Total Profit',
              position: 'Bottom',
              dx: 0,
              dy: 20,
            }}
            tickCount={4}
            tickFormatter={(value: any) => currencyTickFormatter(value, defaultCurrency)}
          />
          <XAxis
            xAxisId="avg_deal_hours"
            type="number"
            hide={sort !== '-avg_deal_hours'}
            domain={[0, 'auto']}
            allowDataOverflow
            height={50}
            allowDecimals={false}
            label={{
              value: 'Avg. Deal Hours',
              position: 'Bottom',
              dx: 0,
              dy: 20,
            }}
            tickCount={6}
          />
          <XAxis
            xAxisId="bought_volume"
            type="number"
            hide={sort !== '-bought_volume'}
            domain={[0, 'auto']}
            allowDataOverflow
            height={50}
            allowDecimals
            tickFormatter={(value: any) => currencyTickFormatter(value, defaultCurrency)}
            tickCount={4}
            label={{
              value: 'Bought Volume',
              position: 'Bottom',
              dx: 0,
              dy: 20,
            }}

          />
          <XAxis
            xAxisId="avg_profit"
            type="number"
            hide={sort !== '-avg_profit'}
            domain={[0, 'auto']}
            allowDataOverflow
            height={50}
            allowDecimals={false}
            tickCount={4}
            label={{
              value: 'Avg profit per deal',
              position: 'Bottom',
              dx: 0,
              dy: 20,
            }}
          />

          <Bar
            name="Total Profit"
            dataKey="total_profit"
            fill="var(--chart-metric2-color)"
            xAxisId="total_profit"
            fillOpacity={0.8}
            hide={metricsDisplayed.total_profit}
          />
          <Scatter
            name="Bought Volume"
            xAxisId="bought_volume"
            dataKey="bought_volume"
            fillOpacity={0.9}
            fill="var(--chart-metric1-color)"
            hide={metricsDisplayed.bought_volume}
          />
          <Scatter
            name="Avg. Deal Hours"
            dataKey="avg_deal_hours"
            fill="var(--chart-metric6-color)"
            xAxisId="avg_deal_hours"
            hide={metricsDisplayed.avg_deal_hours}
          />
          <Scatter
            name="Avg. Profit"
            dataKey="avg_profit"
            fill="var(--chart-metric4-color)"
            xAxisId="avg_profit"
            hide={metricsDisplayed.avg_profit}
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BotPerformanceBar;
