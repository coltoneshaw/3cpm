import { getTime, sub } from 'date-fns'
import React, { useContext, useState, useEffect, forwardRef } from 'react';
import DateFnsUtils from '@date-io/date-fns';


import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { useGlobalState } from '@/app/Context/Config';

import { findConfigData } from '@/utils/defaultConfig';
const startDatePath = 'statSettings.startDate'




export default function StartDatePicker() {
  const state = useGlobalState()
  const { state: { date, updateDate }, config } = state

  // const [selectedDate, setSelectedDate] = useState(() => new Date());

  useEffect(() => {
    updateDate(findConfigData(config, startDatePath));
  }, [config])

  const handleDateChange = ( date:any) => {

    updateDate(getTime(date));

    console.log('changing the date')
  };

  console.log({date})

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Stats Start Date"
        value={date}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        style={{
          width: "100%"
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
