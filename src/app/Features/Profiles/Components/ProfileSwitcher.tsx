import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import PersonIcon from '@mui/icons-material/Person';

import HoverMenu from 'material-ui-popup-state/HoverMenu';
import MenuItem from '@mui/material/MenuItem';

import {
  usePopupState,
  bindHover,
  bindMenu,
} from 'material-ui-popup-state/hooks';
import { Divider } from '@mui/material';
import ManageProfileModal from '@/app/Features/Profiles/ManageProfileModal';
import { setSyncData } from '@/app/redux/threeCommas/threeCommasSlice';
import { addConfigProfile, setCurrentProfileById } from '@/app/redux/config/configSlice';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';

const ProfileSwitcher = () => {
  const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' });
  const [open, setOpen] = useState(false);

  const config = useAppSelector((state) => state.config.config);
  const dispatch = useAppDispatch();

  const [profiles, updateProfiles] = useState(config.profiles);
  const [currentProfileId, updateCurrentProfileId] = useState(config.current);

  useEffect(() => {
    updateProfiles(config.profiles);
    updateCurrentProfileId(config.current);
  }, [config]);

  const addNewProfile = () => {
    const navigate = useNavigate();
    // navigate to settings
    // add a profile to the store.
    dispatch(addConfigProfile());
    navigate('/settings');
  };

  const returnMenuOptions = () => {
    if (!profiles) return <MenuItem onClick={popupState.close}>No profiles Configured</MenuItem>;

    return Object.keys(profiles).map((p: string) => {
      const menuProfile = profiles[p];
      const styles = (p === currentProfileId) ? { backgroundColor: 'lightBlue' } : {};
      return (
        <MenuItem
          key={p}
          onClick={() => {
            updateCurrentProfileId(p);
            dispatch(setCurrentProfileById({ profileId: p }));
            dispatch(setSyncData({ syncCount: 0, time: 0 }));

            window.ThreeCPM.Repository.Config.set('current', p);
            popupState.close();
          }}
          style={styles}
        >
          {menuProfile.name}
        </MenuItem>
      );
    });
  };
  return (
    <>
      <ManageProfileModal
        open={open}
        setOpen={setOpen}
        profiles={profiles}
      />

      <div
        className="sidebarOption"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...bindHover(popupState)}
      >
        <span>
          <PersonIcon />
        </span>
      </div>
      <HoverMenu
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...bindMenu(popupState)}
        style={{
          marginLeft: '45px',
        }}
      >

        {returnMenuOptions()}

        <Divider />

        <MenuItem onClick={() => { addNewProfile(); }}>Add new profile</MenuItem>
        <MenuItem onClick={() => { setOpen((prevState) => !prevState); }}>Manage profiles</MenuItem>

      </HoverMenu>
    </>
  );
};

export default ProfileSwitcher;
