import React, { PureComponent } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Area, Scatter } from 'recharts';


import {InputLabel, MenuItem, FormControl, Select, FormHelperText} from '@material-ui/core';

import NoData from '@/app/Components/Pages/Stats/Components/NoData';

import { parseNumber, formatPercent } from '@/utils/number_formatting';
import { dynamicSort } from '@/utils/helperFunctions';

import { Type_Bot_Performance_Metrics } from '@/types/3Commas';
import { Type_Tooltip, Type_BotPerformanceCharts } from '@/types/Charts';

const legendFind = (value: string) => {
    if (value == "bought_volume") return "Bought Volume"
    return "SO Volume Remaining"
}



const BotPerformanceBar = ({ title, data }: Type_BotPerformanceCharts) => {

    const [sort, setSort] = React.useState('-total_profit');

    const handleChange = (event:any) => {
        setSort(event.target.value);
    };

    const hide = (id:string ) => {
        return (id == sort) ? false : true  
    }
    const renderChart = () => {
        if (data == undefined || data.length === 0) {
            return (<NoData />)
        } else {
            data = data.sort(dynamicSort(sort))
            return (<ResponsiveContainer width="100%" height="90%" minHeight="300px">
                <ComposedChart

                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    stackOffset="expand"
                >
                    <CartesianGrid strokeDasharray="5 5" opacity={.7} />
                    <Legend verticalAlign="top" height={36} />
                    <Tooltip
                        // @ts-ignore - tooltip refactoring
                        // todo - improve how tooltops can pass the values.
                        content={<CustomTooltip />}
                    />
                    <XAxis 
                        dataKey="bot_name"
                        type="category"
                        angle={45}
                        axisLine={false}
                        height={125}
                        textLength={15}
                        textAnchor="start"
                        
                        tickFormatter={(str) => {
                            return (str.length > 12 ) ? str.slice(0, 9) + "..." : str
                        }}
                        dx={0}
                        // dx={15}
                        dy={5}
                        fontSize=".75em"
                        minTickGap={-200}

                    />
                    <YAxis yAxisId="total_profit" orientation='right' hide={hide("total_profit")} domain={[0, 'auto']} allowDataOverflow={true} offset={20}/>
                    <YAxis yAxisId="avg_deal_hours" orientation='right' hide={hide("avg_deal_hours")} domain={[0, 'auto']} allowDataOverflow={true} offset={20} />
                    <YAxis yAxisId="bought_volume" orientation='right' hide={hide("bought_volume") } domain={[0, 'auto']} allowDataOverflow={true} offset={20} />

                    <Bar  name="Bought Volume" yAxisId="bought_volume" dataKey="bought_volume" fillOpacity={.8} fill="#8BBABC" />
                    <Bar name="Total Profit" dataKey="total_profit" fill="#E8AE00"  yAxisId="total_profit" />
                    <Bar name="Avg. Deal Hours" dataKey="avg_deal_hours"  yAxisId="avg_deal_hours"/>
                    {/* <Line name="Total Profit" type="monotone" yAxisId="total_profit" dataKey="total_profit" stroke="#E8AE00" dot={false} strokeWidth={1.75} /> */}
                    {/* <Line name="Avg. Deal Hours" type="monotone" yAxisId="avg_deal_hours" dataKey="avg_deal_hours" dot={false} strokeWidth={1.75} /> */}

                </ComposedChart>
            </ResponsiveContainer>)
        }
    }

    return (
        <div className="boxData stat-chart bubble-chart ">
            <div style={{position: "relative"}}>
                <h3 className="chartTitle">{title}</h3>
                <div style={{ position:"absolute", right: 0, top: 0, height: "50px", zIndex: 5}}>
                <FormControl  >
                    <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        onChange={handleChange}
                        style={{width: "150px"}}
                    >
                        <MenuItem value="-total_profit">Profit</MenuItem>
                        <MenuItem value="-bought_volume">Bought Volume</MenuItem>
                        <MenuItem value="-avg_deal_hours">Avg. Deal Hours</MenuItem>
                    </Select>
                </FormControl>
                </div>
                   

                

            </div>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload, label }: Type_Tooltip) {
    if (active) {
        const data: Type_Bot_Performance_Metrics = payload[0].payload
        const { total_profit, avg_completed_so, avg_profit, avg_deal_hours, bought_volume, number_of_deals, bot_name } = data
        return (
            <div className="tooltop">
                <h4>{bot_name}</h4>
                <p><strong>Bought Volume:</strong> ${parseNumber(bought_volume)} </p>
                <p><strong>Deal Count:</strong> {number_of_deals} </p>
                <p><strong>Total Profit:</strong> ${parseNumber(total_profit)} </p>
                <p><strong>Avg Deal Hours:</strong> {parseNumber(avg_deal_hours)} </p>
            </div>
        )
    } else {
        return null
    }
}

export default BotPerformanceBar;