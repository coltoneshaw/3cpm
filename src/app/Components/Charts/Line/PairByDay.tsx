import React, { useEffect, useState } from 'react';
import moment from 'moment';
import {
  ComposedChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line,
} from 'recharts';

import type { TooltipType } from '@/types/Charts';

import PairSelector from './Components/PairSelector';

import { useAppSelector } from '@/app/redux/hooks';
import { getLang } from '@/utils/helperFunctions';
import { yAxisWidth, currencyTickFormatter, currencyTooltipFormatter } from '@/app/Components/Charts/formatting';

import { getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

import type { defaultCurrency, Type_Profile } from '@/types/config';
import type { DateRange } from '@/types/Date';

import { getSelectPairDataByDate, getFiltersQueryString } from '@/app/Features/3Commas/3Commas';

const lang = getLang();

const colors = [
  'var(--chart-metric1-color)',
  'var(--chart-metric2-color)',
  'var(--chart-metric3-color)',
  'var(--chart-metric4-color)',
  'var(--chart-metric5-color)',
  'var(--chart-metric6-color)',
  'var(--chart-metric7-color)',
  'var(--chart-metric8-color)',
];

interface PairByDate {
  date: string
  pair: string
}

// TODO - should be moved to the redux state.
const getPairList = async (
  updatePairs: Function,
  updatePairFilters: Function,
  wheres: string,
  currentProfile: Type_Profile,
) => {
  const filtersQueryString = await getFiltersQueryString(currentProfile);
  const { currencyString, accountIdString, currentProfileID } = filtersQueryString;

  // selecting the pair data and sorting by profit for easier viewing.

  window.ThreeCPM.Repository.Database.query(
    currentProfileID,
    `SELECT pair, sum(actual_profit) as total_profit FROM deals 
WHERE ${wheres} AND from_currency in (${currencyString}) AND account_id in (${accountIdString}) 
Group By pair order by total_profit DESC;`,
  )
    .then((result: { pair: string }[]) => {
      updatePairs(result.map((pair) => ({ pair: pair.pair, opacity: 1 })));
      let storedPairs = getStorageItem(storageItem.charts.pairByDateFilter);
      if (!storedPairs) {
        storedPairs = result.map((pair) => pair.pair).filter((pair, index) => index < 2);
      }
      updatePairFilters(storedPairs);
    });
};

interface TTProps extends TooltipType<number, string> {
  formatter: (value: any, defaultCurrency?: defaultCurrency) => string
}

const CustomTooltip = ({
  active, payload, label, formatter,
}: TTProps) => {
  if (!active || !payload || !payload[0]?.payload) return null;

  const returnPairData = () => {
    const pairs = { ...payload[0].payload };
    delete pairs.date;

    if (pairs === {}) return '';

    return Object.keys(pairs).map((pair) => (
      <p>
        <strong>{pair}</strong>
        {' '}
        - Profit:
        {' '}
        {formatter(pairs[pair])}
      </p>
    ));
  };

  const date = new Date(label).toLocaleString(getLang(), {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="tooltip">
      <h4>{date}</h4>
      {returnPairData()}
    </div>
  );
};
type PairPerfByDateType = {
  datePair: DateRange,
  defaultCurrency: defaultCurrency
};

const PairPerformanceByDate: React.FC<PairPerfByDateType> = ({ datePair, defaultCurrency }) => {
  const { currentProfile } = useAppSelector((state) => state.config);
  const [localData, updateLocalData] = useState<PairByDate[]>([]);
  const [pairs, updatePairs] = useState<{ pair: string, opacity: number }[]>([]);
  const [pairFilters, updatePairFilters] = useState<string[]>([]);

  const yWidth = yAxisWidth(defaultCurrency);
  useEffect(() => {
    let from = '';
    let to = '';

    if (datePair.from !== null) {
      const fromDate = moment.utc(datePair.from)
        .subtract(datePair.from.getTimezoneOffset(), 'minutes')
        .startOf('day')
        .toISOString();

      from = `closed_at >= '${fromDate}'`;
    }

    if (datePair.to !== null) {
      const toDate = moment.utc(datePair.to)
        .subtract(datePair.to.getTimezoneOffset(), 'minutes')
        .add(1, 'days')
        .startOf('day')
        .toISOString();

      to = `closed_at < '${toDate}'`;
    }

    const wheres = ['1=1', from, to].filter((value) => value.length > 0).join(' and ');

    getPairList(updatePairs, updatePairFilters, wheres, currentProfile);
  }, [datePair, currentProfile]);

  useEffect(() => {
    getSelectPairDataByDate(currentProfile, pairFilters, datePair)
      .then((data) => {
        if (!data) return;
        updateLocalData(data);
      });
  }, [pairFilters, datePair]);

  return (

    <div className="boxData stat-chart ">
      <div style={{ position: 'relative' }}>
        <h3 className="chartTitle">Pair by Date</h3>
        <PairSelector pairFilters={pairFilters} updatePairFilters={updatePairFilters} pairs={pairs} />

      </div>

      <ResponsiveContainer width="100%" height="100%" minHeight="300px">
        <ComposedChart
          width={500}
          height={300}
          data={localData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >

          <CartesianGrid opacity={0.3} vertical={false} />
          <Legend
            verticalAlign="top"
            height={36}
            onMouseEnter={(e) => {
              updatePairs((prevState) => prevState.map((p) => ({
                ...p,
                opacity: (p.pair !== e.payload.dataKey) ? 0.2 : 1,
              })));
            }}
            onMouseLeave={() => {
              updatePairs((prevState) => prevState.map((p) => ({
                ...p,
                opacity: 1,
              })));
            }}
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            minTickGap={(localData.length > 6) ? 40 : 0}
            tickFormatter={(str) => {
              if (str === 'auto' || str === undefined) return '';
              return new Date(str).toLocaleString(lang, { month: '2-digit', day: '2-digit', timeZone: 'UTC' });
            }}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tickCount={6}
            type="number"
            name="Profit"
            width={yWidth}
            allowDecimals
            tickFormatter={(value: any) => currencyTickFormatter(value, defaultCurrency)}
          />

          {/* TODO - pass the custom props down properly here.  */}
          <Tooltip
            content={(
              <CustomTooltip
                formatter={
                  (value: any) => currencyTooltipFormatter(value, defaultCurrency)
                }
              />
            )}
            cursor={{ strokeDasharray: '3 3' }}
          />

          {pairFilters.map((pair, index) => {
            const filteredPair = pairs.find((p) => p.pair === pair);

            const opacity = (filteredPair !== undefined && filteredPair.opacity !== undefined)
              ? filteredPair.opacity
              : 1;
            return (
              <Line
                name={pair}
                type="monotone"
                dataKey={pair}
                stroke={colors[index]}
                dot={false}
                strokeWidth={1.75}
                opacity={opacity}
              />
            );
          })}

        </ComposedChart>

      </ResponsiveContainer>
    </div>
  );
};

export default PairPerformanceByDate;
