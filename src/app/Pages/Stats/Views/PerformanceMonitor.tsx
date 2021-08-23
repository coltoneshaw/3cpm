import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealPerformanceBubble, BotPerformanceBubble } from '@/app/Components/Charts/Scatter';
import { DealAllocationBar } from '@/app/Components/Charts/Bar';

import { useGlobalData } from '@/app/Context/DataContext';

const PerformanceMonitor = () => {

    const state = useGlobalData();
    const { data: { performanceData, metricsData } } = state;
    // console.log(performanceData)

    return (
        <>


            <Grid container spacing={8}>
                <Grid item xs={12}>
                    <DealAllocationBar title="Deal Allocation" data={performanceData.pair_bot} />
                </Grid>
                <Grid item xs={12} lg={6}>
                    <DealPerformanceBubble title="Deal Performance Scatter" data={performanceData.pair_bot} />

                </Grid>
                <Grid item xs={12} lg={6}>
                    <BotPerformanceBubble title="Bot Performance Scatter" data={performanceData.bot} />

                </Grid>
            </Grid>
        </>

            )
}

            export default PerformanceMonitor