import React, { PureComponent } from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { parseISO, format } from 'date-fns'

const parseNumber = (number) => {
    if (number) {
        return number.toLocaleString(undefined, { 'minimumFractionDigits': 0, 'maximumFractionDigits': 0 })
    }
    return number
}
export default class SummaryProfitByDay extends PureComponent {

    render() {

        if(this.props.data == []){
            return(<div>Loading...</div>)
        }


        return (
            <div className="boxData" style={{ 'margin': '25px' }}>
             <h3 className="chartTitle">Cumulative profit by day </h3>

            <ResponsiveContainer width="100%" aspect={2} >
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

                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                        tickFormatter={tick =>  parseNumber(tick)}
                        tickCount={8}
                        // TODO - Need to look at passing in a tick array that contains the values rounded to 100s.
                        type="number" domain={[dataMin => (0 - Math.abs(dataMin)).toFixed(0), dataMax => dataMax.toFixed(0)]}
                         />
                    <Tooltip content={<CustomTooltip />}/>
                    <defs>
                        <linearGradient id="gradiant" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={20} stopColor="#DEE3EC" stopOpacity={1} />
                            <stop offset={0} stopColor="#9BABC7" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey={this.props.X} stroke="#212B3B" strokeWidth={1.75} fill="url(#gradiant)" />
                </AreaChart>

            </ResponsiveContainer>
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
