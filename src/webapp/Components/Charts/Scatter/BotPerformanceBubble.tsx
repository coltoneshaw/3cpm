import React, { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis,
} from 'recharts';
import {
  InputLabel, MenuItem, FormControl, Select,
} from '@mui/material';

import { currencyTooltipFormatter, yAxisWidth, currencyTickFormatter } from '@/webapp/Components/Charts/formatting';

import { TooltipType, BotPerformanceChartsType } from '@/types/Charts';
import { BotPerformanceMetrics } from '@/types/DatabaseQueries';
import { parseNumber } from '@/utils/numberFormatting';
import NoData from '@/webapp/Pages/Stats/Components/NoData';

import { dynamicSort } from '@/utils/helperFunctions';

import { setStorageItem, getStorageItem, storageItem } from '@/webapp/Features/LocalStorage/LocalStorage';

const colors = ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'];

const filterData = (data: BotPerformanceMetrics[], filter: String) => {
  let localData = [...data].sort(dynamicSort('-total_profit'));
  const { length } = localData;
  const fiftyPercent = length / 2;
  const twentyPercent = length / 5;

  if (filter === 'top20') {
    localData = localData.sort(dynamicSort('-total_profit'));
    return localData.filter((bot, index) => index < twentyPercent);
  } if (filter === 'top50') {
    localData = localData.sort(dynamicSort('-total_profit'));
    return localData.filter((bot, index) => index < fiftyPercent);
  } if (filter === 'bottom50') {
    localData = localData.sort(dynamicSort('total_profit'));
    return localData.filter((bot, index) => index < fiftyPercent);
  } if (filter === 'bottom20') {
    localData = localData.sort(dynamicSort('total_profit'));
    return localData.filter((bot, index) => index < twentyPercent);
  }
  return localData;
};

const CustomTooltip: React.FC<TooltipType<number, string>> = ({ active, payload, formatter }) => {
  if (!active || !payload || !payload[0]?.payload) return null;

  const data: BotPerformanceMetrics = payload[0].payload;
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    total_profit, bot_name, avg_deal_hours, bought_volume, number_of_deals,
  } = data;
  return (
    <div className="tooltip">
      <h4>{bot_name}</h4>
      <p>
        <strong>Total Profit: </strong>
        {formatter(total_profit)}
      </p>
      <p>
        <strong>Average Deal Hours: </strong>
        {parseNumber(avg_deal_hours, 2)}
      </p>
      <p>
        <strong># of Deals: </strong>
        {number_of_deals}
      </p>
      <p>
        <strong>Bought Volume: </strong>
        {formatter(bought_volume)}
      </p>

    </div>
  );
};

const getPosition = (localData: BotPerformanceMetrics[]) => localData
  .map((entry, index) => (
    <Cell
      key={entry.bot_id}
      fill={colors[index % colors.length]}
      opacity={0.8}
    />
  ));
const defaultFilter = 'all';
const localStorageFilterName = storageItem.charts.BotPerformanceBubble.filter;

const BotPerformanceBubble: React.FC<BotPerformanceChartsType> = ({ data = [], defaultCurrency }) => {
  const yWidth = yAxisWidth(defaultCurrency);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const getFilterFromStorage = getStorageItem(localStorageFilterName);
    setFilter((getFilterFromStorage) || defaultFilter);
  }, []);

  const handleChange = (event: any) => {
    const selectedFilter = (event.target.value !== undefined) ? event.target.value : defaultFilter;
    setFilter(selectedFilter);
    setStorageItem(localStorageFilterName, selectedFilter);
  };

  const renderChart = () => {
    if (!data) return (<NoData />);

    // sort this by the index
    const localData = filterData([...data], filter);

    return (
      <ResponsiveContainer width="100%" height="100%" minHeight="400px">

        <ScatterChart
          width={400}
          height={400}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid opacity={0.3} />

          {/*
                        X - Average Deal Hours
                        Y - Average Hourly Profit
                        Z - Number of deals completed
                        Cell Color - Base Order Start

                     */}
          <XAxis
            type="number"
            dataKey="avg_deal_hours"
            height={50}
            name="Avg Deal Hours"
            tickCount={9}
            allowDataOverflow={false}
            allowDecimals={false}
          >
            <Label value="Avg. Deal Hours" offset={0} position="insideBottom" />
          </XAxis>

          <YAxis
            type="number"
            dataKey="total_profit"
            name="Total Profit"
            allowDataOverflow={false}
            allowDecimals
            width={yWidth}
            tickFormatter={(value: any) => currencyTickFormatter(value, defaultCurrency)}
          />

          {/* Range is lowest number and highest number. */}
          <ZAxis
            type="number"
            dataKey="number_of_deals"
            range={[
              Math.min(...localData.map((deal) => deal.number_of_deals)) + 200,
              Math.max(...localData.map((deal) => deal.number_of_deals)) + 200,
            ]}
            name="# of Deals Completed"
          />

          {/* TODO - pass the custom props down properly here.  */}
          <Tooltip
            content={(
              <CustomTooltip
                formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)}
              />
            )}
            cursor={{ strokeDasharray: '3 3' }}
          />
          <Scatter name="Deal Performance" data={localData}>
            {getPosition(localData)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="boxData" style={{ position: 'relative' }}>
      <p style={{
        position: 'absolute', left: '-1.5em', top: '45%', margin: 0, transform: 'rotate(-90deg)',
      }}
      >
        Total Profit
      </p>

      <div style={{ position: 'relative' }}>
        <h3 className="chartTitle">Bot Performance Scatter</h3>
        <div style={{
          position: 'absolute', right: 0, top: 0, height: '50px', zIndex: 5,
        }}
        >
          <FormControl>
            <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
            <Select
              variant="standard"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filter}
              onChange={handleChange}
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
      {renderChart()}
    </div>
  );
};

export default BotPerformanceBubble;
