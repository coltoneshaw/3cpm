/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import './Settings.scss';
import {
  ButtonGroup,
  Button,
} from '@mui/material';
import { useAppSelector, useAppDispatch } from '@/webapp/redux/hooks';
import { setEditingProfile } from '@/webapp/Pages/Settings/Redux/settingsSlice';

// @ts-ignore
import { version } from '#/package.json';
import { openLink } from '@/utils/helperFunctions';

import {
  CurrencySelector,
  SaveDeleteButtons,
  ApiSettings,
  ReservedBankroll,
  StartDatePicker,
} from './Components/Index';

import { ProfileNameEditor } from '@/webapp/Features/Profiles/Components/Index';

import { ChangelogModal, ToastNotifications } from '@/webapp/Features/Index';
import WriteModeSettings from '@/webapp/Pages/Settings/Components/WriteModeSettings';

const SettingsPage = () => {
  const dispatch = useAppDispatch();

  const { currentProfile } = useAppSelector((state) => state.config);
  const [open, setOpen] = useState(false);
  const handleClose = (event: any, reason: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  useEffect(() => {
    dispatch(setEditingProfile(currentProfile));
  }, [currentProfile]);

  // changelog state responsible for opening / closing the changelog
  const [openChangelog, setOpenChangelog] = useState(false);

  const handleOpenChangelog = () => {
    setOpenChangelog(true);
  };

  return (
    <>
      <div className="settings-div boxData flex-column" style={{ margin: 'auto' }}>
        <ProfileNameEditor />
        <ApiSettings />

        <div className="flex-column settings-child">
          <h2 className="text-center ">General Settings:</h2>
          <div className="flex-row">
            <div style={{
              marginRight: '15px',
              flexBasis: '50%',
            }}
            >
              <p className="subText">
                The selected currency below will control what the
                {' '}
                <strong>entire application </strong>
                is filtered by. ex: if you select USD and also have USDT deals you will not see the USDT deals displayed. You currently cannot mix currencies except USD pegged.
              </p>
              <CurrencySelector />

              <p className="subText">
                The selected time below will modify what displays in all historical charts. This time is in your local timezone, so if 3Commas rolls over at 8pm for you set it to your start date to the date at 8pm.
              </p>
              <StartDatePicker />
            </div>
            <div style={{
              marginLeft: '15px',
              flexBasis: '50%',
            }}
            >

              <p className="subText">
                Once you&apos;ve tested the API keys be sure to enable an account below. In reserved funds you can set aside funds to be added / removed from DCA calculations. ex: ( -4000 will be added, 4000 will be removed.) Double click in the reserved fund box to update the value.
              </p>
              <ReservedBankroll />

            </div>

          </div>

        </div>

        <WriteModeSettings />

        <SaveDeleteButtons setOpen={setOpen} />

        {/* These buttons still need to be wired up, but for now they are displayed. */}
        <ButtonGroup variant="text" color="primary" aria-label="text primary button group" style={{ margin: 'auto' }}>

          <Button onClick={() => openLink('https://github.com/coltoneshaw/3c-portfolio-manager#feedback-or-bug-submission')} style={{ margin: '1em', borderRight: 'none' }}>Leave Feedback / Report a bug</Button>
        </ButtonGroup>
        <Button
          variant="text"
          color="primary"
          aria-label="text primary button"
          className="versionNumber"
          onClick={handleOpenChangelog}
          style={{ width: '250px' }}
        >
          {version}

        </Button>
      </div>
      <ChangelogModal open={openChangelog} setOpen={setOpenChangelog} />
      <ToastNotifications open={open} handleClose={handleClose} message="Config has been saved" />
    </>
  );
};

export default SettingsPage;
