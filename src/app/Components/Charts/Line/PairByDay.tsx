import React, { useEffect, useState } from 'react';


import { Select, InputLabel, FormControl, MenuItem, Checkbox, ListItemText, Input, Menu } from '@material-ui/core';
import { ComposedChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, Area, AreaChart } from 'recharts';

import { getLang, removeDuplicatesInArray } from '@/utils/helperFunctions';
import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

const lang = getLang()

import { Type_ProfitChart, Type_Tooltip } from '@/types/Charts';
import { getSelectPairDataByDate } from '@/app/Features/3Commas/3Commas';

const colors = ["#374151", "#B91C1C", "#B45309", "#047857", "#1D4ED8", "#4338CA", "#6D28D9", "#BE185D"]

interface pairByDate {
    date: string
    pair: string
}


const PairPerformanceByDate = () => {

    const [localData, updateLocalData] = useState<pairByDate[]>([]);
    const [pairs, updatePairs] = useState<{ pair: string, opacity: number }[]>([])
    const [pairFilters, updatePairFilters] = useState<string[]>([]);


    const handleChange = (event: any) => {

        let filter = event.target.value
        // preventing more than 8 items from showing at any given time.
        if (filter.length > 8) filter = filter.filter((pair: string, index: number) => index > 0)

        updatePairFilters([...filter]);
        setStorageItem(storageItem.charts.pairByDateFilter, [...filter])
    };

    useEffect(() => {

        // selecting the pair data and sorting by profit for easier viewing.
        //@ts-ignore
        electron.database.query('select pair, sum(actual_profit) as total_profit from deals group by pair order by total_profit desc;')
            .then((result: { pair: string }[]) => {
                updatePairs(result.map(pair => ({ pair: pair.pair, opacity: 1 })))

                const storedPairs = getStorageItem(storageItem.charts.pairByDateFilter)

                if (storedPairs != undefined) {
                    updatePairFilters(storedPairs)
                } else {
                    // adds the top 5 pairs by profit to the chart by default
                    updatePairFilters(result.map(pair => pair.pair).filter((pair, index) => index < 2))
                }

            })

    }, [])

    useEffect(() => {
        getSelectPairDataByDate(pairFilters)
            .then(data => updateLocalData(data))
    }, [pairFilters])

    return (

        <div className="boxData stat-chart bubble-chart">
            <div style={{ position: "relative" }}>
                <h3 className="chartTitle">Pair by Date</h3>

                <div style={{ position: "absolute", left: 0, top: 0, height: "50px", zIndex: 5 }}>
                    <FormControl>
                        <InputLabel>Show</InputLabel>

                        <Select
                            multiple
                            value={pairFilters}
                            onChange={handleChange}
                            input={<Input />}
                            // @ts-ignore
                            renderValue={() => (pairFilters.length > 0) ? pairFilters.join() : ""}
                            style={{ width: "150px" }}

                            MenuProps={{
                                MenuListProps: {
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                                    }
                                }
                            }}


                        >
                            {
                                pairs.map(pair => (
                                    <MenuItem value={pair.pair} key={pair.pair}>
                                        <Checkbox checked={pairFilters.indexOf(pair.pair) > - 1} />
                                        <ListItemText primary={pair.pair} />
                                    </MenuItem>
                                ))
                            }

                        </Select>
                    </FormControl>

                </div>
            </div>


            <ResponsiveContainer width="100%" height="100%" minHeight="300px">
                <ComposedChart
                    width={500}
                    height={300}
                    data={localData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >

                    <CartesianGrid opacity={.3} vertical={false} />
                    <Legend verticalAlign="top" height={36}

                        onMouseEnter={(e) => {
                            updatePairs(prevState => {
                                return prevState.map(p => ({
                                    ...p,
                                    opacity: (p.pair != e.payload.dataKey) ? .2 : 1
                                }))
                            })
                        }}

                        onMouseLeave={(e) => {
                            updatePairs(prevState => {
                                return prevState.map(p => ({
                                    ...p,
                                    opacity: 1
                                }))
                            })
                        }}

                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={(localData.length > 6) ? 40 : 0}
                        tickFormatter={(str) => {
                            if (str == 'auto' || str == undefined) return ""
                            return new Date(str).toLocaleString(lang, { month: '2-digit', day: '2-digit' })
                        }}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickCount={6}
                        type="number"
                        name="Profit"
                    />

                    {/* TODO - pass the custom props down properly here.  */}
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />


                    {
                        pairFilters.map((pair, index) => {
                            const filteredPair = pairs.find(p => p.pair == pair)

                            const opacity = (filteredPair != undefined && filteredPair.opacity != undefined) ? filteredPair.opacity : 1;
                            return <Line name={pair} type="monotone" dataKey={pair} stroke={colors[index]} dot={false} strokeWidth={1.75} opacity={opacity} />
                            // return <Area type="monotone" name={pair} stackId="1" dataKey={pair} fill={colors[index]} stroke={colors[index]} opacity={opacity} />

                        })
                    }


                </ComposedChart>

            </ResponsiveContainer>
        </div>
    )

}


function CustomTooltip({ active, payload, label }: Type_Tooltip) {
    if (active && payload != null && payload[0] != undefined) {


        const returnPairData = () => {
            const pairs = { ...payload[0].payload }
            delete pairs.date;

            if (pairs == undefined || pairs == {}) return ''

            return Object.keys(pairs).map(pair => {
                return <p><strong>{pair}</strong> ${pairs[pair].toLocaleString()}</p>
            })
        }

        let date = new Date(label).toLocaleString(getLang(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

        return (
            <div className="tooltip">
                <h4>{date}</h4>
                {
                    returnPairData()
                }
            </div>
        )

    } else {
        return <></>
    }
}
export default PairPerformanceByDate;