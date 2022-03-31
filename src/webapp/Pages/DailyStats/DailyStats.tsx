import React from 'react';
import { Grid, TextField } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import moment from 'moment';

import { UpdateDataButton } from 'webapp/Components/Buttons/Index';
import { useAppSelector } from 'webapp/redux/hooks';
import { PairBar, CopyTodayStatsButton } from 'webapp/Pages/DailyStats/Components';
import { AllCurrencySelector, AccountSelector } from 'webapp/Components/Selectors';

import { SummaryProfitByDay } from 'webapp/Components/Charts/Area';
import { ProfitByDay } from 'webapp/Components/Charts/Bar';
import { useDailyState } from './logic';

import RoiMetrics from './Components/RoiMetrics';
import { formatCurrency } from 'common/utils/granularity';

import './DailyStats.scss';

const formatToUSD = (value: number) => formatCurrency(['USD'], value).metric;

const DailyStats = () => {
  const { metricsData } = useAppSelector((state) => state.threeCommas);

  const {
    queryStats, value, handleChange, defaultCurrency, reservedFunds, updateAccounts, updateCurrency,
  } = useDailyState();

  // These need to be adjusted based on the current currency / exchange. Right now it's not.
  const activeDealReserve = (queryStats.activeDeals.activeDeals.length > 0)
    ? queryStats.activeDeals.activeDeals
      .map((deal) => deal.actual_usd_profit)
      .reduce((sum, profit) => sum + profit)
    : 0;
  const unrealizedProfitTotal = (queryStats.activeDeals.activeDeals.length > 0)
    ? queryStats.activeDeals.activeDeals
      .map((deal) => (deal.take_profit / 100) * deal.bought_volume)
      .reduce((sum, profit) => sum + profit)
    : 0;

  return (
    <>
      <Grid container spacing={1} style={{ marginBottom: '10px' }}>
        <Grid item xs={3}>
          <DesktopDatePicker
            label="Date"
            value={value}
            onChange={handleChange}
            maxDate={new Date(moment.utc(new Date()).endOf('day').valueOf())}
            renderInput={(params) => (
              <TextField
                id={params.id}
                inputProps={params.inputProps}
                ref={params.ref}
                label={params.label}
                autoFocus
              />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <AllCurrencySelector defaultCurrency={defaultCurrency} updateCurrency={updateCurrency} />
        </Grid>
        <Grid item xs={3}>
          <AccountSelector reservedFunds={reservedFunds} updateAccounts={updateAccounts} />
        </Grid>
        <Grid item xs={3}>
          <CopyTodayStatsButton
            key="copyTodayStatsButton"
            todayProfit={queryStats.dailyProfit.current.day}
            metricsData={metricsData}
            activeDealReserve={activeDealReserve}
            className="CtaButton"
            style={{
              margin: 'auto', height: '38px', marginLeft: '15px', padding: '5px 15px',
            }}
          />
          <UpdateDataButton className="CtaButton" style={{ margin: '5px', height: '38px' }} disabled />

        </Grid>
      </Grid>
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <div className="boxData kpiMetricsContainer" style={{ height: '6rem' }}>
            <h3 className="chartTitle">ROI</h3>
            <div className="metrics">
              <RoiMetrics stats={queryStats.dailyProfit} bankroll={metricsData.totalBankroll} date={value} />
            </div>
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className="boxData kpiMetricsContainer" style={{ height: '6rem' }}>
            <h3 className="chartTitle">Profit</h3>
            <div className="metrics">
              <div className="roiSpan">
                <strong>Day:</strong>
                <p>
                  $
                  {formatToUSD(queryStats.dailyProfit.current.day)}
                </p>
              </div>
              <div className="roiSpan">
                <strong>Total:</strong>
                <p>
                  $
                  {formatToUSD(queryStats.totalProfit)}
                </p>
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
                <p>
                  $
                  {formatToUSD(activeDealReserve)}
                </p>
              </div>
              <div className="roiSpan">
                <strong>Unrealized:</strong>
                <p>
                  $
                  {formatToUSD(unrealizedProfitTotal)}
                </p>
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
                <p>
                  $
                  {formatToUSD(queryStats.activeDeals.metrics.totalBoughtVolume)}
                </p>
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
          <SummaryProfitByDay
            data={queryStats.dailyProfit.profitData}
            X="runningSum"
            defaultCurrency={defaultCurrency}
          />
        </Grid>

        <Grid item xs={6}>
          <div className="boxData stat-chart ">
            <h3 className="chartTitle">
              {(queryStats.pairDay.length < 5) ? '' : 'Top 5 '}
              Pairs by Profit
            </h3>
            <PairBar data={queryStats.pairDay} defaultCurrency={defaultCurrency} metric="top" type="pair" />
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="boxData stat-chart ">
            <h3 className="chartTitle">
              Top
              {' '}
              {(queryStats.botDay.length < 5) ? '' : '5 '}
              Bots by Profit
            </h3>
            <PairBar data={queryStats.botDay} defaultCurrency={defaultCurrency} metric="top" type="bot_name" />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default DailyStats;
