import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealSoUtalizationBar, SoDistribution } from '../../../Charts/Bar'
import SpeedometerDiv from '../Components/SpeedometerDiv';
import { useGlobalData } from '../../../../Context/DataContext';



const RiskMonitor = () => {

    const state = useGlobalData();
    const { data: { activeDeals, metricsData, balanceData } } = state;
    return (
        <>
        <SpeedometerDiv
                    metrics={metricsData}
                    balance={balanceData}
                    />
        <Grid item xs={12}>
            <DealSoUtalizationBar data={activeDeals} title="Current Deal SO Utalization" />
            <SoDistribution  data={activeDeals} title="Current Deal SO Distribution" metrics={metricsData}/>
        </Grid>
        </>
        
    )
}

export default RiskMonitor