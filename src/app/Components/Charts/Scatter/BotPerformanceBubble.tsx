import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis, LabelList } from 'recharts';

import { Type_Tooltip, Type_BotPerformanceCharts } from '@/types/Charts'
import { Type_Bot_Performance_Metrics } from '@/types/3Commas';
import { parseNumber } from '@/utils/number_formatting';
import NoData from '@/app/Components/Pages/Stats/Components/NoData';


const colors = ["#cfe1f2","#b5d4e9","#93c3df","#6daed5","#4b97c9","#2f7ebc","#1864aa","#0a4a90","#08306b"]

/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */
const BotPerformanceBubble = ({ title, data }: Type_BotPerformanceCharts) => {



    const renderChart = () => {
        if (data == undefined || data.length === 0) {
            return (<NoData />)
        } else {


            return (<ResponsiveContainer width="100%"  height="100%" minHeight="400px">

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
                    <CartesianGrid  opacity={.3}/>

                    {/* 
                        X - Average Deal Hours
                        Y - Average Hourly Profit
                        Z - Number of deals completed
                        Cell Color - Base Order Start
                    
                     */}
                    <XAxis
                        type="number"
                        dataKey="total_profit"
                        height={50}
                        name="Total Profit"
                        tickCount={9}
                        allowDataOverflow={true}
                        allowDecimals={false}


                    >
                        <Label value="Total Profit" offset={0} position="insideBottom" />
                    </XAxis>

                    <YAxis
                        type="number"
                        dataKey="avg_deal_hours"
                        name="Avg. Deal Hours"
                        allowDataOverflow={true}
                        

                    >
                        <Label value="Avg. Profit Per Deal"
                        angle={-90}
                        dy={0}
                        dx={-20}
                        />
                        </YAxis>
                    {/* Range is lowest number and highest number. */}
                    <ZAxis type="number" dataKey="number_of_deals" range={[Math.min(...data.map(deal => deal.number_of_deals)) + 200,  Math.max(...data.map(deal => deal.number_of_deals)) + 200]} name="# of Deals Completed" />


                    
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

                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]}  />
                            ))
                        }
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>)
        }
    }

    return (
        <div className="boxData" >
            <h3 className="chartTitle">{title}</h3>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload, label }:Type_Tooltip) {
    if (active) {

        const data: Type_Bot_Performance_Metrics = payload[0].payload
        const { total_profit, bot_name, avg_completed_so, avg_profit, avg_deal_hours, bought_volume, number_of_deals, bot_id} = data
        return (
            <div className="tooltop">
                <h4>{bot_name}</h4>
                <p><strong>Total Profit:</strong> ${parseNumber(total_profit)}</p>
                <p><strong>Average Deal Hours:</strong> {avg_deal_hours.toFixed(2)}</p>
                <p><strong># of Deals:</strong> {number_of_deals}</p>
                <p><strong>Bought Volume:</strong>{ parseNumber(bought_volume) }</p>

            </div>
        )
    } else {
        return null
    }
}


export default BotPerformanceBubble;