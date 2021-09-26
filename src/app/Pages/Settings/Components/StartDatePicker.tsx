import { getTime, parseISO, formatISO, isValid, startOfDay, addMinutes } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz';

import React, { useState, useEffect } from 'react';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField, FormControl } from '@mui/material';


import { useAppSelector } from '@/app/redux/hooks';
import { configPaths } from '@/app/redux/configSlice'
import { updateNestedEditingProfile } from '@/app/redux/configActions';


export default function StartDatePicker() {
  const profile = useAppSelector(state => state.config.editingProfile)
  const [date, updateDate] = useState(() => 0)

  useEffect(() => {
    if (profile.statSettings.startDate) updateDate(profile.statSettings.startDate)

  }, [profile])

  const handleDateChange = (date: Date | null) => {
    if (date != undefined && isValid(new Date(date))) {
      const newDate = startOfDay(addMinutes(new Date(date), new Date().getTimezoneOffset())).getTime();
      updateDate(newDate)
      updateNestedEditingProfile(newDate, configPaths.statSettings.startDate)
    }
  };

  const modifyDate = (date: number) => {
    const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
    return new Date(adjustedTime).toUTCString()
  }


  return (
    <FormControl style={{ width: "100%",}}>
        <DesktopDatePicker
          label="Stats Start Date"
          views={['day']}
          inputFormat="MM/dd/yyyy"
          value={date}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField {...params} helperText={params?.inputProps?.placeholder} />

          )}
          className="desktopPicker"
        />

    </FormControl>

  );
}
