import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useAppSelector } from '@/app/redux/hooks';
import { updateConfig, deleteProfileByIdGlobal } from '@/app/redux/config/configActions';
import { syncNewProfileData } from '@/app/redux/threeCommas/Actions';

import LoaderIcon from '@/app/Components/icons/Loading/Loading';
import { ProfileType } from '@/types/config';

interface SubmitButtons {
  setOpen: any
}

const checkProfileIsValid = (tempProfile: ProfileType) => {
  const { defaultCurrency } = tempProfile.general;
  const { key, mode, secret } = tempProfile.apis.threeC;
  const { reservedFunds, startDate } = tempProfile.statSettings;
  if (!key || !mode || !secret) return { status: false, message: 'Missing 3Commas API information' };
  if (!tempProfile.name) return { status: false, message: 'Missing a valid profile name' };
  if (!reservedFunds) {
    return {
      status: false,
      message: 'Missing accounts. Make sure to click "Test API Keys" and enable an account.',
    };
  }
  if (reservedFunds.filter((account) => account.is_enabled).length === 0) {
    return {
      status: false,
      message: 'Missing an enabled account under reserved funds.',
    };
  }
  if (!startDate) return { status: false, message: 'Missing a start date' };
  if (!defaultCurrency || defaultCurrency.length === 0) {
    return {
      status: false,
      message: 'Missing a valid currency. Please select one before you can continue.',
    };
  }

  return { status: true };
};

const SaveDeleteButtons = ({ setOpen }: SubmitButtons) => {
  const { currentProfile, config } = useAppSelector((state) => state.config);
  const editingProfile = useAppSelector((state) => state.settings.editingProfile);

  const { isSyncing } = useAppSelector((state) => state.threeCommas);
  const [, setLoaderIcon] = useState(false);

  const callback = () => setOpen(true);

  const setProfileConfig = async () => {
    const { status, message } = checkProfileIsValid(editingProfile);
    if (status) {
      setLoaderIcon(true);
      try {
        // saving the config here so the update function below can work properly
        // updating the current profile's data
        const update = await syncNewProfileData(editingProfile, 1000);
        if (update) {
          await window.ThreeCPM.Repository.Config.set('current', currentProfile.id);
          updateConfig();
          callback();
        }
      } catch (error) {
        // if there is an error storing the current profile, the data from the database gets deleted.
        await window.ThreeCPM.Repository.Database.deleteAllData(currentProfile.id);
        console.error(error);
        // eslint-disable-next-line max-len, no-alert
        alert('There was an error storing your profile data. Please try again. If the issue persists look at the documentation for additional guidance.');
      } finally {
        setLoaderIcon(false);
      }
    } else {
      alert(message);
    }
  };

  return (
    <div className="flex-row padding settingsButtonDiv">
      <Button
        variant="contained"
        className="deleteProfile"
        onClick={() => {
          deleteProfileByIdGlobal(config, currentProfile.id, setOpen(true));
        }}
        disableElevation
      >
        Delete Profile
      </Button>
      <Button
        // variant="contained"
        // color="primary"
        className="CtaButton"
        onClick={() => setProfileConfig()}
        disableElevation
      >
        {(isSyncing) ? (
          <>
            {' '}
            Syncing...
            {' '}
            <LoaderIcon />
            {' '}
          </>
        ) : 'Save Profile'}
      </Button>
    </div>
  );
};

export default SaveDeleteButtons;
