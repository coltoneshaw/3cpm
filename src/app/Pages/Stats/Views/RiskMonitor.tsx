import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealSoUtilizationBar, SoDistribution } from '@/app/Components/Charts/Bar/index'
import SpeedometerDiv from '@/app/Pages/Stats/Components/SpeedometerDiv';
import { useGlobalData } from '@/app/Context/DataContext';



const RiskMonitor = () => {

    const state = useGlobalData();
    const { data: { activeDeals, metricsData, balanceData } } = state;
    return (
        <>
            <SpeedometerDiv
                metrics={metricsData}
            />
            <Grid container spacing={8}>
                <Grid item sm={12} lg={12} xl={6}>
                    <DealSoUtilizationBar data={activeDeals} title="Deal Max Utalization" />
                </Grid>
                <Grid item sm={12} lg={12} xl={6}>
                    <SoDistribution data={activeDeals} title="Active Deals SO Distribution" metrics={metricsData} />
                </Grid>
            </Grid>
        </>

    )
}

export default RiskMonitor