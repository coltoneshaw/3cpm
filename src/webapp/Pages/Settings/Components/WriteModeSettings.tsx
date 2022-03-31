import React from 'react';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';

import { useAppSelector, useAppDispatch } from 'webapp/redux/hooks';
import { configPaths } from 'webapp/redux/globalFunctions';
import { updateEditProfileByPath } from 'webapp/Pages/Settings/Redux/settingsSlice';

const WriteModeSettings = () => {
  const writeEnabled = useAppSelector((state) => state.settings.editingProfile.writeEnabled);
  const dispatch = useAppDispatch();

  return (
    <div className="flex-column settings-child">
      <h2 className="text-center ">Write mode:</h2>
      <div className="flex-row">
        <div>
          <p className="subText">
            {/* eslint-disable-next-line max-len */}
            By activating the write mode, you will allow 3CPM to perform write operations on your 3CPM account. 3CPM will never perform any action without asking confirmation.
          </p>

          <FormGroup>
            <FormControlLabel
              control={(
                <Switch
                  checked={writeEnabled ?? false}
                  color="primary"
                  onClick={() => dispatch(updateEditProfileByPath({
                    data: !writeEnabled,
                    path: configPaths.writeEnabled,
                  }))}
                  value
                  name="write-mode"
                  inputProps={{ 'aria-label': 'enable write mode' }}
                />
              )}
              label="Enable write mode"
            />
          </FormGroup>

        </div>
      </div>

    </div>
  );
};

export default WriteModeSettings;
