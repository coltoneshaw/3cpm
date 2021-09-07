import React from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import NoData from '@/app/Pages/Stats/Components/NoData';

import { getLang } from '@/utils/helperFunctions';

const lang = getLang()
import { parseNumber } from '@/utils/number_formatting';

import { Type_ProfitChart, Type_Tooltip } from '@/types/Charts';



const SummaryProfitByDay = ({ data = [], X }: Type_ProfitChart) => {

    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData />)
        }

        return (
        <ResponsiveContainer width="100%" height="100%" minHeight="300px" >
            <AreaChart
                width={500}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}

            >
                <CartesianGrid opacity={.3} vertical={false} />
                <XAxis
                    dataKey="utc_date"
                    axisLine={false}
                    tickLine={false}
                    minTickGap={50}
                    tickFormatter={(str) => {
                        if (str == 'auto') return ""
                        return new Date(str).toLocaleDateString(lang, { month: '2-digit', day: '2-digit' })

                    }}
                />
                <YAxis
                    dataKey={X}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={tick => parseNumber(tick, 0)}
                    tickCount={9}
                    // TODO - Need to look at passing in a tick array that contains the values rounded to 100s.
                    type="number"
                    allowDecimals={false}
                    domain={[0, (dataMax: number) =>  Math.ceil(dataMax / 100 ) * 100]}
                />

                <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    // @ts-ignore
                    content={<CustomTooltip />}
                />
                <defs>
                    <linearGradient id="gradiant" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={20} stopColor="var(--color-secondary-light87)" stopOpacity={1} />
                        <stop offset={0} stopColor="var(--color-secondary-light25)" stopOpacity={1} />
                    </linearGradient>
                </defs>
                <Area type="monotone" dataKey={X} stroke="var(--color-secondary)" strokeWidth={1.75} fill="url(#gradiant)" />
            </AreaChart>

        </ResponsiveContainer>)
    }


    return (
        <div className="boxData stat-chart">
            <h3 className="chartTitle">Cumulative profit by day </h3>
            {renderChart()}

        </div>
    )
}

const CustomTooltip = ({ active , payload = [], label }:Type_Tooltip) => {

    if (!active || payload.length == 0 || payload[0] == undefined) {
        return <></>
    }

    label = new Date(label).toLocaleString(getLang(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

    return (
        <div className="tooltip">
            <h4>{label}</h4>
            <p>$ {parseNumber( payload[0].value, 2) }</p>
        </div>
    )

}

export default SummaryProfitByDay;




