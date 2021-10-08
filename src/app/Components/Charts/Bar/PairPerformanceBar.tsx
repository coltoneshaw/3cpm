import React, { useState, useEffect, useLayoutEffect } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Scatter, Legend, ResponsiveContainer, Line, Label } from 'recharts';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import NoData from '@/app/Pages/Stats/Components/NoData';

import { Type_Pair_Performance_Metrics } from '@/types/3Commas';
import { Type_Tooltip, Type_Pair_Performance } from '@/types/Charts';

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';
import { parseNumber } from '@/utils/number_formatting';
import { dynamicSort } from '@/utils/helperFunctions';
import { filterData } from '@/app/Components/Charts/formatting'
import { currencyTickFormatter, currencyTooltipFormatter } from '@/app/Components/Charts/formatting'

const defaultFilter = 'all';
const defaultSort = '-total_profit';


const usePerformanceSortAndFilter = (name: 'PairPerformanceBar' | 'BotPerformanceBar') => {
    const localStorageFilterName = storageItem.charts[name].filter
    const localStorageSortName = storageItem.charts[name].sort

    const [sort, setSort] = useState(defaultSort);
    const [filter, setFilter] = useState(defaultFilter);
    const [metricsDisplayed, updatedMetricsDisplayed] = useState(() => ({ 'total_profit': false, 'bought_volume': false, 'avg_deal_hours': false }))


    useLayoutEffect(() => {
        // const getFilterFromStorage = getStorageItem(localStorageFilterName);
        // setFilter((getFilterFromStorage != undefined) ? getFilterFromStorage : defaultFilter);

        setFilter(defaultFilter);
        const getSortFromStorage = getStorageItem(localStorageSortName);
        setSort((getSortFromStorage != undefined) ? getSortFromStorage : defaultSort);
    }, [])


    const handleSortChange = (event: any) => {
        const selectedSort = (event.target.value != undefined) ? event.target.value : defaultSort;
        setSort(selectedSort);
        setStorageItem(localStorageSortName, selectedSort)
    };

    const handleFilterChange = (event: any) => {
        const selectedFilter = (event.target.value != undefined) ? event.target.value : defaultFilter;
        setFilter(selectedFilter);
        setStorageItem(localStorageFilterName, selectedFilter)
    };

    return {
        sort: {
            handleSortChange,
            sort,
        },
        filter: {
            handleFilterChange,
            filter
        },
        metrics: {
            metricsDisplayed,
            updatedMetricsDisplayed
        }
    }
}

