import React, { useEffect, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis } from 'recharts';
import { InputLabel, MenuItem, FormControl, Select} from '@material-ui/core';

import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts'
import { Type_Query_PerfArray } from '@/types/3Commas';
import { parseNumber } from '@/utils/number_formatting';
import NoData from '@/app/Pages/Stats/Components/NoData';
import { dynamicSort } from '@/utils/helperFunctions';

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

const colors = ["#cfe1f2", "#b5d4e9", "#93c3df", "#6daed5", "#4b97c9", "#2f7ebc", "#1864aa", "#0a4a90", "#08306b"]


/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */
const DealPerformanceBubble = ({ title, data = [] }: Type_DealPerformanceCharts) => {

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


    const getPosition = (data: Type_Query_PerfArray[], metric: string) => {
        data = data.sort(dynamicSort(metric))

        const length = data.length

        return data.map((entry, index) => {

            // @ts-ignore

            return <Cell key={entry.performance_id} fill={colors[Math.round((index / length) * (colors.length - 1))]} opacity={.8}/>
        })

    }


    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData/>)
        }
        const newData = data
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
                    <CartesianGrid opacity={.3}/>
                    <XAxis
                        type="number"
                        dataKey="averageDealHours"
                        height={50}
                        name="Avg. Deal Hours"
                        tickCount={10}

                        allowDataOverflow={true}
                    >
                        <Label value="Average Deal Hours" offset={0} position="insideBottom"/>
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
                               dx={-30}
                        />

                    </YAxis>
                    {/* Range is lowest number and highest number. */}
                    <ZAxis
                        type="number"
                        dataKey="total_profit"
                        range={[
                            Math.min(...newData.map(deal => deal.total_profit)) * 4,
                            Math.max(...newData.map(deal => deal.total_profit)) * 4
                        ]}
                        name="Bought Volume"/>


                    <Tooltip
                        cursor={{strokeDasharray: '3 3'}}
                        // @ts-ignore

                        // TODOD - pass props properly to the custom tool tip
                        content={<CustomTooltip/>}
                    />
                    <Scatter name="Deal Performance" data={newData} isAnimationActive={false}>
                        {/* <LabelList dataKey="pair" /> */}

                        {
                            getPosition(newData, sort)
                        }
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>)
    }

    return (
        <div className="boxData">
            <div style={{ position: "relative" }}>
                <h3 className="chartTitle">{title}</h3>
                <div style={{ position: "absolute", right: 0, top: 0, height: "50px", zIndex: 5 }}>
                    <FormControl  >
                        <InputLabel id="demo-simple-select-label">Color By</InputLabel>
                        <Select
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


function CustomTooltip({ active, payload}: Type_Tooltip) {
    if (!active) {
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
            <p><strong>Total Profit:</strong> ${parseNumber(total_profit)}</p>
            <p><strong>Average Deal Hours:</strong> {parseNumber(averageDealHours, 2)}</p>
            <p><strong>Average Hourly Profit Percent:</strong> {parseNumber(averageHourlyProfitPercent, 8)}%</p>
            <p><strong># of Deals:</strong>{number_of_deals}</p>
            <p><strong>Bought Volume:</strong>{parseNumber(bought_volume)}</p>

        </div>
    )
}


export default DealPerformanceBubble;