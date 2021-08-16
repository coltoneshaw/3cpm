import { getTime, parseISO, formatISO } from 'date-fns'
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

  const offset = (new Date()).getTimezoneOffset() * 60000

  const handleDateChange = ( date:any) => {
    const dateString = formatISO( date, { representation: 'date' } )
    const utcDate = dateString + 'T00:00:00Z'
    updateDate(getTime(parseISO(utcDate)));

  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Stats Start Date"
        value={date + offset}
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
