import { getTime, parseISO, formatISO, isValid, startOfDay, addMinutes } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz';

import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';

import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { storeEditingProfileData, setEditingProfile } from "@/app/redux/configSlice";

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { useGlobalState } from '@/app/Context/Config';




export default function StartDatePicker() {
  const profile = useAppSelector(state => state.config.editingProfile)
  const dispatch = useAppDispatch();
  const [editingProfile, updateEditingProfile] = useState(profile)
  const [date, updateDate] = useState('')

  useEffect(() => {
    updateEditingProfile(profile)

    if(profile && editingProfile.statSettings.startDate) {
      const adjustedTime = profile.statSettings.startDate + ((new Date()).getTimezoneOffset() * 60000)
      const dateString = new Date(adjustedTime).toUTCString()
      updateDate(dateString)
    }
    
  }, [profile])

  const handleDateChange = (date: any) => {

    // const timeZone = getTimeZoneValue()
    startOfDay(date)
    if (date != undefined && isValid(new Date(date))) {
      const isoDate = formatISO( startOfDay(addMinutes(date, new Date().getTimezoneOffset()) )).split('T')[0]
      const tempProfile = { ...profile }
      const utcDate = isoDate + 'T00:00:00Z'     
      tempProfile.statSettings.startDate = getTime(parseISO(utcDate))

      // console.log(tempProfile.statSettings.startDate)
      updateEditingProfile(tempProfile)
      dispatch(setEditingProfile(tempProfile))
      dispatch(storeEditingProfileData())
    }
  };

  const modifyDate = (date: number) => {
    const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
    return new Date(adjustedTime).toUTCString()
  }

  // // converting the date into a ISO date and storing it.
  // useEffect(() => {
  //   const adjustedTime = date + ((new Date()).getTimezoneOffset() * 60000)
  //   const dateString = new Date(adjustedTime).toUTCString()
  //   setLocalDate(dateString)
  // }, [])


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
