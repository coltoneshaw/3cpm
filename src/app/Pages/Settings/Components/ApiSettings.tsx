import React from 'react';
import {
  TextField, Button, InputLabel, FormControl, MenuItem, Select,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { updateReservedFundsArray } from '@/app/redux/config/configActions';
import { configPaths } from '@/app/redux/globalFunctions';
import { updateEditProfileByPath } from '@/app/Pages/Settings/Redux/settingsSlice';

import { Type_ReservedFunds } from '@/types/config';

const validKeys = ['key', 'secret', 'mode'];

const ApiSettings = () => {
  const editingProfile = useAppSelector((state) => state.settings.editingProfile);
  const { threeC } = editingProfile.apis;
  const dispatch = useAppDispatch();

  const handleChange = (e: any) => {
    if (!e.target.name || !validKeys.includes(e.target.name)) {
      console.debug('Failed to change API setting due to invalid config path.');
      console.debug(e);
      return;
    }

    const updateData = { ...threeC };

    // @ts-ignore
    updateData[e.target.name] = e.target.value;
    dispatch(updateEditProfileByPath({ data: updateData, path: configPaths.apis.threeC.main }));
  };

  const handleUpdatingReservedFunds = (reservedFunds: Type_ReservedFunds[]) => {
    dispatch(updateEditProfileByPath({ data: reservedFunds, path: configPaths.statSettings.reservedFunds }));
  };

  return (
    <div className=" flex-column settings-child">
      <h2 className="text-center ">API Settings</h2>
      <p className="subText">
        This app requires &quot;Bots read&quot;,
        &quot;Smart trades read&quot;, and &quot;Accounts read&quot; within 3commas.
      </p>
      <div className=" flex-row" style={{ paddingBottom: '25px' }}>
        <TextField
          id="key"
          label="Key"
          name="key"
          value={threeC.key}
          onChange={handleChange}
          className="settings-left"
          style={{
            marginRight: '15px',
            flexBasis: '50%',
          }}
        />
        <TextField
          id="secret"
          label="Secret"
          name="secret"
          value={threeC.secret}
          onChange={handleChange}
          type="password"
          style={{
            marginLeft: '15px',
            flexBasis: '50%',
          }}
        />
      </div>

      <div className=" flex-row" style={{ paddingBottom: '25px' }}>
        <FormControl style={{ flexBasis: '50%' }} fullWidth>
          <InputLabel id="mode-label">Mode</InputLabel>
          <Select
            labelId="mode-label"
            id="mode"
            name="mode"
            label="Mode"
            value={threeC.mode}
            onChange={handleChange}
            style={{
              marginRight: '15px',
            }}
          >
            <MenuItem value="real">Real</MenuItem>
            <MenuItem value="paper">Paper</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Button
        className="CtaButton"
        disableElevation
        onClick={
          async () => {
            const { key, secret, mode } = threeC;
            try {
              const reservedFunds = await updateReservedFundsArray(
                key,
                secret,
                mode,
                editingProfile.statSettings.reservedFunds,
              );
              handleUpdatingReservedFunds(reservedFunds ?? []);
            } catch (error) {
              alert('there was an error testing the API keys. Check the console for more information.');
            }
          }
        }
        style={{
          margin: 'auto',
          borderRight: 'none',
          width: '150px',
        }}
      >
        Test API Keys
      </Button>

    </div>
  );
};

export default ApiSettings;
