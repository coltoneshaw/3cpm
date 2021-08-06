import React, { PureComponent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NoData from '@/app/Components/Pages/Stats/Components/NoData';

import { parseNumber, formatPercent } from '@/utils/number_formatting';

import { Type_Tooltip, Type_SoDistribution } from '@/types/Charts';

const legendFind = (value: string) => {
    if (value == "bought_volume") return "Bought Volume"
    return "SO Volume Remaining"
}

interface Type_SoDistributionArray {
    SO: number
    percentOfDeals: number
    percentOfVolume: number
    volume: number
    numberOfDeals: number
}

const SoDistribution = ({ title, data, metrics }: Type_SoDistribution) => {

    let dataArray: Type_SoDistributionArray[] = []


    if (data.length > 0) {
        const MaxSO = Math.max(...data.map(deal => deal.completed_safety_orders_count))
        const soNumbers = Array.from(Array(MaxSO + 1).keys())
        const totalDeals = data.length
        const totalDealFunds = metrics.totalBoughtVolume

        dataArray = soNumbers.map(SO => {
            let matchingDeals = data.filter(deal => deal.completed_safety_orders_count === SO)
            let volume = (matchingDeals.length > 0) ? matchingDeals.map(deal => deal.bought_volume).reduce((sum, item) => sum + item) : 0
            let numberOfDeals = matchingDeals.length

            return {
                SO,
                'percentOfDeals': (numberOfDeals / totalDeals),
                'percentOfVolume': (volume / totalDealFunds),
                volume,
                numberOfDeals
            }

        })
    }
    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData />)
        } else {
            return (<ResponsiveContainer width="100%"  height="90%" minHeight="400px">
                <BarChart
                    width={500}
                    height={200}
                    data={dataArray}
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
                        // @ts-ignore - tooltip refactoring
                        // todo - improve how tooltops can pass the values.
                        content={<CustomTooltip />}
                    />
                    <XAxis dataKey="SO"
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


                    <Bar dataKey="percentOfDeals" fill="#8884d8" />
                    <Bar dataKey="percentOfVolume" fill="#82ca9d" />
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

        const { percentOfDeals, percentOfVolume, volume, numberOfDeals } = payload[0].payload
        return (
            <div className="tooltop">
                <h4>SO # {label}</h4>
                <p><strong>Bought Volume:</strong> ${parseNumber(volume)} ( {(percentOfVolume * 100).toFixed(2)} %)</p>
                <p><strong>Deal Count:</strong> {numberOfDeals} ( {(percentOfDeals * 100).toFixed(2)} %)</p>
            </div>
        )
    } else {
        return null
    }
}

export default SoDistribution;