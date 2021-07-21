import React, { PureComponent } from 'react';

import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const legendFind = (value) => {
    if (value == "bought_volume") return "Bought Volume"
    return "SO Volume Remaining"
}

const parseNumber = (number) => {
    if (number) {
        return number.toLocaleString(undefined, { 'minimumFractionDigits': 0, 'maximumFractionDigits': 0 })
    }
    return number
}


const renderCustomizedLabel = (props) => {
    const { content, ...rest } = props;

    return <Label {...rest} fontSize="12" fill="#FFFFFF" fontWeight="Bold" />;
};
export default class DealSoUtalizationBar extends PureComponent {


    render() {
        const { title, data } = this.props



        return (
            <div className="boxData" style={{ 'margin': '25px' }}>
                <h3 className="chartTitle">{title}</h3>
                <ResponsiveContainer width="100%" aspect={5}>
                    <BarChart
                        width={500}
                        height={200}
                        data={data}
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
                            content={<CustomTooltip />}
                        />
                        <XAxis dataKey="pair"
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
                        
                        
                        <Bar dataKey="bought_volume" stackId="a" fill="#8884d8" />
                        <Bar dataKey="so_volume_remaining" stackId="a" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }


}

const formatPercent = (num1, num2) => {
    return ((num1 / num2) * 100).toFixed(0) + "%"
}

function CustomTooltip({ active, payload, label }) {
    if (active) {

        const { bought_volume, so_volume_remaining, max_deal_funds, bot_name } = payload[0].payload
        return (
            <div className="tooltop">
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
