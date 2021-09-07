import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseNumber} from '@/utils/number_formatting';
import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts'
import { dynamicSort } from '@/utils/helperFunctions';

import NoData from '@/app/Pages/Stats/Components/NoData';


const DealAllocationBar = ( {title, data = []}: Type_DealPerformanceCharts) => {

        const renderChart = () => {

            if (data.length === 0) {
                return (<NoData />)
            }

            // removing everything over a specific percent of total volume.
            data = data.filter( row => row.percentTotalVolume > .15)
                .sort(dynamicSort("-percentTotalProfit"))
            return (
                <ResponsiveContainer width="100%" minHeight="300px">
                    <BarChart
                        width={500}
                        height={200}
                        data={data}

                        stackOffset="expand"
                    >
                        <Legend />
                        <CartesianGrid  opacity={.3} vertical={false}/>
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


                        <Bar dataKey="percentTotalVolume" fill="var(--color-secondary-light25)" name="% Total Volume" />
                        <Bar dataKey="percentTotalProfit" fill="var(--color-primary)" name="% Total Profit" />
                    </BarChart>
                </ResponsiveContainer>)
        }




        return (
            <div className="boxData stat-chart ">
                <h3 className="chartTitle">{title}</h3>
                {renderChart()}

            </div>
        )
}

function CustomTooltip({ active, payload}:Type_Tooltip) {
    if (!active) {
        return null
    }

    const {total_profit, bot_name, pair, percentTotalVolume, percentTotalProfit, bought_volume} = payload[0].payload
    return (
        <div className="tooltip">
            <h4>{pair}</h4>
            <p><strong>Bot:</strong> {bot_name}</p>
            <p><strong>Total Profit:</strong> ${parseNumber(total_profit, 2)}</p>
            <p><strong>Bought Volume:</strong> ${parseNumber(bought_volume, 0)}</p>
            <p><strong>% of Total Volume:</strong> {parseNumber(percentTotalVolume, 3)}%</p>
            <p><strong>% of Total Profit:</strong> {parseNumber(percentTotalProfit, 3)}%</p>

        </div>
    )
}

export default DealAllocationBar;