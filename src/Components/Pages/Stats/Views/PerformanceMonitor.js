import React, { useEffect } from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealPerformanceBubble } from '../../../Charts/Scatter';
import { DealAllocationBar } from '../../../Charts/Bar';
import Card from '../../../Charts/DataCards/Card';

import { parseNumber } from '../../../../utils/number_formatting';
import { useGlobalData } from '../../../../Context/DataContext';

const PerformanceMonitor = () => {

    const state = useGlobalData();
    const { data: { performanceData, metricsData } } = state;
    console.log(performanceData)

    const { totalDeals, boughtVolume, totalProfit_perf } = metricsData



    return (
        <>
            <div className="riskDiv">
                <Card title="Total Bought Volume" metric={"$" + parseNumber(boughtVolume)} />
                <Card title="Total Deals" metric={ parseNumber( totalDeals) } />
                <Card title="Total ROI" metric={((totalProfit_perf / boughtVolume) * 100).toFixed(2) + "%"} />
                <Card title="Avg. Daily Profit (USD)" metric="$50" />
                <Card title="Avg. Deal Hours" metric="1.5" />


            </div>
            <Grid item xs={12}>
                <DealAllocationBar title="Deal Allocation" data={performanceData} />
                <DealPerformanceBubble title="Deal Performance Scatter" performanceData={performanceData} />
            </Grid>
        </>

    )
}

export default PerformanceMonitor