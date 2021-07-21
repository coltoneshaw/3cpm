
import React, { PureComponent } from 'React';
import { PieChart, Pie, Legend, Cell, ResponsiveContainer, Tooltip } from 'recharts';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


class BalancePie extends PureComponent {


    render() {
        const { title, balance, metrics } = this.props
        console.log(metrics)
        const chartData = [{
            name: 'Available',
            metric: parseInt(balance.position - balance.on_orders)
        },
        {
            name: 'On Orders',
            metric: parseInt(balance.on_orders)
        },
        {
            name: "In Deals",
            metric: parseInt(metrics.activeSum)
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
                    height: '200px'
                }}>
                    <h3 className="chartTitle" style={{ 'padding-bottom': '25px' }}>{title}</h3>


                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width="300px" height="100%">
                            <Pie
                                data={chartData} dataKey="metric" cx="50%" cy="50%" outerRadius={60}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend verticalAlign="bottom" height={36}/>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>


                </div>

            </div>

        )

    }


}

export default BalancePie;