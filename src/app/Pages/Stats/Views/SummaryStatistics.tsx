import React from 'react';

// material UI components
import { Grid, GridSize } from '@material-ui/core';

// custom charts
import { SummaryProfitByDay } from '@/app/Components/Charts/Area'
import { PairPerformanceBar, BotPerformanceBar, ProfitByDay } from '@/app/Components/Charts/Bar';
import { useGlobalData } from '@/app/Context/DataContext';

const SummaryStatistics = () => {

    const state = useGlobalData();
    const { data: { profitData, performanceData } } = state;
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <ProfitByDay data={profitData} X="profit" />
                </Grid>
                <Grid item xs={6}>
                    <SummaryProfitByDay data={profitData} X="runningSum" />
                </Grid>
                <Grid item xs={12} xl={6}>
                    <PairPerformanceBar title="Pair Performance" data={performanceData.pair}/>
                </Grid>
                <Grid item xs={12} xl={6}>
                    <BotPerformanceBar title="Bot Performance" data={performanceData.bot}/>
                </Grid>
            </Grid>
        </>

    )
}

export default SummaryStatistics