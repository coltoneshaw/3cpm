import { getTime, parseISO, formatISO, isValid } from 'date-fns'
import React, { useContext, useState, useEffect, forwardRef } from 'react';
import DateFnsUtils from '@date-io/date-fns';


import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { useGlobalState } from '@/app/Context/Config';




export default function StartDatePicker() {
  const state = useGlobalState()
  const { state: { date, updateDate }, config } = state

  const [localDate, setLocalDate] = useState<string>();

  const handleDateChange = (date: any) => {
    if (date != undefined && isValid(new Date(date))) {
      setLocalDate(date)

      // getting the shortform utc date, stripping and converting to ISO
      const dateString = formatISO(date, { representation: 'date' })
      const utcDate = dateString + 'T00:00:00Z'
      updateDate(getTime(parseISO(utcDate)));
    }

  };

  // converting the date into a ISO date and storing it.
  useEffect(() => {
    const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
    const dateString = new Date(adjustedTime).toUTCString()
    setLocalDate(dateString)
  }, [])


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Stats Start Date"
        value={localDate}
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
