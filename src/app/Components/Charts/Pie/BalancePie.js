
import React, { PureComponent } from 'React';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { parseNumber } from '../../../utils/number_formatting';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


class BalancePie extends PureComponent {


    render() {
        const { title, balance, metrics } = this.props

        const { availableBankroll, position, totalBoughtVolume, on_orders } = metrics
        const chartData = [{
            name: 'Available',
            metric: parseInt( availableBankroll ),
            key: 1
        },
        {
            name: 'Limit Orders',
            metric: parseInt( on_orders ),
            key: 2
        },
        {
            name: "Purchased",
            metric: parseInt(totalBoughtVolume),
            key: 3
        }

        ]

        return (
            <div className="boxData" style={{
                height: '250px',
                margin: '25px',
                minWidth: '300px',
                maxWidth: '300px'
            }}>
                <div style={{
                    width: '300px',
                    height: '250px'
                }}>
                    <h3 className="chartTitle" >{title}</h3>


                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width="300px" height="100%">
                            <Pie
                                data={chartData} dataKey="metric" cx="50%" cy="50%" outerRadius={60} outerRadius={85}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36}/>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>


                </div>

            </div>

        )

    }


}

function CustomTooltip({ active, payload }) {
    if (active) {
        const { name, value } = payload[0]
        console.log({name, value})
        return (
            <div className="tooltop">
                <h4>{name}</h4>
                <p>${parseNumber( value ) }</p>
            </div>
        )
    } else {
        return null
    }
}

export default BalancePie;