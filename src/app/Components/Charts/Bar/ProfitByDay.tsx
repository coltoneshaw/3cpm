import React, { useEffect, useState } from 'react';


import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Type_Profit } from '@/types/3Commas';
import { getLang, removeDuplicatesInArray } from '@/utils/helperFunctions';
const lang = getLang()

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import NoData from '@/app/Pages/Stats/Components/NoData';

import { Type_ProfitChart, Type_Tooltip } from '@/types/Charts';
import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';
import { parseNumber } from '@/utils/number_formatting';


interface Type_NewDateProfit {
    date: string
    profit: number
    type: string
    utc_date: string
}

const convertToNewDates = (data: Type_Profit[], langString: any, type: string) => {

    const mappedArray = data.map(day => {
        return {
            converted_date: new Date(day.utc_date).toLocaleString(lang, langString),
            utc_date: day.utc_date,
            profit: day.profit
        }
    })


    let primaryDates = Array.from(new Set( mappedArray.map(day => { return {converted_date: day.converted_date, utc_date: day.utc_date } }   )))
    primaryDates = removeDuplicatesInArray(primaryDates, 'converted_date')

    return primaryDates.map(date => {

        const filteredDate = mappedArray.filter(y => y.converted_date === date.converted_date)
        return {
            converted_date: date.converted_date,
            utc_date: date.utc_date,
            profit: filteredDate.map(y => y.profit).reduce((sum, profit) => sum + profit),
            type
        }

    })
        

}


const ProfitByDay = ({ data = [], X }: Type_ProfitChart) => {

    const defaultSort = 'day';

    const localStorageSortName = storageItem.charts.ProfitByDay.sort

    const [dateType, setDateType] = useState(defaultSort);
    const [filterString, setFilterString] = useState<{}>({ month: '2-digit', day: '2-digit', year: '2-digit' })

    useEffect(() => {
        if (dateType === 'year') {
            setFilterString({ year: 'numeric' })
        } else if (dateType === 'month') {
            setFilterString({ month: 'short', year: 'numeric' })
        } else {
            setFilterString({ month: '2-digit', day: '2-digit', year: '2-digit' })
        }
    }, [dateType])


    useEffect(() => {
        const getSortFromStorage = getStorageItem(localStorageSortName);
        setDateType((getSortFromStorage != undefined) ? getSortFromStorage : defaultSort);
    }, [])

    const handleChange = (event: SelectChangeEvent) => {
        const selectedSort = (event.target.value != undefined) ? event.target.value as string : defaultSort;
        setDateType(selectedSort);
        setStorageItem(localStorageSortName, selectedSort)
    };


    const filterDropdown = () => {

        return (
            <FormControl >
                <Select
                    value={dateType}
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
            return (<NoData/>)
        }
        const filteredData = convertToNewDates(data, filterString, dateType);
        const calculateAverage = () => {
            const totalProfit = (filteredData.length > 0) ? filteredData.map(deal => deal.profit).reduce((sum, profit) => sum + profit) : 0
            return Math.round(totalProfit / filteredData.length)
        }
        return (
            <ResponsiveContainer width="100%" height="100%" minHeight="300px">
                <BarChart
                    // width={500}
                    // height={300}
                    data={filteredData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}

                >

                    <CartesianGrid opacity={.3} vertical={false}/>
                    <XAxis
                        dataKey="converted_date"
                        axisLine={false}
                        tickLine={false}
                        minTickGap={(filteredData.length > 6) ? 40 : 0}
                        tickFormatter={(str) => {
                            if (str == 'auto' || str == undefined) return ""
                            if (dateType === 'day' || dateType === 'year' || dateType === 'month') {
                                return str
                            } else {
                                return ''
                            }
                        }}
                    />

                    <ReferenceLine y={calculateAverage()} stroke="var(--color-primary-light25)" strokeWidth={2} isFront={true}
                                   label={{value: calculateAverage(), position: 'right'}}/>
                    <YAxis
                        dataKey={X}
                        tickLine={false}
                        axisLine={false}
                        tickCount={6}
                        type="number"
                    />

                    {/* TODO - pass the custom props down properly here.  */}
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip/>} cursor={{strokeDasharray: '3 3'}}/>
                    <Bar type="monotone" dataKey={X} fill="var(--color-secondary-light25)"/>
                </BarChart>

            </ResponsiveContainer>)
    }
    return (
        <div className="boxData stat-chart" >
            <h3 className="chartTitle">Profit by {filterDropdown()} </h3>
            {renderChart()}

        </div>
    )

}


function CustomTooltip({ active, payload}: Type_Tooltip) {
    if (!active || payload.length == 0 || payload[0] == undefined) {
        return <></>
    }
    const data: Type_NewDateProfit = payload[0].payload
    let {date, profit, type, utc_date} = data

    if (type === 'day') {
        date = new Date(utc_date).toLocaleString(getLang(), {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

    }

    // format the date
    return (
        <div className="tooltip">
            <h4>{date}</h4>
            <p>$ {parseNumber(profit, 2)}</p>
        </div>
    )
}
export default ProfitByDay;