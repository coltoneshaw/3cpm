import { getTime, parseISO, formatISO, isValid, startOfDay, addMinutes } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz';

import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';

import {  useAppSelector } from '@/app/redux/hooks';
import { configPaths } from '@/app/redux/configSlice'
import { updateNestedEditingProfile } from '@/app/redux/configActions';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';





export default function StartDatePicker() {
  const profile = useAppSelector(state => state.config.editingProfile)
  const [date, updateDate] = useState(() => 0)

  useEffect(() => {
    if(profile.statSettings.startDate) updateDate(profile.statSettings.startDate)
  
  }, [profile])

  const handleDateChange = (date: any) => {
    if (date != undefined && isValid(new Date(date))) {
      const newDate = startOfDay( addMinutes( new Date(date), new Date().getTimezoneOffset() )).getTime();
      updateDate(newDate)
      updateNestedEditingProfile(newDate, configPaths.statSettings.startDate)
    }
  };

  const modifyDate = (date: number) => {
    const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
    return new Date(adjustedTime).toUTCString()
  }


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="MM/dd/yyyy"
        margin="normal"
        id="date-picker-inline"
        label="Stats Start Date"
        value={modifyDate(date)}
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
