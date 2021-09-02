import React, { PureComponent } from 'react';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseNumber, formatPercent } from '@/utils/number_formatting';
import { Type_Tooltip, Type_ActiveDealCharts } from '@/types/Charts';
import { dynamicSort } from '@/utils/helperFunctions';

import NoData from '@/app/Pages/Stats/Components/NoData';



const DealSoUtilizationBar = ({ title, data }: Type_ActiveDealCharts) => {


    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData />)
        } else {
            data = data.sort(dynamicSort("-bought_volume"))

            return (
                <ResponsiveContainer width="100%" height="90%" minHeight="300px">
                    <BarChart
                        // width={500}
                        data={data}

                        stackOffset="expand"
                    >
                        <Legend/>
                        <CartesianGrid opacity={.3} vertical={false}/>
                        <Tooltip
                            // @ts-ignore - Pass tooltip props down properly.
                            content={<CustomTooltip />}
                        />
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
                        <YAxis
                            tickFormatter={tick => tick * 100 + "%"}

                        />


                        <Bar dataKey="bought_volume" stackId="a" fill="var(--color-secondary-light25)" name="% Bought Volume" />
                        <Bar dataKey="so_volume_remaining" stackId="a" fill="var(--color-primary)" opacity={.6} name="% SO Volume Remaining"  />
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
            <div className="tooltip">
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