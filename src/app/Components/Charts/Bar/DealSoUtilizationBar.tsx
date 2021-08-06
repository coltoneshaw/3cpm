import React, { PureComponent } from 'react';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseNumber, formatPercent } from '@/utils/number_formatting';
import { Type_Tooltip, Type_ActiveDealCharts } from '@/types/Charts';

import NoData from '@/app/Components/Pages/Stats/Components/NoData';

const legendFind = ( value:string ) => {
    if (value == "bought_volume") return "Bought Volume"
    return "SO Volume Remaining"
}


const DealSoUtilizationBar = ({title, data }: Type_ActiveDealCharts) => {


        const renderChart = () => {
            if (data.length === 0) {
                return (<NoData />)
            } else {
                return (<ResponsiveContainer width="100%" height="90%" minHeight="400px">
                <BarChart
                    // width={500}
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
                        // @ts-ignore - Pass tooltip props down properly.
                        content={<CustomTooltip />}
                    />
                    <XAxis dataKey="pair"
                        angle={45}
                        dx={15}
                        dy={20}
                        minTickGap={-200}
                        axisLine={false}
                        height={75}
                    />
                    <YAxis
                        tickFormatter={tick => tick * 100 + "%"}

                    />
                    
                    
                    <Bar dataKey="bought_volume" stackId="a" fill="#8884d8" />
                    <Bar dataKey="so_volume_remaining" stackId="a" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>)
            }
        }

        return (
            <div className="boxData stat-chart bubble-chart" >
                <h3 className="chartTitle">{title}</h3>
                {renderChart()}
            </div>
        )
    }



function CustomTooltip({ active, payload, label }: Type_Tooltip) {
    if (active) {

        const { bought_volume, so_volume_remaining, max_deal_funds, bot_name } = payload[0].payload
        return (
            <div className="tooltop">
                <h4>{label}</h4>
                <p><strong>Bot:</strong> {bot_name}</p>
                <p><strong>Bought Volume:</strong> ${parseNumber(payload[0].value)} ( {formatPercent(bought_volume, max_deal_funds)} )</p>
                <p><strong>SO Volume Remaining:</strong> ${parseNumber(payload[1].value)} ( {formatPercent(so_volume_remaining, max_deal_funds)} )</p>
            </div>
        )
    } else {
        return null
    }
}

export default DealSoUtilizationBar;