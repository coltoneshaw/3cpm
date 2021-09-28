import React from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatPercent } from '@/utils/number_formatting';
import { dynamicSort } from '@/utils/helperFunctions';

import NoData from '@/app/Pages/Stats/Components/NoData';
import {currencyTooltipFormatter} from '@/app/Components/Charts/formatting'

import type { Type_ActiveDeals } from '@/types/3Commas';
import type { Type_Tooltip, Type_ActiveDealCharts} from '@/types/Charts';



const DealSoUtilizationBar = ({ data = [], defaultCurrency }: Type_ActiveDealCharts) => {
    let localData = [...data]

    const renderChart = () => {
        if (localData.length === 0) {
            return (<NoData/>)
        }
        localData = localData.sort(dynamicSort("-bought_volume"))

        return (
            <ResponsiveContainer width="100%" height="90%" minHeight="300px">
                <BarChart
                    // width={500}
                    data={localData}
                    stackOffset="expand"
                    maxBarSize={50}
                    barGap={1}
                >
                    <Legend/>
                    <CartesianGrid opacity={.3} vertical={false}/>

                    {/* TODO - pass the custom props down properly here.  */}
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip formatter={(value:any) => currencyTooltipFormatter(value, defaultCurrency)} />} cursor={{strokeDasharray: '3 3', opacity: .2}}/>
                    <XAxis
                        dataKey="pair"
                        angle={45}
                        dx={10}
                        // dx={15}
                        dy={10}
                        fontSize=".75em"
                        minTickGap={-200}
                        axisLine={false}
                        height={75}

                    />
                    <YAxis tickFormatter={tick => tick * 100 + "%"} />


                    <Bar dataKey="bought_volume" stackId="a" fill="var(--chart-metric3-color)" opacity={.8} name="% Bought Volume"/>
                    <Bar dataKey="so_volume_remaining" stackId="a" fill="var(--chart-metric1-color)" opacity={.9} name="% SO Volume Remaining"/>
                </BarChart>
            </ResponsiveContainer>)
    }

    return (
        <div className="boxData stat-chart " >
            <h3 className="chartTitle">Deal Max Utilization</h3>
            {renderChart()}
        </div>
    )
}



function CustomTooltip({ active, payload, label, formatter }: Type_Tooltip) {
    if (!active || !payload ||  payload[0] == undefined) {
        return null
    }

    const deal:Type_ActiveDeals = payload[0].payload

    const {bought_volume, so_volume_remaining, max_deal_funds, bot_name, completed_safety_orders_count, completed_manual_safety_orders_count, max_safety_orders } = deal
    return (
        <div className="tooltip">
            <h4>{label}</h4>
            <p><strong>Bot:</strong> {bot_name}</p>
            <p><strong>SO:</strong> {completed_safety_orders_count + completed_manual_safety_orders_count } / {max_safety_orders}</p>
            <p><strong>Bought Volume:</strong> {formatter(payload[0].value)} ( {formatPercent(bought_volume, max_deal_funds)} ) </p>
            <p><strong>SO Volume Remaining:</strong> {formatter(payload[1].value)} ( {formatPercent(so_volume_remaining, max_deal_funds)} )</p>
        </div>
    )
}

export default DealSoUtilizationBar;