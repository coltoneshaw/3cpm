import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NoData from '@/app/Pages/Stats/Components/NoData';

import { parseNumber} from '@/utils/number_formatting';

import { Type_Tooltip, Type_SoDistribution } from '@/types/Charts';


interface Type_SoDistributionArray {
    SO: number
    percentOfDeals: number
    percentOfVolume: number
    volume: number
    numberOfDeals: number
}

const SoDistribution = ({ title, data = [], metrics }: Type_SoDistribution) => {

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
            return (<NoData/>)
        }
        return (
            <ResponsiveContainer width="100%" height="90%" minHeight="300px">
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
                    <Legend/>
                    <CartesianGrid opacity={.3} vertical={false}/>
                    <Tooltip
                        // @ts-ignore - tooltip refactoring
                        // todo - improve how tooltips can pass the values.
                        content={<CustomTooltip/>}
                    />
                    <XAxis
                        dataKey="SO"
                        minTickGap={-200}
                        axisLine={false}
                    />

                    <YAxis
                        tickFormatter={tick => tick * 100 + "%"}
                    />


                    <Bar dataKey="percentOfDeals" fill="var(--color-primary)" name='% of deals'/>
                    <Bar dataKey="percentOfVolume" fill="var(--color-secondary-light25)" name='% of volume'/>

                </BarChart>
            </ResponsiveContainer>)
    }

    return (
        <div className="boxData stat-chart " >
            <h3 className="chartTitle">{title}</h3>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload, label }: Type_Tooltip) {
    if (!active || payload.length == 0 || payload[0] == undefined) {
        return null
    }

    const {percentOfDeals, percentOfVolume, volume, numberOfDeals} = payload[0].payload
    return (
        <div className="tooltip">
            <h4>SO # {label}</h4>
            <p><strong>Bought Volume:</strong> ${parseNumber(volume)} ( {parseNumber((percentOfVolume * 100), 2)} %)
            </p>
            <p><strong>Deal Count:</strong> {numberOfDeals} ( {parseNumber((percentOfDeals * 100), 2)} %)</p>
        </div>
    )
}

export default SoDistribution;