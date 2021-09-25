import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/redux/hooks';

// material UI components
import { Grid } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField, FormControl } from '@mui/material';


// custom charts
import { BotPerformanceBubble, DealPerformanceBubble } from '@/app/Components/Charts/Scatter';
import { DealAllocationBar } from '@/app/Components/Charts/Bar';
import { PairPerformanceByDate } from '@/app/Components/Charts/Line';

import {
    fetchBotPerformanceMetrics,
    fetchPairPerformanceMetrics,
    fetchPerformanceDataFunction
} from "@/app/Features/3Commas/3Commas";
import { DateRange } from "@/types/Date";


const PerformanceMonitor = () => {
    const { currentProfile } = useAppSelector(state => state.config);
    const { performanceData } = useAppSelector(state => state.threeCommas);



    let [localPerf, updateLocalPerf] = useState(performanceData)
    let [datePair, updateDatePair] = useState<DateRange>(new DateRange())

    useEffect(() => {

        Promise.all([
            fetchPerformanceDataFunction(datePair, currentProfile),
            fetchBotPerformanceMetrics(datePair, currentProfile),
            fetchPairPerformanceMetrics(datePair, currentProfile),
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


    const updateFromDate = (date: Date | null) => {
        updateDatePair(prevState => {
            let newDate = { ...prevState }
            newDate.from = date
            return newDate
        })
    }

    const updateToDate = (date: Date | null) => {
        updateDatePair(prevState => {
            let newDate = { ...prevState }
            newDate.to = date
            return newDate
        })
    }

    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={3} >
                    <DesktopDatePicker
                        label="From"
                        views={['day']}
                        inputFormat="MM/dd/yyyy"
                        value={datePair.from}
                        onChange={updateFromDate}
                        renderInput={(params) => (
                            <TextField {...params} helperText={params?.inputProps?.placeholder} />

                        )}
                        className="desktopPicker"
                    />
                </Grid>
                <Grid item xs={3} >

                    <DesktopDatePicker
                        label="To"
                        views={['day']}
                        inputFormat="MM/dd/yyyy"
                        value={datePair.to}
                        onChange={updateToDate}
                        renderInput={(params) => (
                            <TextField {...params} helperText={params?.inputProps?.placeholder} />

                        )}
                        className="desktopPicker"
                    />
                </Grid>



            </Grid>


            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <DealAllocationBar title="Deal Allocation" data={localPerf.pair_bot} key="dealAllocationBar" />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <DealPerformanceBubble title="Deal Performance Scatter" data={localPerf.pair_bot}
                        key="dealPerformanceBubble" />

                </Grid>
                <Grid item xs={12} lg={6}>
                    <BotPerformanceBubble title="Bot Performance Scatter" data={localPerf.bot}
                        key="botPerformanceBubble" />

                </Grid>

                <Grid item xs={12}>
                    <PairPerformanceByDate key="pairPerformance" datePair={datePair} />

                </Grid>
            </Grid>
        </>

    )
}

export default PerformanceMonitor