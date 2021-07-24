import React from 'react';

// material UI components
import { Grid } from '@material-ui/core';

// custom charts
import { DealPerformanceBubble } from '../../../Charts/Scatter';
import { DealAllocationBar } from '../../../Charts/Bar';
import Card from '../../../Charts/DataCards/Card';

import {parseNumber} from '../../../../utils/number_formatting';

const PerformanceMonitor = (props) => {

    const { performanceData } = props
    const boughtVolume = performanceData.map(deal => deal.bought_volume).reduce((sum, item) => sum + item)
    const totalProfit = performanceData.map(deal => deal.total_profit).reduce((sum, item) => sum + item)
    const totalDeals = parseNumber(performanceData.map(deal => deal.number_of_deals).reduce((sum, item) => sum + item))

    return (
        <>
            <div className="riskDiv">
                <Card title="Total Bought Volume" metric={"$" + parseNumber(boughtVolume)} />
                <Card title="Total Deals" metric={ totalDeals }/>
                <Card title="Total ROI" metric={(( totalProfit/ boughtVolume) * 100 ).toFixed(2) + "%" } />
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