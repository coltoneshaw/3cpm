import React, { useEffect} from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Label, ZAxis} from 'recharts';
import { InputLabel, MenuItem, FormControl, Select} from '@material-ui/core';


import { Type_Tooltip, Type_BotPerformanceCharts } from '@/types/Charts'
import { Type_Bot_Performance_Metrics } from '@/types/3Commas';
import { parseNumber } from '@/utils/number_formatting';
import NoData from '@/app/Pages/Stats/Components/NoData';

import { dynamicSort } from '@/utils/helperFunctions';

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';


const colors = ["#cfe1f2", "#b5d4e9", "#93c3df", "#6daed5", "#4b97c9", "#2f7ebc", "#1864aa", "#0a4a90", "#08306b"]

/**
 * TODO
 * - Look at combining this chart by "pair-BO" to minimize bubbles on the chart.
 */

const BotPerformanceBubble = ({ title, data = [] }: Type_BotPerformanceCharts) => {

    const [filter, setFilter] = React.useState('all');

    const defaultFilter = 'all';
    const localStorageFilterName = storageItem.charts.BotPerformanceBubble.filter

    useEffect(() => {
        const getFilterFromStorage = getStorageItem(localStorageFilterName);
        setFilter((getFilterFromStorage != undefined) ? getFilterFromStorage : defaultFilter);
    }, [])


    const handleChange = (event: any) => {
        const selectedFilter = (event.target.value != undefined) ? event.target.value : defaultFilter;
        setFilter(selectedFilter);
        setStorageItem(localStorageFilterName, selectedFilter)
    };

    const getPosition = (localData: Type_Bot_Performance_Metrics[]) => {
        // localData = localData.sort(dynamicSort(metric))

        return localData.map((entry, index) => {
            // @ts-ignore
            return <Cell key={entry.bot_id} fill={colors[index % colors.length]} opacity={.8} />
        })

    }

    const filterData = (data: Type_Bot_Performance_Metrics[] ) => {
        data = data.sort(dynamicSort('-total_profit'));
        const length = data.length;
        const fiftyPercent = length / 2
        const twentyPercent = length / 5

        if (filter === 'top20')  {
            data = data.sort(dynamicSort('-total_profit'));
            return data.filter( (bot, index) => index < twentyPercent)
        } else if (filter === 'top50')  {
            data = data.sort(dynamicSort('-total_profit'));
            return data.filter( (bot, index) => index < fiftyPercent)
        } else if (filter === 'bottom50')  {
            data = data.sort(dynamicSort('total_profit'));
            return data.filter( (bot, index) => index < fiftyPercent)
        } else if (filter === 'bottom20') {
            data = data.sort(dynamicSort('total_profit'));
            return data.filter((bot, index) => index < twentyPercent)
        }
        return data;


    }

    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData/>)
        }

        // sort this by the index
        const localData = filterData(data);

        return (<ResponsiveContainer width="100%" height="100%" minHeight="400px">

            <ScatterChart
                width={400}
                height={400}
                margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                }}
            >
                <CartesianGrid opacity={.3}/>

                {/*
                        X - Average Deal Hours
                        Y - Average Hourly Profit
                        Z - Number of deals completed
                        Cell Color - Base Order Start

                     */}
                <XAxis
                    type="number"
                    dataKey="avg_deal_hours"
                    height={50}
                    name="Avg Deal Hours"
                    tickCount={9}
                    allowDataOverflow={false}
                    allowDecimals={false}


                >
                    <Label value="Avg. Deal Hours" offset={0} position="insideBottom"/>
                </XAxis>

                <YAxis
                    type="number"
                    dataKey="total_profit"
                    name="Total Profit"
                    allowDataOverflow={false}
                    allowDecimals={true}

                >
                    <Label value="Total Profit"
                           angle={-90}
                           dy={0}
                           dx={-20}
                    />
                </YAxis>
                {/* Range is lowest number and highest number. */}
                <ZAxis type="number" dataKey="number_of_deals"
                       range={[Math.min(...localData.map(deal => deal.number_of_deals)) + 200, Math.max(...localData.map(deal => deal.number_of_deals)) + 200]}
                       name="# of Deals Completed"/>


                <Tooltip
                    cursor={{strokeDasharray: '3 3'}}
                    // @ts-ignore
                    // TODOD - pass props properly to the custom tool tip
                    content={<CustomTooltip/>}
                />
                <Scatter name="Deal Performance" data={localData}>
                    {/* <LabelList dataKey="pair" /> */}

                    {
                        getPosition(localData)
                    }
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>)
    }

    return (
        <div className="boxData" >
            <div style={{ position: "relative" }}>
                <h3 className="chartTitle">{title}</h3>
                <div style={{ position: "absolute", right: 0, top: 0, height: "50px", zIndex: 5 }}>
                    <FormControl  >
                        <InputLabel id="demo-simple-select-label">Filter By</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filter}
                            onChange={handleChange}
                            style={{ width: "150px" }}
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="top20">Top 20%</MenuItem>
                            <MenuItem value="top50">Top 50%</MenuItem>
                            <MenuItem value="bottom50">Bottom 50%</MenuItem>
                            <MenuItem value="bottom20">Bottom 20%</MenuItem>
                        </Select>
                    </FormControl>
                </div>




            </div>
            {renderChart()}
        </div>
    )
}


function CustomTooltip({ active, payload}: Type_Tooltip) {
    if (!active || payload.length == 0 || payload[0] == undefined) {
        return null
    }

    const data: Type_Bot_Performance_Metrics = payload[0].payload
    const {total_profit, bot_name, avg_deal_hours, bought_volume, number_of_deals} = data
    return (
        <div className="tooltip">
            <h4>{bot_name}</h4>
            <p><strong>Total Profit:</strong> ${parseNumber(total_profit)}</p>
            <p><strong>Average Deal Hours:</strong> {parseNumber(avg_deal_hours, 2)}</p>
            <p><strong># of Deals:</strong> {number_of_deals}</p>
            <p><strong>Bought Volume:</strong>{parseNumber(bought_volume)}</p>

        </div>
    )
}


export default BotPerformanceBubble;