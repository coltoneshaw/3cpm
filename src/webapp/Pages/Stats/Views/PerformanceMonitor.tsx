import React, { useEffect, useState } from 'react';

// material UI components
import { Grid, TextField, Box } from '@mui/material';
import DateRangePicker, { DateRange } from '@mui/lab/DateRangePicker';
import { useAppSelector } from 'webapp/redux/hooks';

// custom charts
import { BotPerformanceBubble, DealPerformanceBubble } from 'webapp/Components/Charts/Scatter';
import { DealAllocationBar, SoDealDistribution } from 'webapp/Components/Charts/Bar';
import PairPerformanceByDate from 'webapp/Components/Charts/Line';

import {
  fetchBotPerformanceMetrics,
  fetchPairPerformanceMetrics,
  fetchPerformanceDataFunction,
  fetchSoData,
} from 'webapp/Features/3Commas/3Commas';
import { DateRange as Type_DateRange } from 'types/Date';

const PerformanceMonitor = () => {
  const { currentProfile } = useAppSelector((state) => state.config);
  const { performanceData } = useAppSelector((state) => state.threeCommas);

  const [localPerf, updateLocalPerf] = useState(performanceData);
  const [datePair, updateDatePair] = useState<Type_DateRange>(new Type_DateRange());

  useEffect(() => {
    Promise.all([
      fetchPerformanceDataFunction(currentProfile, datePair),
      fetchBotPerformanceMetrics(currentProfile, datePair),
      fetchPairPerformanceMetrics(currentProfile, datePair),
      fetchSoData(currentProfile, datePair),
    ]).then(([perfData, botPerfData, pairPerfData, safety_order]) => {
      updateLocalPerf((prevState) => ({
        ...prevState,
        pair_bot: perfData,
        bot: botPerfData,
        pair: pairPerfData,
        safety_order,

      }));
    });
  }, [performanceData, datePair]);

  const updateFilterDate = (date: DateRange<Date>) => {
    updateDatePair({ from: date[0], to: date[1] });
  };
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={5} style={{ marginBottom: '10px' }}>
          <DateRangePicker
            startText="Start Date"
            endText="End Date"
            value={value}
            maxDate={new Date()}
            onChange={(newValue) => {
              updateFilterDate(newValue);
              setValue(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <>
                <TextField
                  ref={startProps.ref}
                  inputProps={startProps.inputProps}
                />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField
                  ref={endProps.ref}
                  inputProps={endProps.inputProps}
                />
              </>
            )}
          />
        </Grid>

      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12}>
          <DealAllocationBar
            data={localPerf.pair_bot}
            key="dealAllocationBar"
            defaultCurrency={currentProfile.general.defaultCurrency}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <DealPerformanceBubble
            data={localPerf.pair_bot}
            defaultCurrency={currentProfile.general.defaultCurrency}
            key="dealPerformanceBubble"
          />

        </Grid>
        <Grid item xs={12} lg={6}>
          <BotPerformanceBubble
            data={localPerf.bot}
            defaultCurrency={currentProfile.general.defaultCurrency}
            key="botPerformanceBubble"
          />

        </Grid>

        <Grid item xs={12}>
          <PairPerformanceByDate
            key="pairPerformance"
            datePair={datePair}
            defaultCurrency={currentProfile.general.defaultCurrency}
          />

        </Grid>

        <Grid item xs={12}>
          <SoDealDistribution
            data={localPerf.safety_order}
            key="soDealDistribution"
            defaultCurrency={currentProfile.general.defaultCurrency}
          />
        </Grid>
      </Grid>
    </>

  );
};

export default PerformanceMonitor;
