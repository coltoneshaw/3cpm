import React, { useEffect, useState, useLayoutEffect } from 'react';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { ProfitArray } from '@/types/3CommasApi';
import { getLang, removeDuplicatesInArray } from '@/utils/helperFunctions';

import { yAxisWidth, currencyTickFormatter, currencyTooltipFormatter } from '@/app/Components/Charts/formatting';
import NoData from '@/app/Pages/Stats/Components/NoData';

import { ProfitArrayChart, TooltipType } from '@/types/Charts';
import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

const lang = getLang();

interface TypeNewDateProfit {
  date: string
  profit: number
  type: string
  utc_date: string
}

const convertToNewDates = (data: ProfitArray[], langString: any, type: string) => {
  const mappedArray = data.map((day) => ({
    converted_date: new Date(day.utc_date).toLocaleString(lang, langString),
    utc_date: day.utc_date,
    profit: day.profit,
  }));
  let primaryDates = Array.from(
    new Set(
      mappedArray.map((day) => ({
        converted_date: day.converted_date,
        utc_date: day.utc_date,
      })),
    ),
  );
  primaryDates = removeDuplicatesInArray(primaryDates, 'converted_date');

  return primaryDates.map((date) => {
    const filteredDate = mappedArray.filter((y) => y.converted_date === date.converted_date);
    return {
      converted_date: date.converted_date,
      utc_date: date.utc_date,
      profit: filteredDate.map((y) => y.profit).reduce((sum, profit) => sum + profit),
      type,
    };
  });
};

const CustomTooltip: React.FC<TooltipType<number, string>> = ({ active, payload, formatter }) => {
  if (!active || !payload || !payload[0]?.payload) return null;
  const data: TypeNewDateProfit = payload[0].payload;
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    date, profit, type, utc_date,
  } = data;

  let newDate = date;
  if (type === 'day') {
    newDate = new Date(utc_date).toLocaleString(getLang(), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return (
    <div className="tooltip">
      <h4>{newDate}</h4>
      <p>{formatter(profit)}</p>
    </div>
  );
};

const ProfitByDay: React.FC<ProfitArrayChart> = ({ data = [], X, defaultCurrency }) => {
  const defaultSort = 'day';

  // pull in the currency
  // need to make a formula that takes the number of decimals from the currency * 10 to return the width of the data.

  const yWidth = yAxisWidth(defaultCurrency);

  const localStorageSortName = storageItem.charts.ProfitByDay.sort;

  const [dateType, setDateType] = useState(defaultSort);
  const [filterString, setFilterString] = useState<{}>({ month: '2-digit', day: '2-digit', year: '2-digit' });

  useEffect(() => {
    if (dateType === 'year') {
      setFilterString({ year: 'numeric' });
    } else if (dateType === 'month') {
      setFilterString({ month: 'short', year: 'numeric' });
    } else {
      setFilterString({ month: '2-digit', day: '2-digit', year: '2-digit' });
    }
  }, [dateType]);

  useLayoutEffect(() => {
    const getSortFromStorage = getStorageItem(localStorageSortName);
    setDateType((getSortFromStorage !== undefined) ? getSortFromStorage : defaultSort);
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedSort = (event.target.value !== undefined) ? event.target.value as string : defaultSort;
    setDateType(selectedSort);
    setStorageItem(localStorageSortName, selectedSort);
  };

  const filterDropdown = () => (
    <FormControl>
      <Select
        variant="standard"
        value={dateType}
        onChange={handleChange}
        style={{
          fontWeight: 300,
          fontSize: '1.17em !important',
        }}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="day">Day</MenuItem>
        <MenuItem value="month">Month</MenuItem>
        <MenuItem value="year">Year</MenuItem>
      </Select>
    </FormControl>
  );

  const renderChart = () => {
    if (!data || data.length === 0) return <NoData />;
    const filteredData = convertToNewDates(data, filterString, dateType);
    const calculateAverage = () => {
      const totalProfit = (filteredData.length > 0)
        ? filteredData
          .map((deal) => deal.profit)
          .reduce((sum, profit) => sum + profit)
        : 0;
      return currencyTickFormatter(totalProfit / filteredData.length, defaultCurrency);
    };
    return (
      <ResponsiveContainer width="100%" height="100%" minHeight="300px">
        <BarChart
          data={filteredData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}

        >

          <CartesianGrid opacity={0.3} vertical={false} />
          <XAxis
            dataKey="converted_date"
            axisLine={false}
            tickLine={false}
            minTickGap={(filteredData.length > 6) ? 40 : 0}
            tickFormatter={(str) => {
              if (str === 'auto' || str === undefined) return '';
              if (dateType === 'day' || dateType === 'year' || dateType === 'month') {
                return str;
              }
              return '';
            }}
          />

          <ReferenceLine
            y={calculateAverage()}
            stroke="var(--color-primary-light25)"
            strokeWidth={2}
            isFront
            label={{ value: calculateAverage(), position: 'left' }}
          />
          <YAxis
            dataKey={X}
            tickLine={false}
            axisLine={false}
            width={yWidth}
            type="number"
            tickFormatter={(value: any) => {
              const tick = currencyTickFormatter(value, defaultCurrency);
              const average = calculateAverage();
              if (average > tick * 0.75 && tick * 1.25 > average) return '';
              return tick;
            }}

          />

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
          <Bar type="monotone" dataKey={X} fill="var(--chart-metric1-color)" />
        </BarChart>

      </ResponsiveContainer>
    );
  };
  return (
    <div className="boxData stat-chart">
      <h3 className="chartTitle">
        Profit by
        {' '}
        {filterDropdown()}
        {' '}
      </h3>
      {renderChart()}

    </div>
  );
};

export default ProfitByDay;
