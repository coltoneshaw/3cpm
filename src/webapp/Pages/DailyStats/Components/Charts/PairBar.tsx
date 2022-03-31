import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import NoData from 'webapp/Pages/Stats/Components/NoData';
import { currencyTickFormatter, currencyTooltipFormatter } from 'webapp/Components/Charts/formatting';

import type { DefaultCurrency } from 'types/config';

import type { TooltipType } from 'types/Charts';
import type { QueryDealByPairByDayReturn, BotQueryDealByDayReturn } from '../3Commas/type_dailydashboard';
import { dynamicSort } from 'common/utils/helperFunctions';

type Params = {
  data: QueryDealByPairByDayReturn[] | BotQueryDealByDayReturn[]
  defaultCurrency: DefaultCurrency,
  metric: 'top' | 'bottom',
  type: 'pair' | 'bot_name'
};

const CustomTooltip = ({
  active, payload, label, formatter,
}: TooltipType<number, string>) => {
  if (!active || !payload || payload[0]?.payload) return null;

  const { totalProfit, numberOfDeals }: QueryDealByPairByDayReturn = payload[0].payload;
  return (
    <div className="tooltip">
      <h4>{label}</h4>
      <p>
        <strong>Total Profit: </strong>
        {formatter(totalProfit)}
      </p>
      <p>
        <strong>Deal Count: </strong>
        {numberOfDeals}
      </p>
    </div>
  );
};

const dataFilter = (data: Params['data'] = []) => [...data]
  .sort(dynamicSort('-totalProfit'))
  .filter((p, index) => index < 5);

const PairBar = (params: Params) => {
  const { data = [], defaultCurrency, type } = params;

  if (!data || data.length === 0) return <NoData />;
  return (
    <ResponsiveContainer width="100%" height="90%" minHeight="300px">
      <BarChart
        width={500}
        height={200}
        data={dataFilter(data)}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
        stackOffset="expand"
        maxBarSize={50}
        barGap={1}
      >
        <Legend />
        <CartesianGrid opacity={0.3} vertical={false} />

        <Tooltip
          content={(
            <CustomTooltip
              formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)}
            />
          )}
          cursor={{ strokeDasharray: '3 3', opacity: 0.2 }}
        />
        <XAxis
          dataKey={type}
          minTickGap={-200}
          axisLine={false}
          angle={45}
          height={75}
          textAnchor="start"
          fontSize=".75em"
        />

        <YAxis tickFormatter={(value: any) => currencyTickFormatter(value, defaultCurrency)} />

        <Bar dataKey="totalProfit" fill="var(--chart-metric1-color)" name="Total Profit" />
        <Bar dataKey="numberOfDeals" fill="var(--chart-metric3-color)" name="# of Deals" />

      </BarChart>
    </ResponsiveContainer>
  );
};

export default PairBar;
