import { getTime, parseISO, formatISO, isValid, startOfDay, addMinutes } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz';

import React, { useState, useEffect } from 'react';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField, FormControl } from '@mui/material';

import type { defaultTempProfile } from '@/app/Pages/Settings/Settings'

export default function StartDatePicker({ tempProfile, updateTempProfile }: { tempProfile: typeof defaultTempProfile, updateTempProfile: CallableFunction }) {

  const handleDateChange = (date: Date | null) => {
    if (date != undefined && isValid(new Date(date))) {
      const newDate = startOfDay(addMinutes(new Date(date), new Date().getTimezoneOffset())).getTime();
      updateTempProfile((prevState: typeof defaultTempProfile) => {
        let newState = { ...prevState }
        newState.startDate = newDate
        return newState
    })
    }
  };

  const modifyDate = (date: number) => {
    const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
    return new Date(adjustedTime).toUTCString()
  }


  return (
    <FormControl style={{ width: "100%"}} className="settings-datePicker">
        <DesktopDatePicker
          label="Stats Start Date"
          views={['day']}
          inputFormat="MM/dd/yyyy"
          value={tempProfile.startDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField {...params} helperText={params?.inputProps?.placeholder} />
          )}
          className="desktopPicker"
        />

    </FormControl>

  );
}
