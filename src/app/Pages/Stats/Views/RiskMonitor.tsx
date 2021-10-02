import React from 'react';
import { useAppSelector } from '@/app/redux/hooks';

// material UI components
import { Grid } from '@mui/material';

// custom charts
import { DealSoUtilizationBar, SoDistribution } from '@/app/Components/Charts/Bar/index'
import SpeedometerDiv from '@/app/Pages/Stats/Components/SpeedometerDiv';



const RiskMonitor = () => {

    const { activeDeals, metricsData } = useAppSelector(state => state.threeCommas);
    const defaultCurrency = useAppSelector(state => state.config.currentProfile.general.defaultCurrency);

    return (
        <>
            <div className="riskMonitorDiv">
                <SpeedometerDiv
                    metrics={metricsData}
                    defaultCurrency={defaultCurrency}
                />

                <div className="chartDiv">

                    <DealSoUtilizationBar data={activeDeals} defaultCurrency={defaultCurrency} />
                    <SoDistribution data={activeDeals} metrics={metricsData} defaultCurrency={defaultCurrency} />


                    {/* <Grid container spacing={4}>
                        <Grid item sm={12} lg={12}>
                            <DealSoUtilizationBar data={activeDeals} defaultCurrency={defaultCurrency} />
                        </Grid>
                        <Grid item sm={12} lg={12}>
                            <SoDistribution data={activeDeals} metrics={metricsData} defaultCurrency={defaultCurrency} />
                        </Grid>
                    </Grid> */}
                </div>

            </div>


        </>

    )
}

export default RiskMonitor