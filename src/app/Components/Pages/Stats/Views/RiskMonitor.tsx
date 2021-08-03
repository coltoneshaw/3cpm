import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealSoUtalizationBar, SoDistribution } from '@/app/Components/Charts/Bar/index'
import SpeedometerDiv from '@/app/Components/Pages/Stats/Components/SpeedometerDiv';
import { useGlobalData } from '@/app/Context/DataContext';



const RiskMonitor = () => {

    const state = useGlobalData();
    const { data: { activeDeals, metricsData, balanceData } } = state;
    return (
        <>
            <SpeedometerDiv
                metrics={metricsData}
            />
            <Grid container >
                <Grid item xl={6} md={12} lg={6}>
                    <DealSoUtalizationBar data={activeDeals} title="Deal Max Utalization" />
                </Grid>
                <Grid item xl={6} md={12} lg={6}>
                    <SoDistribution data={activeDeals} title="Active Deals SO Distribution" metrics={metricsData} />
                </Grid>
            </Grid>
        </>

    )
}

export default RiskMonitor