import React from 'react';
import { useAppSelector } from '@/app/redux/hooks';

// material UI components
import {Grid} from '@mui/material';

// custom charts
import { SummaryProfitByDay } from '@/app/Components/Charts/Area'
import { PairPerformanceBar, BotPerformanceBar, ProfitByDay } from '@/app/Components/Charts/Bar';

const SummaryStatistics = () => {

    const { profitData, performanceData } = useAppSelector(state => state.threeCommas);


    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <ProfitByDay data={profitData} X="profit" />
                </Grid>
                <Grid item xs={6}>
                    <SummaryProfitByDay data={profitData} X="runningSum" />
                </Grid>
                <Grid item xs={6} xl={6}>
                    <PairPerformanceBar title="Pair Performance" data={performanceData.pair}/>
                </Grid>
                <Grid item xs={6} xl={6}>
                    <BotPerformanceBar title="Bot Performance" data={performanceData.bot}/>
                </Grid>
            </Grid>
        </>

    )
}

export default SummaryStatistics