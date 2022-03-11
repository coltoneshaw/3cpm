import React, { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis,
} from 'recharts';
import {
  InputLabel, MenuItem, FormControl, Select,
} from '@mui/material';

import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts';
import { QueryPerformanceArray } from '@/types/3Commas';
import { parseNumber } from '@/utils/numberFormatting';
import NoData from '@/app/Pages/Stats/Components/NoData';
import { dynamicSort } from '@/utils/helperFunctions';

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';
import { currencyTooltipFormatter } from '@/app/Components/Charts/formatting';

const colors = ['#DBEAFE', '#BFDBFE', '#93C5FD', '#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'];

const getPosition = (data: QueryPerformanceArray[], metric: string) => {
  const localData = [...data].sort(dynamicSort(metric));

  const { length } = localData;

  return localData.map((entry, index) => <Cell key={entry.performance_id} fill={colors[Math.round((index / length) * (colors.length - 1))]} opacity={0.8} />);
};

const filterData = (data: QueryPerformanceArray[], filter: String) => {
  let localData = [...data].sort(dynamicSort('-total_profit'));
  const { length } = localData;
  const fiftyPercent = length / 2;
  const twentyPercent = length / 5;

  if (filter === 'top20') {
    localData = localData.sort(dynamicSort('-total_profit'));
    return localData.filter((deal, index) => index < twentyPercent);
  } if (filter === 'top50') {
    localData = localData.sort(dynamicSort('-total_profit'));
    return localData.filter((deal, index) => index < fiftyPercent);
  } if (filter === 'bottom50') {
    localData = localData.sort(dynamicSort('total_profit'));
    return localData.filter((deal, index) => index < fiftyPercent);
  } if (filter === 'bottom20') {
    localData = localData.sort(dynamicSort('total_profit'));
    return localData.filter((deal, index) => index < twentyPercent);
  }
  return localData;
};

const defaultFilter = 'all';
const defaultSort = 'percentTotalProfit';

/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */
const DealPerformanceBubble = ({ data = [], defaultCurrency }: Type_DealPerformanceCharts) => {
  const { filter: storedFilter, sort: storedSort } = storageItem.charts.DealPerformanceBubble;

  // const [sort, setSort] = useState(defaultSort);

  const [filter, setFilter] = useState(defaultFilter);

  useEffect(() => {
    const getFilterFromStorage = getStorageItem(storedFilter);
    setFilter((getFilterFromStorage != undefined) ? getFilterFromStorage : defaultFilter);

    // const getSortFromStorage = getStorageItem(storedSort);
    // setSort((getSortFromStorage != undefined) ? getSortFromStorage : defaultSort);
  }, []);

  // const handleChange = (event: any) => {
  //     const selectedSort = (event.target.value != undefined) ? event.target.value : defaultSort;
  //     setSort(selectedSort);
  //     setStorageItem(storedSort, selectedSort)
  // };

  const handleChange = (event: any) => {
    const selectedFilter = (event.target.value != undefined) ? event.target.value : defaultFilter;
    setFilter(selectedFilter);
    setStorageItem(storedFilter, selectedFilter);
  };

  const renderChart = () => {
    if (data.length === 0) {
      return (<NoData />);
    }
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
          <XAxis
            type="number"
            dataKey="averageDealHours"
            height={50}
            name="Avg. Deal Hours"
            tickCount={10}

            allowDataOverflow
          >
            <Label value="Average Deal Hours" offset={0} position="insideBottom" />
          </XAxis>

          <YAxis
            type="number"
            dataKey="averageHourlyProfitPercent"
            // width={100}
            name="Avg. Hourly Profit %"
            allowDataOverflow
          />

          {/* Range is lowest number and highest number. */}
          <ZAxis
            type="number"
            dataKey="total_profit"

            // TODO - Look at making this work better for currencies that are below zero.
            // range={[ Math.floor(Math.min(...localData.map(deal => deal.total_profit))) * 4, Math.ceil(Math.max(...localData.map(deal => deal.total_profit))) * 4]}
            name="Total Profit"
          />

          {/* TODO - pass the custom props down properly here.  */}
          {/* @ts-ignore */}
          <Tooltip content={<CustomTooltip formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)} />} cursor={{ strokeDasharray: '3 3' }} />

          <Scatter name="Deal Performance" data={localData} isAnimationActive={false}>

            {getPosition(localData, defaultSort)}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="boxData" style={{ position: 'relative' }}>
      <p style={{
        position: 'absolute', left: '-2.5em', top: '45%', margin: 0, transform: 'rotate(-90deg)',
      }}
      >
        Avg. Hourly Profit %
      </p>

      <div style={{ position: 'relative' }}>
        <h3 className="chartTitle">Deal Performance Scatter</h3>
        <div style={{
          position: 'absolute', right: 0, top: 0, height: '50px', zIndex: 5,
        }}
        >
          {/* <FormControl  >
                        <InputLabel id="demo-simple-select-label">Color By</InputLabel>
                        <Select
                            variant="standard"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sort}
                            onChange={handleChange}
                            style={{ width: "150px" }}
                        >
                            <MenuItem value="percentTotalProfit">Profit</MenuItem>
                            <MenuItem value="percentTotalVolume">Bought Volume</MenuItem>
                            <MenuItem value="number_of_deals">Total # of Deals</MenuItem>
                        </Select>
                    </FormControl> */}
          <FormControl>
            <InputLabel>Filter By</InputLabel>
            <Select
              variant="standard"
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

var CustomTooltip = ({ active, payload, formatter }: Type_Tooltip) => {
  if (!active || payload.length == 0 || payload[0] == undefined) {
    return null;
  }

  const {
    total_profit,
    bot_name,
    pair,
    averageHourlyProfitPercent,
    averageDealHours,
    number_of_deals,
    bought_volume,
  } = payload[0].payload;
  return (
    <div className="tooltip">
      <h4>{pair}</h4>
      <p>
        <strong>Bot:</strong>
        {' '}
        {bot_name}
      </p>
      <p>
        <strong>Total Profit:</strong>
        {' '}
        {formatter(total_profit)}
      </p>
      <p>
        <strong>Average Deal Hours:</strong>
        {' '}
        {parseNumber(averageDealHours, 2)}
      </p>
      <p>
        <strong>Average Hourly Profit Percent:</strong>
        {' '}
        {parseNumber(averageHourlyProfitPercent, 8)}
        %
      </p>
      <p>
        <strong># of Deals:</strong>
        {' '}
        {number_of_deals}
      </p>
      <p>
        <strong>Bought Volume:</strong>
        {' '}
        {formatter(bought_volume)}
      </p>

    </div>
  );
};

export default DealPerformanceBubble;
