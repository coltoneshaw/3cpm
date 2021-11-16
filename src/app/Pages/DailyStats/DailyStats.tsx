import React, { useEffect, useMemo, useState } from "react";
import { CopyTodayStatsButton } from '@/app/Components/Buttons/Index'
import { Grid, TextField } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import { useAppSelector } from '@/app/redux/hooks';
import { PairBar } from "@/app/Pages/DailyStats/Components";
import { useDailyState } from "./logic";
import AllCurrencySelector from '@/app/Components/Selectors/AllCurrencySelector'
import AccountSelector from "@/app/Components/Selectors/AccountSelector";

import { SummaryProfitByDay } from '@/app/Components/Charts/Area'
import { ProfitByDay } from '@/app/Components/Charts/Bar';

import { RoiMetrics } from "./Components/KPIs";
import { formatCurrency } from "@/utils/granularity";

import './DailyStats.scss';
/*
TODO list:

- Save the query in the redux state. Maybe.
- Add Reserves to the copy / paste

- Adjust the reserves / unrealized to be based on current filters.
- Add a table of closed deals for that day.
/*

ROi METRICS
To create ROI
*/

const formatToUSD = (value: number) => formatCurrency(['USD'], value).metric


const DailyStats = () => {
    const { metricsData, profitData } = useAppSelector(state => state.threeCommas);

    const { queryStats, value, handleChange, defaultCurrency, reservedFunds, updateAccounts, updateCurrency } = useDailyState()

    // These need to be adjusted based on the current currency / exchange. Right now it's not.
    const activeDealReserve = (queryStats.activeDeals.activeDeals.length > 0) ? queryStats.activeDeals.activeDeals.map(deal => deal.actual_usd_profit).reduce((sum, profit) => sum + profit) : 0;
    const unrealizedProfitTotal = (queryStats.activeDeals.activeDeals.length > 0) ? queryStats.activeDeals.activeDeals.map(deal => (deal.take_profit / 100) * deal.bought_volume).reduce((sum, profit) => sum + profit) : 0;

    /*
    Top metrics


    Metric ideas:
    - longest running deal
    - 3c total profit - This is outside of any date filters.
    - % change from the prior day
    - Best pair / worst pair
    - best bot / worst bot
    - Day ROI
    - Active Deal Reserves

    Total ROI

    Weekly / daily ROI
    Charts defaulted to last 30 days
    */


    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={3} style={{ marginBottom: '10px' }}>
                    <DesktopDatePicker
                        label="Date"
                        value={value}
                        onChange={handleChange}
                        maxDate={new Date()}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid item xs={3} style={{ marginBottom: '10px' }}>
                    <AllCurrencySelector defaultCurrency={defaultCurrency} updateCurrency={updateCurrency} />
                </Grid>
                <Grid item xs={3} style={{ marginBottom: '10px' }}>
                    <AccountSelector reservedFunds={reservedFunds} updateAccounts={updateAccounts} />
                </Grid>
                <Grid item xs={3} style={{ marginBottom: '10px' }}>
                    <CopyTodayStatsButton
                        key="copyTodayStatsButton"
                        currency={defaultCurrency}
                        profitData={profitData}
                        metricsData={metricsData}
                        className="CtaButton"
                        style={{ margin: "auto", height: "36px", marginLeft: "15px", padding: "5px 15px" }}
                    />

                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <div className="boxData kpiMetricsContainer" style={{ height: '6rem' }}>
                        <h3 className="chartTitle">ROI</h3>
                        <div className="metrics">
                            <RoiMetrics stats={queryStats.dailyProfit} bankroll={metricsData.totalBankroll} />
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="boxData kpiMetricsContainer" style={{ height: '6rem' }}>
                        <h3 className="chartTitle">Profit</h3>
                        <div className="metrics">
                            <div className="roiSpan">
                                <strong>Day:</strong>
                                <p>${formatToUSD(queryStats.dailyProfit.current.day)}</p>
                            </div>
                            <div className="roiSpan">
                                <strong>Total:</strong>
                                <p>${formatToUSD(queryStats.totalProfit)}</p>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="boxData kpiMetricsContainer" style={{ height: '6rem' }}>
                        <h3 className="chartTitle">Future Profits</h3>
                        <div className="metrics">
                            <div className="roiSpan">
                                <strong>Reserves:</strong>
                                <p>${formatToUSD(activeDealReserve)}</p>
                            </div>
                            <div className="roiSpan">
                                <strong>Unrealized:</strong>
                                <p>${formatToUSD(unrealizedProfitTotal)}</p>
                            </div>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="boxData kpiMetricsContainer" style={{ height: '6rem' }}>
                        <h3 className="chartTitle">Current Deal Stats</h3>
                        <div className="metrics">
                            <div className="roiSpan">
                                <strong>In Deals:</strong>
                                <p>${formatToUSD(queryStats.activeDeals.metrics.totalBoughtVolume)}</p>
                            </div>
                            <div className="roiSpan">
                                <strong>Deals:</strong>
                                <p>{queryStats.activeDeals.activeDeals.length}</p>
                            </div>
                        </div>
                    </div>
                </Grid>


                <Grid item xs={6}>
                    <ProfitByDay data={queryStats.dailyProfit.profitData} X="profit" defaultCurrency={defaultCurrency} />
                </Grid>
                <Grid item xs={6}>
                    <SummaryProfitByDay data={queryStats.dailyProfit.profitData} X="runningSum" defaultCurrency={defaultCurrency} />
                </Grid>

                <Grid item xs={6}>
                    <div className="boxData stat-chart " >
                        <h3 className="chartTitle">{(queryStats.pairDay.length < 5) ? '' : 'Top 5 '}Pairs by Profit</h3>
                        <PairBar data={queryStats.pairDay} defaultCurrency={defaultCurrency} metric="top" type="pair" />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="boxData stat-chart " >
                        <h3 className="chartTitle">Top {(queryStats.botDay.length < 5) ? '' : '5 '}Bots by Profit</h3>
                        <PairBar data={queryStats.botDay} defaultCurrency={defaultCurrency} metric="top" type="bot_name" />
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default DailyStats;