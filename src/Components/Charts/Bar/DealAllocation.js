import React, { PureComponent } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
export default class DealAllocationBar extends PureComponent {


    render() {
        let { title, data } = this.props

        data = data.filter( row => row.percentTotalVolume > .15)
            .sort((a, b) => a.percentTotalProfit < b.percentTotalProfit ? -1 : (a.percentTotalProfit > b.percentTotalProfit ? 1 : 0))

        console.log(data)

        return (
            <div className="boxData" style={{ 'margin': '25px' }}>
                <h3 className="chartTitle">{title}</h3>
                <ResponsiveContainer width="100%" aspect={3}>
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
                            tickFormatter={tick => tick + "%"}
                        />
                        
                        
                        <Bar dataKey="percentTotalVolume" fill="#8884d8" />
                        <Bar dataKey="percentTotalProfit" fill="#82ca9d" />
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

        const { total_profit, bot_name, pair, percentTotalVolume, percentTotalProfit, bought_volume } = payload[0].payload
        return (
            <div className="tooltop">
                <h4>{pair}</h4>
                <p><strong>Bot:</strong> {bot_name}</p>
                <p><strong>Total Profit:</strong> ${parseNumber(total_profit)}</p>
                <p><strong>Bought Volume:</strong> ${parseNumber(bought_volume)}</p>
                <p><strong>% of Total Volume:</strong> {percentTotalVolume.toFixed(2)}%</p>
                <p><strong>% of Total Profit:</strong> {percentTotalProfit.toFixed(3)}%</p>

            </div>
        )
    } else {
        return null
    }
}
