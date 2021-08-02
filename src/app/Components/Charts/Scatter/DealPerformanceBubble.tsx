import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis, LabelList } from 'recharts';

import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts'
import { parseNumber } from '@/utils/number_formatting';
import NoData from '@/app/Components/Pages/Stats/Components/NoData';

const colors = ["#43bdd1"]


/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */
const DealPerformanceBubble = ({ title, data }: Type_DealPerformanceCharts) => {


    data = data.filter(row => row.percentTotalVolume > .15)

    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData />)
        } else {
            return (<ResponsiveContainer width="100%" aspect={3}>
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
                        domain={[ (dataMin:number ) => (0 - Math.abs(dataMin)).toFixed(0), 10]}
                        allowDataOverflow={true}
                    >
                        <Label value="Average Deal Hours" offset={0} position="insideBottom" />
                    </XAxis>

                    <YAxis
                        type="number"
                        dataKey="averageHourlyProfitPercent"
                        width={100}
                        name="Avg. Hourly Profit %"

                    >
                        <Label value="Avg. Hourly Profit %" angle={-90} offset={0} position='center' />

                    </YAxis>
                    {/* Range is lowest number and highest number. */}
                    <ZAxis type="number" dataKey="number_of_deals" range={[0, Math.max(...data.map(deal => deal.total_profit))]} name="# of Deals Completed" />


                    
                    <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        // @ts-ignore
                        // TODOD - pass props properly to the custom tool tip
                        content={<CustomTooltip />} 
                        />
                    <Scatter name="Deal Performance" data={data} >
                        {/* <LabelList dataKey="pair" /> */}

                        {
                            data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[0]} />
                            ))
                        }
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>)
        }
    }

    return (
        <div className="boxData" style={{ 'margin': '25px' }}>
            <h3 className="chartTitle">{title}</h3>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload, label }:Type_Tooltip) {
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