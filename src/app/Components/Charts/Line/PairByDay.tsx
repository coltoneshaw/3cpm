import React, { useEffect, useState } from 'react';
import moment from "moment";
import { ComposedChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';
import PairSelector from './Components/PairSelector'


import { useAppSelector } from '@/app/redux/hooks';
import { getLang } from '@/utils/helperFunctions';
const lang = getLang()
import { yAxisWidth, currencyTickFormatter, currencyTooltipFormatter } from '@/app/Components/Charts/formatting'

import { setStorageItem, getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';


import type { Type_Tooltip } from '@/types/Charts';
import type { defaultCurrency, Type_Profile } from '@/types/config'
import type { DateRange } from "@/types/Date";
import { SelectChangeEvent } from '@mui/material';



import { getSelectPairDataByDate, getFiltersQueryString } from '@/app/Features/3Commas/3Commas';

const colors = ["#374151", "#B91C1C", "#B45309", "#047857", "#1D4ED8", "#4338CA", "#6D28D9", "#BE185D"]

interface pairByDate {
    date: string
    pair: string
}


const getPairList = async (updatePairs: Function, updatePairFilters: Function, wheres: string, currentProfile: Type_Profile) => {

    const filtersQueryString = await getFiltersQueryString(currentProfile);
    const { currencyString, accountIdString, currentProfileID } = filtersQueryString;


    // selecting the pair data and sorting by profit for easier viewing.
    //@ts-ignore
    electron.database.query(`select pair, sum(actual_profit) as total_profit from deals WHERE ${wheres} and  profile_id = '${currentProfileID}'  and from_currency in (${currencyString}) and account_id in (${accountIdString}) group by pair order by total_profit desc;`)
        .then((result: { pair: string }[]) => {
            updatePairs(result.map(pair => ({ pair: pair.pair, opacity: 1 })))
            let storedPairs = getStorageItem(storageItem.charts.pairByDateFilter)
            if (!storedPairs) {
                storedPairs = result.map(pair => pair.pair).filter((pair, index) => index < 2)
            }
            updatePairFilters(storedPairs)
        })
}


const PairPerformanceByDate = ({ datePair, defaultCurrency }: { datePair: DateRange, defaultCurrency: defaultCurrency }) => {
    const { currentProfile } = useAppSelector(state => state.config);
    const [localData, updateLocalData] = useState<pairByDate[]>([]);
    const [pairs, updatePairs] = useState<{ pair: string, opacity: number }[]>([])
    const [pairFilters, updatePairFilters] = useState<string[]>([]);

    const yWidth = yAxisWidth(defaultCurrency)


    const handleChange = (event: any) => {

        let filter = event.target.value;
        // preventing more than 8 items from showing at any given time.
        if (filter.length > 8) filter = filter.filter((pair: string, index: number) => index > 0)

        updatePairFilters([...filter]);
        setStorageItem(storageItem.charts.pairByDateFilter, [...filter])
    };

    useEffect(() => {

        let from = ``
        let to = ``

        if (datePair.from !== null) {
            let fromDate = moment.utc(datePair.from)
                .subtract(datePair.from.getTimezoneOffset(), "minutes")
                .startOf("day")
                .toISOString()

            from = `closed_at >= '${fromDate}'`
        }

        if (datePair.to !== null) {
            let toDate = moment.utc(datePair.to)
                .subtract(datePair.to.getTimezoneOffset(), "minutes")
                .add(1, "days")
                .startOf("day")
                .toISOString()

            to = `closed_at < '${toDate}'`
        }

        const wheres = ["1=1", from, to].filter(value => value.length > 0).join(' and ')

        getPairList(updatePairs, updatePairFilters, wheres, currentProfile)

    }, [datePair, currentProfile])

    useEffect(() => {

        getSelectPairDataByDate(pairFilters, datePair, currentProfile)
            .then(data => {
                if (!data) return
                updateLocalData(data)
            })
    }, [pairFilters, datePair])

    return (

        <div className="boxData stat-chart ">
            <div style={{ position: "relative" }}>
                <h3 className="chartTitle">Pair by Date</h3>
                <PairSelector pairFilters={pairFilters} handleChange={handleChange} pairs={pairs} />


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



                        onMouseLeave={() => {
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
                            return new Date(str).toLocaleString(lang, { month: '2-digit', day: '2-digit', timeZone: 'UTC' })
                        }}
                    />

                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickCount={6}
                        type="number"
                        name="Profit"
                        width={yWidth}
                        tickFormatter={(value: any) => currencyTickFormatter(value, defaultCurrency)}
                    />

                    {/* TODO - pass the custom props down properly here.  */}
                    {/* @ts-ignore */}
                    <Tooltip content={<CustomTooltip formatter={(value: any) => currencyTooltipFormatter(value, defaultCurrency)} />} cursor={{ strokeDasharray: '3 3' }} />


                    {pairFilters.map((pair, index) => {
                        const filteredPair = pairs.find(p => p.pair == pair)

                        const opacity = (filteredPair != undefined && filteredPair.opacity != undefined) ? filteredPair.opacity : 1;
                        return <Line name={pair} type="monotone" dataKey={pair} stroke={colors[index]} dot={false} strokeWidth={1.75} opacity={opacity} />

                    })}


                </ComposedChart>

            </ResponsiveContainer>
        </div>
    )

}


function CustomTooltip({ active, payload = [], label, formatter }: Type_Tooltip) {
    if (!active || !payload || !payload[0]) {
        return <></>
    }


    const returnPairData = () => {
        const pairs = { ...payload[0].payload }
        delete pairs.date;

        if (pairs == {}) return ''

        return Object.keys(pairs).map(pair => {
            return <p><strong>{pair}</strong> - Profit: {formatter(pairs[pair])}</p>
        })
    }

    let date = new Date(label).toLocaleString(getLang(), {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="tooltip">
            <h4>{date}</h4>
            {returnPairData()}
        </div>
    )
}
export default PairPerformanceByDate;