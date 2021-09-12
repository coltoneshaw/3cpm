import React, {useEffect, useState} from 'react';

// material UI components
import {Grid} from '@material-ui/core';

// custom charts
import {BotPerformanceBubble, DealPerformanceBubble} from '@/app/Components/Charts/Scatter';
import {DealAllocationBar} from '@/app/Components/Charts/Bar';
import {PairPerformanceByDate} from '@/app/Components/Charts/Line';

import {useGlobalData} from '@/app/Context/DataContext';
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";
import {
    fetchBotPerformanceMetrics,
    fetchPairPerformanceMetrics,
    fetchPerformanceDataFunction
} from "@/app/Features/3Commas/3Commas";
import {Type_Bot_Performance_Metrics, Type_Pair_Performance_Metrics, Type_Query_PerfArray} from "@/types/3Commas";
import {DateRange} from "@/types/Date";


const PerformanceMonitor = () => {

    const state = useGlobalData();
    const {data: {performanceData}} = state;


    let [localPerf, updateLocalPerf] = useState(performanceData)
    let [datePair, updateDatePair] = useState<DateRange>(new DateRange())

    useEffect(() => {

        Promise.all([
            fetchPerformanceDataFunction(datePair),
            fetchBotPerformanceMetrics(datePair),
            fetchPairPerformanceMetrics(datePair),
        ]).then(([perfData, botPerfData, pairPerfData]) => {
            updateLocalPerf((prevState) => {
                return {
                    ...prevState,
                    pair_bot: perfData,
                    bot: botPerfData,
                    pair: pairPerfData
                }
            })
        })
    }, [performanceData, datePair])


    const updateFromDate = (date: MaterialUiPickersDate) => {
        updateDatePair(prevState => {
            let newDate = {...prevState}
            newDate.from = date
            return newDate
        })
    }

    const updateToDate = (date: MaterialUiPickersDate) => {
        updateDatePair(prevState => {
            let newDate = {...prevState}
            newDate.to = date
            return newDate
        })
    }

    return (
        <>

            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="from"
                            name="from"
                            label="From"
                            value={datePair.from}
                            onChange={updateFromDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change from date',
                            }}
                        />


                        <KeyboardDatePicker
                            style={{marginLeft: "1rem"}}
                            disableToolbar
                            variant="inline"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="to"
                            name="to"
                            label="To"
                            value={datePair.to}
                            onChange={updateToDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change to date',
                            }}
                        />
                    </Grid>
                </Grid>
            </MuiPickersUtilsProvider>


            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <DealAllocationBar title="Deal Allocation" data={localPerf.pair_bot} key="dealAllocationBar"/>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <DealPerformanceBubble title="Deal Performance Scatter" data={localPerf.pair_bot}
                                           key="dealPerformanceBubble"/>

                </Grid>
                <Grid item xs={12} lg={6}>
                    <BotPerformanceBubble title="Bot Performance Scatter" data={localPerf.bot}
                                          key="botPerformanceBubble"/>

                </Grid>

                <Grid item xs={12}>
                    <PairPerformanceByDate key="pairPerformance" datePair={datePair}/>

                </Grid>
            </Grid>
        </>

    )
}

export default PerformanceMonitor