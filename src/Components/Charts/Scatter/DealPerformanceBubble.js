import React, { PureComponent } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis, LabelList } from 'recharts';
import { scaleLog } from 'd3-scale';
const scale = scaleLog().base(Math.E);
// const data = [
//     { x: 100, y: 200, z: 200 },
//     { x: 120, y: 100, z: 260 },
//     { x: 170, y: 300, z: 400 },
//     { x: 140, y: 250, z: 280 },
//     { x: 150, y: 400, z: 500 },
//     { x: 110, y: 280, z: 200 },
// ];

const colors = ["#43bdd1"]

const minMax = (array) => {
    const min = Math.min(...array)
    const max = Math.max(...array)
    console.log(min, max)
    return [
        min,
        max
    ]
}

/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */
export default class DealPerformanceBubble extends PureComponent {

    render() {
        

        let { title, performanceData } = this.props

        performanceData = performanceData.filter( row => row.percentTotalVolume > .15)

        return (
            <div className="boxData" style={{ 'margin': '25px' }}>
                <h3 className="chartTitle">{title}</h3>
                <ResponsiveContainer width="100%" aspect={3}>
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
                            domain={[dataMin => (0 - Math.abs(dataMin)).toFixed(0), 10]}
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
                        <ZAxis type="number" dataKey="number_of_deals" range={[0, Math.max(...performanceData.map(deal => deal.total_profit )) ]} name="score" name="# of Deals Completed"/>


                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />}/>
                        <Scatter name="Deal Performance" data={performanceData} >
                        {/* <LabelList dataKey="pair" /> */}

                            {
                                performanceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colors[0]} />
                                ))
                            }
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

function CustomTooltip({ active, payload, label }) {
    if (active) {

        const { total_profit, bot_name, pair, averageHourlyProfitPercent, averageDealHours, number_of_deals  } = payload[0].payload
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

const parseNumber = (number) => {
    if (number) {
        return number.toLocaleString(undefined, { 'minimumFractionDigits': 0, 'maximumFractionDigits': 0 })
    }
    return number
}