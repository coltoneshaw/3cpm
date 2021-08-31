import React, { useEffect, useState } from 'react';


import { Select, InputLabel, FormControl, MenuItem, Checkbox, ListItemText, Input } from '@material-ui/core';


import { getLang, removeDuplicatesInArray } from '@/utils/helperFunctions';
const lang = getLang()

import { ComposedChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

const colors = ["#374151", "#B91C1C", "#B45309", "#047857", "#1D4ED8", "#4338CA", "#6D28D9", "#BE185D"]

import { Type_ProfitChart, Type_Tooltip } from '@/types/Charts';

import { getSelectPairDataByDate } from '@/app/Features/3Commas/3Commas';

interface pairByDate {
    date: string
    pair: string
}



const PairPerformanceByDate = () => {


    const [localData, updateLocalData] = useState<pairByDate[]>([]);
    const [pairs, updatePairs ] = useState<string[]>([])
    const [pairFilters, updatePairFilters] = useState<string[]>([]);


    const handleChange = (event: any) => {

        let filter = event.target.value;

        if (filter.length > 8) filter = filter.filter(( pair:string, index:number) => index > 0)

        updatePairFilters([...filter]);
    };

    useEffect(() => {
        //@ts-ignore
        electron.database.query('select pair, sum(actual_profit) as total_profit from deals group by pair order by total_profit desc;')
            .then(( result: {pair:string}[]) => {
                updatePairs(result.map(pair => pair.pair) )


                updatePairFilters(result.map(pair => pair.pair).filter( ( pair, index) => index < 8))
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
                        <InputLabel>Filter By</InputLabel>

                        <Select
                            multiple
                            value={pairFilters}
                            onChange={handleChange}
                            input={<Input />}
                            // @ts-ignore
                            renderValue={() => (pairFilters.length > 0) ? pairFilters.join() : ""}
                            style={{width: "150px"}}
                            >

                            {
                                pairs.map(pair => (

                                    <MenuItem value={pair}>
                                        
                                        <Checkbox checked={pairFilters.indexOf(pair) > - 1} />
                                        <ListItemText primary={pair} />
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
                    stackOffset="expand"

                >

                    <CartesianGrid opacity={.3} vertical={false} />
                    <Legend verticalAlign="top" height={36} />

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
                            return <Line name={pair} type="monotone" dataKey={pair} stroke={colors[index]}  dot={false} strokeWidth={1.75} />
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
            
            if(pairs == undefined || pairs == {}) return ''

            return Object.keys(pairs).map(pair => {
                return <p><strong>{pair}</strong> ${pairs[pair].toLocaleString()}</p>
            })
        }

        let date = new Date(label).toLocaleString(getLang(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

        return (
            <div className="tooltop">
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