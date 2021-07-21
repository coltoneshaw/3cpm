import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { ProfitByDay, SummaryProfitByDay } from '../../Charts/Area'



const RiskMonitor = ({dealData}) => {
    return (
        <>
        <Grid container spacing={12}>
                    <Grid item xs={6}>
                        <ProfitByDay data={dealData} X="profit" />
                    </Grid>
                    <Grid item xs={6}>
                        <SummaryProfitByDay data={dealData} X="runningSum" />
                    </Grid>
                </Grid>
        </>
        
    )
}

export default RiskMonitor