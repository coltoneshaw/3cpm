import React from 'react';
import { isValid } from 'date-fns';
import moment from 'moment';

import DateTimePicker from '@mui/lab/DateTimePicker';
import { TextField, FormControl } from '@mui/material';

import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { configPaths } from '@/app/redux/globalFunctions';
import { updateEditProfileByPath } from '@/app/Pages/Settings/Redux/settingsSlice';

const StartDatePicker = () => {
  const startDate = useAppSelector((state) => state.settings.editingProfile.statSettings.startDate);
  const dispatch = useAppDispatch();

  const returnTodayUtcEnd = (date: Date) => moment.utc(date).endOf('day').valueOf();

  const handleDateChange = (date: Date | null) => {
    if (date !== undefined && isValid(date)) {
      dispatch(
        updateEditProfileByPath({
          data: moment(date).valueOf(),
          path: configPaths.statSettings.startDate,
        }),
      );
    }
  };

  return (
    <FormControl style={{ width: '100%' }} className="settings-datePicker">
      <DateTimePicker
        label="Start Date"
        value={startDate}
        onChange={handleDateChange}
        maxDate={new Date(returnTodayUtcEnd(new Date()))}
        renderInput={(params) => <TextField {...params} />}
        className="desktopPicker"
      />

    </FormControl>

  );
};

export default StartDatePicker;
