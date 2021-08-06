import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis } from 'recharts';
import { InputLabel, MenuItem, FormControl, Select, FormHelperText } from '@material-ui/core';

import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts'
import { Type_Query_PerfArray } from '@/types/3Commas';
import { parseNumber } from '@/utils/number_formatting';
import NoData from '@/app/Components/Pages/Stats/Components/NoData';
import { dynamicSort } from '@/utils/helperFunctions';

const colors = ["#cfe1f2", "#b5d4e9", "#93c3df", "#6daed5", "#4b97c9", "#2f7ebc", "#1864aa", "#0a4a90", "#08306b"]



/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */
const DealPerformanceBubble = ({ title, data }: Type_DealPerformanceCharts) => {
    const [sort, setSort] = React.useState('total_profit');

    const handleChange = (event: any) => {
        setSort(event.target.value);
    };

    const getPosition = (data:Type_Query_PerfArray[] , metric:string) => {
        data = data.sort(dynamicSort(metric))

        const length = data.length

        return data.map((entry, index) => {

            // @ts-ignore

            return <Cell key={entry.performance_id} fill={colors[  Math.round( (index / length) * ( colors.length - 1)  ) ]} />
        })

    }

    const returnCells = () => {

    }


    const renderChart = () => {
        if (data == undefined || data.length === 0) {
            return (<NoData />)
        } else {
            const newData = data
                .filter(row => row.percentTotalVolume > .9)
            // 

            console.log(newData)

            // 1. Find the metrics to filter based on
            // 2. identify what the high / low is and how to break out that metric
            // 3. push the coloring based on the answer to that.

            /**
             * - Bot stats need to come from the bots data and filter based on the bot ID. Might need to add another column to the performance metric.
             * - Downside of Take Profit is that it's only a current metric.
             */

            // metrics:
            // Take Profit
            // % of total Volume
            // % of total profit - percentTotalProfit
            // % total deals


            return (<ResponsiveContainer width="100%" height="100%" minHeight="400px">
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
                    <CartesianGrid />

                    {/* 
                        X - Average Deal Hours
                        Y - Average Hourly Profit
                        Z - Number of deals completed
                        Cell Color - Base Order Start
                    
                     */}
                    <XAxis
                        type="number"
                        dataKey="averageDealHours"
                        height={50}
                        name="Avg. Deal Hours"
                        tickCount={9}
                        domain={[0, (dataMax: number) => Math.round(dataMax / 10) * 10]}

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
                            dx={-30}
                        />

                    </YAxis>
                    {/* Range is lowest number and highest number. */}
                    <ZAxis type="number" dataKey="number_of_deals" range={[0, Math.max(...newData.map(deal => deal.number_of_deals))]} name="# of Deals Completed" />


                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        // @ts-ignore
                        // TODOD - pass props properly to the custom tool tip
                        content={<CustomTooltip />}
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
    }

    return (
        <div className="boxData stat-chart">
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


function CustomTooltip({ active, payload, label }: Type_Tooltip) {
    if (active) {

        const { total_profit, bot_name, pair, averageHourlyProfitPercent, averageDealHours, number_of_deals } = payload[0].payload
        return (
            <div className="tooltop">
                <h4>{pair}</h4>
                <p><strong>Bot:</strong> {bot_name}</p>
                <p><strong>Total Profit:</strong> ${parseNumber(total_profit)}</p>
                <p><strong>Average Deal Hours:</strong> {averageDealHours.toFixed(2)}</p>
                <p><strong>Average Hourly Profit Percent:</strong> {averageHourlyProfitPercent.toFixed(8)}%</p>
                <p><strong># of Deals:</strong>{number_of_deals}</p>

            </div>
        )
    } else {
        return null
    }
}


export default DealPerformanceBubble;