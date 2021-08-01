import React, { PureComponent } from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

import NoData from '../../Pages/Stats/Components/NoData';

import { parseISO, format } from 'date-fns'



export default class ProfitByDay extends PureComponent {

    render() {

        const gradientOffset = () => {
            const dataMax = Math.max(...this.props.data.map((i) => i.profit));
            const dataMin = Math.min(...this.props.data.map((i) => i.profit));

            if (dataMax <= 0) {
                return 0;
            }
            if (dataMin >= 0) {
                return 1;
            }

            return dataMax / (dataMax - dataMin);
        };
        const off = gradientOffset();


        const renderChart = () => {
            if (this.props.data.length === 0) {
                return (<NoData />)
            } else {
                return (<ResponsiveContainer width="100%" aspect={2} >
                <AreaChart
                    width={500}
                    height={300}
                    data={this.props.data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    title="test"

                >

                    <CartesianGrid opacity={.3} vertical={false} />
                    <XAxis
                        dataKey="utc_date"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={50}
                        tickFormatter={(str) => {
                            if (str == 'auto') return ""
                            let date = parseISO(new Date(str).toISOString())
                            return format(date, "M/d")
                        }}
                    />
                    <YAxis 
                        dataKey={this.props.X} 
                        tickLine={false} 
                        axisLine={false} 
                        tickCount={6} 
                        />
                    <Tooltip content={<CustomTooltip />}/>
                    <defs>
                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={off} stopColor="#DEE3EC" stopOpacity={1} />
                            <stop offset={off} stopColor="#9BABC7" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={this.props.X} stroke="#212B3B" strokeWidth={1.75} fill="url(#splitColor)" />
                </AreaChart>

            </ResponsiveContainer>)
            }
        }
        return (
            <div className="boxData" style={{ 'margin': '25px' }}>
            <h3 className="chartTitle">Profit by day </h3>
            {renderChart()}
            
            </div>
        )

    }

}

function CustomTooltip({ active, payload, label }) {
    if(active){
        return (
            <div className="tooltop">
                <h4>{format( parseISO(new Date(label).toISOString()), "eeee, d MMM, yyyy" ) }</h4>
                <p>$ {payload[0].value.toLocaleString()}</p>
            </div>
        )
    } else {
        return null
    }
}

