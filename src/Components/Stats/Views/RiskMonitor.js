import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealSoUtalizationBar, SoDistribution } from '../../Charts/Bar'
import SpeedometerDiv from '../Components/SpeedometerDiv';



const RiskMonitor = ({activeDeals, metrics, balance}) => {

    console.log(metrics)
    return (
        <>
        <SpeedometerDiv
                    metrics={{
                        maxRiskPercent: metrics.maxRiskPercent,
                        bankrollAvailable:  metrics.bankrollAvailable,
                        activeSum: metrics.activeSum
                    }}
                        balance={balance}
                    />
        <Grid item xs={12}>
            <DealSoUtalizationBar data={activeDeals} title="Current Deal SO Utalization" />
            <SoDistribution  data={activeDeals} title="Current Deal SO Distribution" metrics={metrics}/>
        </Grid>
        </>
        
    )
}

export default RiskMonitor