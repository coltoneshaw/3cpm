import React from 'react';
import { useAppSelector } from '@/app/redux/hooks';

// material UI components
import { Grid } from '@mui/material';

// custom charts
import { DealSoUtilizationBar, SoDistribution } from '@/app/Components/Charts/Bar/index'
import SpeedometerDiv from '@/app/Pages/Stats/Components/SpeedometerDiv';



const RiskMonitor = () => {

    const { activeDeals, metricsData } = useAppSelector(state => state.threeCommas);
    return (
        <>
            <SpeedometerDiv
                metrics={metricsData}
            />
            <Grid container spacing={4}>
                <Grid item sm={12} lg={12} xl={6}>
                    <DealSoUtilizationBar data={activeDeals} title="Deal Max Utilization" />
                </Grid>
                <Grid item sm={12} lg={12} xl={6}>
                    <SoDistribution data={activeDeals} title="Active Deals SO Distribution" metrics={metricsData} />
                </Grid>
            </Grid>
        </>

    )
}

export default RiskMonitor