import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { ProfitByDay, SummaryProfitByDay } from '@/app/Components/Charts/Area'
import { useGlobalData } from '@/app/Context/DataContext';



const SummaryStatistics = () => {

    const state = useGlobalData();
    const { data: { profitData } } = state;


    return (
        <>
            <Grid container spacing={12}>
                <Grid item xs={6}>
                    <ProfitByDay data={profitData} X="profit" />
                </Grid>
                <Grid item xs={6}>
                    <SummaryProfitByDay data={profitData} X="runningSum" />
                </Grid>
            </Grid>
        </>

    )
}

export default SummaryStatistics