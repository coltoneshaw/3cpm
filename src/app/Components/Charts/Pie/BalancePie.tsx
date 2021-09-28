
import React from 'react';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { currencyTooltipFormatter } from '../formatting';

//types
import type { Type_Tooltip } from '@/types/Charts'
import type { Type_MetricData } from '@/types/3Commas';
import type { defaultCurrency } from '@/types/config';


const COLORS = ['var(--color-primary-light25)', 'var(--color-secondary-light25)', 'var(--color-CTA)', '#FF8042'];

interface Type_PieMetrics {
    title: string
    metrics: Type_MetricData
    defaultCurrency: defaultCurrency
}
const BalancePie = ({ title, metrics, defaultCurrency }: Type_PieMetrics) => {


    const { availableBankroll, totalBoughtVolume, on_orders, totalBankroll } = metrics
    const chartData = [{
        name: 'Available',
        metric: availableBankroll,
        percent: (availableBankroll / totalBankroll) * 100,
        key: 1
    },
    {
        name: 'Limit Orders',
        metric: on_orders,
        percent: (on_orders / totalBankroll) * 100,
        key: 2
    },
    {
        name: "Purchased",
        metric: totalBoughtVolume,
        percent: (totalBoughtVolume / totalBankroll) * 100,
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
                            style={{ outline: 'none' }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke='none' />
                            ))}
                        </Pie>
                        <Legend verticalAlign="bottom" height={36} />
                        {/* TODO - pass the custom props down properly here.  */}
                        {/* @ts-ignore */}
                        <Tooltip content={<CustomTooltip formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)} />}/>
                    </PieChart>
                </ResponsiveContainer>


            </div>

        </div>

    )

}




function CustomTooltip({ active, payload, formatter }: Type_Tooltip) {
    if (!active || payload.length == 0 || payload[0] == undefined) {
        return null
    }

    const { name, metric, percent } = payload[0].payload
    return (
        <div className="tooltip">
            <h4>{name}</h4>
            <p>{formatter(metric)}</p>
            <p>{(percent) ? percent.toFixed(2) : 0}%</p>
        </div>
    )
}

export default BalancePie;