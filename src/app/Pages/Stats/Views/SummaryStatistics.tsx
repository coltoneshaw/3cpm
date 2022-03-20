import React from 'react';
import { Grid } from '@mui/material';
import { useAppSelector } from '@/app/redux/hooks';

// material UI components

// custom charts
import { SummaryProfitByDay } from '@/app/Components/Charts/Area';
import { PairPerformanceBar, BotPerformanceBar, ProfitByDay } from '@/app/Components/Charts/Bar';

const SummaryStatistics = () => {
  const { profitData, performanceData } = useAppSelector((state) => state.threeCommas);
  const defaultCurrency = useAppSelector((state) => state.config.currentProfile.general.defaultCurrency);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6}>
        <ProfitByDay data={profitData} X="profit" defaultCurrency={defaultCurrency} />
      </Grid>
      <Grid item xs={6}>
        <SummaryProfitByDay data={profitData} X="runningSum" defaultCurrency={defaultCurrency} />
      </Grid>
      <Grid item xs={6} xl={6}>
        <PairPerformanceBar data={performanceData.pair} defaultCurrency={defaultCurrency} />
      </Grid>
      <Grid item xs={6} xl={6}>
        <BotPerformanceBar data={performanceData.bot} defaultCurrency={defaultCurrency} />
      </Grid>
    </Grid>

  );
};

export default SummaryStatistics;
