import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis } from 'recharts';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts'
import { Type_Query_PerfArray } from '@/types/3Commas';
import { parseNumber } from '@/utils/number_formatting';
import NoData from '@/app/Pages/Stats/Components/NoData';
import { dynamicSort } from '@/utils/helperFunctions';

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';
import {currencyTooltipFormatter} from '@/app/Components/Charts/formatting'

const colors = ["#DBEAFE", "#BFDBFE", "#93C5FD", "#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A"]

const getPosition = (data: Type_Query_PerfArray[], metric: string) => {
    let localData = [...data].sort(dynamicSort(metric))

    const length = localData.length

    return localData.map((entry, index) => {
        return <Cell key={entry.performance_id} fill={colors[Math.round((index / length) * (colors.length - 1))]} opacity={.8} />
    })

}

/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */
const DealPerformanceBubble = ({ data = [], defaultCurrency }: Type_DealPerformanceCharts) => {

    const defaultSort = 'percentTotalProfit';
    const localStorageSortName = storageItem.charts.DealPerformanceBubble.sort

    const [sort, setSort] = useState(defaultSort);

    useEffect(() => {
        const getSortFromStorage = getStorageItem(localStorageSortName);
        setSort((getSortFromStorage != undefined) ? getSortFromStorage : defaultSort);
    }, [])

    const handleChange = (event: any) => {
        const selectedSort = (event.target.value != undefined) ? event.target.value : defaultSort;
        setSort(selectedSort);
        setStorageItem(localStorageSortName, selectedSort)
    };



    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData />)
        }
        let localData = [...data]
            .filter(row => row.percentTotalVolume > 1.5)

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
                    <CartesianGrid opacity={.3} />
                    <XAxis
                        type="number"
                        dataKey="averageDealHours"
                        height={50}
                        name="Avg. Deal Hours"
                        tickCount={10}

                        allowDataOverflow={true}
                    >
                        <Label value="Average Deal Hours" offset={0} position="insideBottom" />
                    </XAxis>

                    <YAxis
                        type="number"
                        dataKey="averageHourlyProfitPercent"
                        // width={100}
                        name="Avg. Hourly Profit %"
                        allowDataOverflow={true}
                    >
                        <Label value="Avg. Hourly Profit %" angle={-90}
                            dy={0}
                            dx={-35}
                        />

                    </YAxis>
                    {/* Range is lowest number and highest number. */}
                    <ZAxis
                        type="number"
                        dataKey="total_profit"

                        // TODO - Look at making this work better for currencies that are below zero.
                        // range={[ Math.floor(Math.min(...localData.map(deal => deal.total_profit))) * 4, Math.ceil(Math.max(...localData.map(deal => deal.total_profit))) * 4]}
                        name="Total Profit" />

                    {/* TODO - pass the custom props down properly here.  */}
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)} />} cursor={{ strokeDasharray: '3 3' }} />

                    <Scatter name="Deal Performance" data={localData} isAnimationActive={false}>

                        {getPosition(localData, sort)}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>)
    }

    return (
        <div className="boxData">
            <div style={{ position: "relative" }}>
                <h3 className="chartTitle">Deal Performance Scatter</h3>
                <div style={{ position: "absolute", right: 0, top: 0, height: "50px", zIndex: 5 }}>
                    <FormControl  >
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
                    </FormControl>
                </div>




            </div>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload, formatter }: Type_Tooltip) {
    if (!active || payload.length == 0 || payload[0] == undefined) {
        return null
    }

    const {
        total_profit,
        bot_name,
        pair,
        averageHourlyProfitPercent,
        averageDealHours,
        number_of_deals,
        bought_volume
    } = payload[0].payload
    return (
        <div className="tooltip">
            <h4>{pair}</h4>
            <p><strong>Bot:</strong> {bot_name}</p>
            <p><strong>Total Profit:</strong> {formatter(total_profit)}</p>
            <p><strong>Average Deal Hours:</strong> {parseNumber(averageDealHours, 2)}</p>
            <p><strong>Average Hourly Profit Percent:</strong> {parseNumber(averageHourlyProfitPercent, 8)}%</p>
            <p><strong># of Deals:</strong> {number_of_deals}</p>
            <p><strong>Bought Volume:</strong> {formatter(bought_volume)}</p>

        </div>
    )
}


export default DealPerformanceBubble;