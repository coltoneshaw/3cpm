import React, { PureComponent } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import NoData from '../../Pages/Stats/Components/NoData';

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
export default class SoDistribution extends PureComponent {


    render() {
        const { title, data, metrics } = this.props

        

        let dataArray = []


        if(data.length > 0){
            const MaxSO = Math.max( ...data.map( deal => deal.completed_safety_orders_count ))
            const soNumbers = Array.from(Array(MaxSO + 1).keys())
            const totalDeals = data.length
            const totalDealFunds = metrics.activeSum
                
            dataArray = soNumbers.map(SO => {
                let matchingDeals = data.filter( deal => deal.completed_safety_orders_count === SO)
                let volume = (matchingDeals.length > 0) ? matchingDeals.map(deal => deal.bought_volume).reduce((sum, item) => sum + item) : 0
                let numberOfDeals = matchingDeals.length
    
                return {
                    SO,
                    'percentOfDeals' : ( numberOfDeals / totalDeals ),
                    'percentOfVolume' : (  volume / totalDealFunds ),
                    volume,
                    numberOfDeals 
                }
    
            })
        } 
        const renderChart = () => {
            if (data.length === 0) {
                return (<NoData />)
            } else {
                return (<ResponsiveContainer width="100%" aspect={5}>
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
                    <Bar dataKey="percentOfVolume"fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>)
            }
        }
        




        return (
            <div className="boxData" style={{ 'margin': '25px' }}>
                <h3 className="chartTitle">{title}</h3>
                {renderChart()}
            </div>
        )
    }


}

const formatPercent = (num1, num2) => {
    return ((num1 / num2) * 100).toFixed(0) + "%"
}

function CustomTooltip({ active, payload, label }) {
    if (active) {

        const { percentOfDeals, percentOfVolume, volume, numberOfDeals } = payload[0].payload
        return (
            <div className="tooltop">
                <h4>SO # {label}</h4>
                <p><strong>Bought Volume:</strong> ${parseNumber(volume)} ( {(percentOfVolume * 100).toFixed(2) } %)</p>
                <p><strong>Deal Count:</strong> {numberOfDeals} ( {( percentOfDeals * 100).toFixed(2) } $)</p>
            </div>
        )
    } else {
        return null
    }
}
