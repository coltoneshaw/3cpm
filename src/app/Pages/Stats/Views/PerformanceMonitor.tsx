import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/app/redux/hooks';

// material UI components
import { Grid } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField, FormControl } from '@mui/material';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import Box from '@mui/material/Box';

// custom charts
import { BotPerformanceBubble, DealPerformanceBubble } from '@/app/Components/Charts/Scatter';
import { DealAllocationBar } from '@/app/Components/Charts/Bar';
import { PairPerformanceByDate } from '@/app/Components/Charts/Line';

import {
    fetchBotPerformanceMetrics,
    fetchPairPerformanceMetrics,
    fetchPerformanceDataFunction
} from "@/app/Features/3Commas/3Commas";
import { DateRange as Type_DateRange } from "@/types/Date";


const PerformanceMonitor = () => {
    const { currentProfile } = useAppSelector(state => state.config);
    const { performanceData } = useAppSelector(state => state.threeCommas);



    let [localPerf, updateLocalPerf] = useState(performanceData)
    let [datePair, updateDatePair] = useState<Type_DateRange>(new Type_DateRange())

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


    const updateFilterDate = (date: DateRange<Date>) => {
        updateDatePair({from: date[0], to: date[1]})

    }
    const [value, setValue] = React.useState<DateRange<Date>>([null, null]);
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={5} style={{ marginBottom: '10px' }}>
                    <DateRangePicker
                        startText="Start Date"
                        endText="End Date"
                        value={value}
                        maxDate={new Date()}
                        onChange={(newValue) => {
                            updateFilterDate(newValue);
                            setValue(newValue)
                        }}
                        renderInput={(startProps, endProps) => (
                            <>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                            </>
                        )}
                        
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