import React from 'react';
import { TextField } from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { configPaths } from '@/app/redux/globalFunctions';
import { updateEditProfileByPath } from '@/app/Pages/Settings/Redux/settingsSlice';

const ProfileNameEditor = () => {
  const { name } = useAppSelector((state) => state.settings.editingProfile);
  const dispatch = useAppDispatch();
  const handleChange = (e: any) => {
    dispatch(updateEditProfileByPath({ data: e.target.value, path: configPaths.name }));
  };

  return (
    <TextField
      id="ProfileName"
      label="Profile Name"
      name="ProfileName"
      value={name}
      onChange={handleChange}
      className="settings-left"
      style={{
        marginRight: '15px',
        width: '250px',
      }}
    />
  );
};

export default ProfileNameEditor;
