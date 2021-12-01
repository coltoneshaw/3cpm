import React from 'react';
import { isValid, startOfDay, addMinutes } from 'date-fns'

import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import { TextField, FormControl } from '@mui/material';

import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { configPaths } from "@/app/redux/globalFunctions";
import { updateEditProfileByPath } from "@/app/Pages/Settings/Redux/settingsSlice";

export default function StartDatePicker() {

  const startDate = useAppSelector(state => state.settings.editingProfile.statSettings.startDate);
  const dispatch = useAppDispatch()


  const handleDateChange = (date: Date | null) => {
    if (date != undefined && isValid(new Date(date))) {
      const newDate = startOfDay(addMinutes(new Date(date), new Date().getTimezoneOffset())).getTime();
      dispatch(updateEditProfileByPath({ data: newDate, path: configPaths.statSettings.startDate }))
    }
  };
  
  return (
    <FormControl style={{ width: "100%" }} className="settings-datePicker">
      <DesktopDatePicker
        label="Stats Start Date"
        views={['day']}
        inputFormat="MM/dd/yyyy"
        value={startDate}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} helperText={params?.inputProps?.placeholder} />}
        className="desktopPicker"
      />

    </FormControl>

  );
}
