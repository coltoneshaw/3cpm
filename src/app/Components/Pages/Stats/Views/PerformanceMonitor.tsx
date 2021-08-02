import React, { useEffect } from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealPerformanceBubble } from '@/app/Components/Charts/Scatter';
import { DealAllocationBar } from '@/app/Components/Charts/Bar';
import Card from '@/app/Components/Charts/DataCards/Card';

import { parseNumber } from '@/utils/number_formatting';
import { useGlobalData } from '@/app/Context/DataContext';

const PerformanceMonitor = () => {

    const state = useGlobalData();
    const { data: { performanceData, metricsData } } = state;
    console.log(performanceData)

    const { totalDeals, boughtVolume, totalProfit_perf, averageDailyProfit, averageDealHours } = metricsData



    return (
        <>
            <div className="riskDiv">
                <Card title="Total Bought Volume" metric={"$" + parseNumber(boughtVolume)} />
                <Card title="Total Deals" metric={ parseNumber( totalDeals) } />
                <Card title="Total ROI" metric={((totalProfit_perf / boughtVolume) * 100).toFixed(2) + "%"} />
                <Card title="Avg. Daily Profit (USD)" metric={"$" + parseNumber(averageDailyProfit)} />
                <Card title="Avg. Deal Hours" metric={ averageDealHours.toFixed(2)} />


            </div>
            <Grid item xs={12}>
                <DealAllocationBar title="Deal Allocation" data={performanceData} />
                <DealPerformanceBubble title="Deal Performance Scatter" data={performanceData} />
            </Grid>
        </>

    )
}

export default PerformanceMonitor