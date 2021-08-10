import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseNumber, formatPercent } from '@/utils/number_formatting';
import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts'
import { dynamicSort } from '@/utils/helperFunctions';

import NoData from '@/app/Components/Pages/Stats/Components/NoData';

const legendFind = ( value:string ) => {
    if (value == "bought_volume") return "Bought Volume"
    return "SO Volume Remaining"
}

const DealAllocationBar = ( {title, data}: Type_DealPerformanceCharts) => {

        const renderChart = () => {

            if (data == undefined || data.length === 0) {
                return (<NoData />)
            } else {

                // removing everything over a specific percent of total volume.
                data = data.filter( row => row.percentTotalVolume > .15)
                    .sort(dynamicSort("percentTotalProfit"))
                return (
                    <ResponsiveContainer width="100%" minHeight="400px">
                        <BarChart
                            width={500}
                            height={200}
                            data={data}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                            stackOffset="expand"
                        >
                            <Legend
                                formatter={value => legendFind(value)}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip
                                // @ts-ignore - handle props
                                // TODO - typescript - properly handle the props being passed
                                content={<CustomTooltip />}
                            />
                            <XAxis 
                                dataKey="pair"
                                angle={45}
                                axisLine={false}
                                height={75}
                                textAnchor="start"
                                fontSize=".75em"
                                minTickGap={-200}

                            />
                            <YAxis
                                tickFormatter={tick => tick + "%"}
                            />
    
    
                            <Bar dataKey="percentTotalVolume" fill="#8884d8" />
                            <Bar dataKey="percentTotalProfit" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>)
            }
        }




        return (
            <div className="boxData stat-chart bubble-chart">
                <h3 className="chartTitle">{title}</h3>
                {renderChart()}

            </div>
        )
}

function CustomTooltip({ active, payload, label }:Type_Tooltip) {
    if (active) {

        const { total_profit, bot_name, pair, percentTotalVolume, percentTotalProfit, bought_volume } = payload[0].payload
        return (
            <div className="tooltop">
                <h4>{pair}</h4>
                <p><strong>Bot:</strong> {bot_name}</p>
                <p><strong>Total Profit:</strong> ${parseNumber(total_profit)}</p>
                <p><strong>Bought Volume:</strong> ${parseNumber(bought_volume)}</p>
                <p><strong>% of Total Volume:</strong> {percentTotalVolume.toFixed(2)}%</p>
                <p><strong>% of Total Profit:</strong> {percentTotalProfit.toFixed(3)}%</p>

            </div>
        )
    } else {
        return null
    }
}

export default DealAllocationBar;