const PairPerformanceBar = ({ data = [], defaultCurrency }: Type_Pair_Performance) => {

    const {sort: {sort, handleSortChange}, filter: {filter, handleFilterChange}, metrics: {metricsDisplayed, updatedMetricsDisplayed}} = usePerformanceSortAndFilter('PairPerformanceBar')


    const [localData, updateLocalData] = useState<any[]>(() => data)
    const [chartHeight, updateChartHeight] = useState<number>(300)
    const [newData, updateNewData] = useState<any[]>([])
    useEffect(() => {
        if (data && data != []) updateLocalData(data)
    }, [data])   

    // useLayoutEffect here works only for the bot perf bar. Runs into rerender issues with pair performance
    useEffect(() => {
        if (data && data != []) updateNewData(() => {
            const newData = filterData(localData, filter).sort(dynamicSort(sort))
            updateChartHeight((newData.length * 15) + 250)
            return newData
        })
    }, [filter, sort, localData])

    return (
        <div className="boxData stat-chart ">
            <div style={{ position: "relative" }}>
                <h3 className="chartTitle">Pair Performance</h3>
                <div style={{ position: "absolute", right: 0, top: 0, height: "50px", zIndex: 5 }}>
                    <FormControl  >
                        <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                        <Select
                            variant="standard"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={sort}
                            onChange={handleSortChange}
                            style={{ width: "150px" }}
                        >
                            <MenuItem value="-total_profit">Profit</MenuItem>
                            <MenuItem value="-bought_volume">Bought Volume</MenuItem>
                            <MenuItem value="-avg_deal_hours">Avg. Deal Hours</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{ position: "absolute", left: 0, top: 0, height: "50px", zIndex: 5 }}>
                    <FormControl  >
                        <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
                        <Select
                            variant="standard"
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            onChange={handleFilterChange}
                            style={{ width: "150px" }}
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
            <ResponsiveContainer width="100%" height="100%" maxHeight={chartHeight} minHeight={chartHeight}>
                <ComposedChart

                    data={(newData.length > 0) ? newData : undefined}
                    margin={{
                        top: 40,
                        right: 0,
                        left: 0,
                        bottom: 5,
                    }}
                    layout="vertical"
                    stackOffset="expand"
                    maxBarSize={50}
                    barGap={1}
                >
                    <Legend
                        verticalAlign="top"
                        height={50}
                        style={{
                            cursor: 'pointer',
                            margin: '1em'
                        }}

                        onClick={(e) => {
                            updatedMetricsDisplayed(prevState => {
                                const newState = { ...prevState }
                                newState[e.dataKey as keyof typeof prevState] = !newState[e.dataKey as keyof typeof prevState]
                                return newState
                            })

                        }}
                    />
                    <CartesianGrid opacity={.3} vertical={true} horizontal={false} />

                    {/* TODO - pass the custom props down properly here.  */}
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)} />} cursor={{ strokeDasharray: '3 3' }} />
                    <YAxis
                        dataKey="pair"
                        type="category"
                        textAnchor="end"
                        fontSize=".75em"
                        minTickGap={-50}
                        axisLine={false}
                        width={60}

                    />
                    <XAxis
                        xAxisId="total_profit"
                        type="number"
                        hide={"-total_profit" != sort}
                        domain={[0, 'auto']}
                        allowDataOverflow={true}
                        offset={20}
                        height={50}
                        allowDecimals={true}
                        tickCount={4}
                        label={{
                            value: "Total Profit",
                            position: "Bottom",
                            dx: 0,
                            dy: 20
                        }}
                        tickFormatter={(value: any) => currencyTickFormatter(value, defaultCurrency)}
                    />

                    <XAxis
                        xAxisId="avg_deal_hours"
                        type="number"
                        hide={"-avg_deal_hours" != sort}
                        domain={[0, 'auto']}
                        allowDataOverflow={true}
                        height={50}
                        allowDecimals={false}
                        tickCount={6}
                        label={{
                            value: "Avg. Deal Hours",
                            position: "Bottom",
                            dx: 0,
                            dy: 20
                        }}
                    />
                    <XAxis
                        xAxisId="bought_volume"
                        type="number"
                        hide={"-bought_volume" != sort}
                        domain={[0, 'auto']}
                        allowDataOverflow={true}
                        height={50}
                        allowDecimals={true}
                        tickCount={4}
                        label={{
                            value: "Bought Volume",
                            position: "Bottom",
                            dx: 0,
                            dy: 20
                        }}
                    />

                    <Bar name="Total Profit" dataKey="total_profit" fill="var(--chart-metric2-color)" xAxisId="total_profit" fillOpacity={.8} hide={metricsDisplayed.total_profit} />
                    <Scatter name="Bought Volume" xAxisId="bought_volume" dataKey="bought_volume" fillOpacity={.9} fill="var(--chart-metric1-color)" hide={metricsDisplayed.bought_volume} />
                    <Scatter name="Avg. Deal Hours" dataKey="avg_deal_hours" fill="var(--chart-metric6-color)" xAxisId="avg_deal_hours" hide={metricsDisplayed.avg_deal_hours} />

                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}


function CustomTooltip({ active, payload, formatter }: Type_Tooltip) {
    if (!active || !payload || payload[0] == undefined) {
        return null
    }
    const data: Type_Pair_Performance_Metrics = payload[0].payload
    const { total_profit, pair, avg_deal_hours, bought_volume, number_of_deals } = data
    return (
        <div className="tooltip">
            <h4>{pair}</h4>
            <p><strong>Bought Volume:</strong> {formatter(bought_volume)} </p>
            <p><strong>Deal Count:</strong> {number_of_deals} </p>
            <p><strong>Total Profit:</strong> {formatter(total_profit)} </p>
            <p><strong>Avg Deal Hours:</strong> {parseNumber(avg_deal_hours)} </p>
        </div>
    )
}

export default PairPerformanceBar;