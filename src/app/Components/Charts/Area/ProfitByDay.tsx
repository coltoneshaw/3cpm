import React, { useEffect, useState } from 'react';
import { formatISO } from 'date-fns';


import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Type_Profit } from '@/types/3Commas';
import { getLang, removeDuplicatesInArray } from '@/utils/helperFunctions';
const lang = getLang()

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import NoData from '@/app/Pages/Stats/Components/NoData';

import { Type_ProfitChart } from '@/types/Charts';

import { CustomTooltip } from '@/app/Components/Charts/Tooltips';


// TODO
// Fix the tool tip to allow for better date filters on month / year.

const convertToNewDates = (data: Type_Profit[], langString: any) => {

    const mappedArray = data.map( day => {
        
        return {
            date: new Date(day.utc_date).toLocaleString(getLang(), langString),
            profit: day.profit
    }})

    const primaryDates =  Array.from ( new Set( mappedArray.map( day => day.date) ) )

    return primaryDates.map( date => ({
            date,
            profit: mappedArray.filter(y => y.date === date).map(y => y.profit).reduce( (sum, profit) => sum + profit)
    }))

}


const ProfitByDay = ({ data, X }: Type_ProfitChart) => {

    const totalProfit = (data.length > 0) ? data.map(deal => deal.profit).reduce((sum, profit) => sum + profit) : 0
    const average = totalProfit / data.length

    const [range, setRange] = useState('day');
    const [ filterString, setFilterString ] = useState<{}>({month: '2-digit', day: '2-digit'}) 

    useEffect(() => {
        if (range === 'year') {
            setFilterString( { year: 'numeric' })
        } else if (range === 'month') {
            setFilterString ( { month: 'short', year: '2-digit' }) 
        } else {
            setFilterString( {month: '2-digit', day: '2-digit'}) 
        }
    
    }, [range] )



    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setRange(event.target.value as string);
    };


    const filterDropdown = () => {

        return (
            <FormControl >
                <Select
                    value={range}
                    onChange={handleChange}
                    style={{
                        fontWeight: 300,
                        fontSize: '1.17em !important'
                    }}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                    <MenuItem value="year">Year</MenuItem>
                </Select>
            </FormControl>
        )
    }



    const renderChart = () => {
        if (data.length === 0) {
            return (<NoData />)
        } else {
            return (
                <ResponsiveContainer width="100%" height="100%" minHeight="300px">
                    <BarChart
                        width={500}
                        height={300}
                        data={convertToNewDates(data, filterString)}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}

                    >

                        <CartesianGrid opacity={.3} vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            minTickGap={50}
                        />

                        <ReferenceLine y={average} stroke="var(--color-primary)" strokeWidth={2} />
                        <YAxis
                            dataKey={X}
                            tickLine={false}
                            axisLine={false}
                            tickCount={6}
                            type="number"
                        />

                        {/* TODO - pass the custom props down properly here.  */}
                        {/* @ts-ignore */}
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        <Bar type="monotone" dataKey={X} fill="var(--color-secondary-light25)" />
                    </BarChart>

                </ResponsiveContainer>)
        }
    }
    return (
        <div className="boxData stat-chart" >
            <h3 className="chartTitle">Profit by {filterDropdown()} </h3>
            {renderChart()}

        </div>
    )

}

export default ProfitByDay;