
import React, { PureComponent } from 'react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { parseNumber } from '@/utils/number_formatting';
import { Type_Tooltip, Type_DealPerformanceCharts } from '@/types/Charts'
import { Type_MetricData, Type_BalanceData } from '@/types/3Commas';


const COLORS = ['var(--color-primary)', 'var(--color-secondary-light25)', 'var(--color-CTA)', '#FF8042'];

interface Type_PieMetrics {
    title: string
    metrics: Type_MetricData
}
const BalancePie = ({ title, metrics }:Type_PieMetrics) => {


    const { availableBankroll, position, totalBoughtVolume, on_orders } = metrics
    const chartData = [{
        name: 'Available',
        metric: availableBankroll,
        key: 1
    },
    {
        name: 'Limit Orders',
        metric: on_orders,
        key: 2
    },
    {
        name: "Purchased",
        metric: totalBoughtVolume,
        key: 3
    }

    ]

    return (
        <div className="boxData" style={{
            height: '250px',
            minWidth: '300px',
            maxWidth: '300px'
        }}>
            <div style={{
                width: '300px',
                height: '250px'
            }}>
                <h3 className="chartTitle" >{title}</h3>


                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={300}>
                        <Pie
                            data={chartData} dataKey="metric" cx="50%" cy="50%" outerRadius={85}
                            style={{outline: 'none'}}
                            >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke='none'/>
                            ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                        <Tooltip
                            // @ts-ignore
                            // TODO - pass custom props properly to tool tips
                            content={<CustomTooltip />}
                        />
                    </PieChart>
                </ResponsiveContainer>


            </div>

        </div>

    )

}




function CustomTooltip({ active, payload }: Type_Tooltip) {
    if (active) {
        const { name, value } = payload[0]
        return (
            <div className="tooltip">
                <h4>{name}</h4>
                <p>${parseNumber(value)}</p>
            </div>
        )
    } else {
        return null
    }
}

export default BalancePie;