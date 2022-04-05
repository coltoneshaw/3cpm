import React, { useEffect, useLayoutEffect, useState } from 'react';

import './App.global.scss';
import { MemoryRouter } from 'react-router-dom';
import { MainWindow } from 'webapp/Pages/Index';
import { logToConsole } from 'common/utils/logging';
import { useAppSelector } from 'webapp/redux/hooks';
import { updateConfig } from 'webapp/redux/config/configActions';
import Sidebar from './Components/Sidebar/Sidebar';

import { useThemeProvidor } from './Context/ThemeEngine';

import UpdateBanner from './Features/UpdateBanner/UpdateBanner';

import { updateAllDataQuery } from './redux/threeCommas/Actions';
import fetchVersions from './Features/UpdateBanner/fetchVersion';

const App = () => {
  const themeEngine = useThemeProvidor();
  const currentProfile = useAppSelector((state) => state.config.currentProfile);
  const [profile, updateLocalProfile] = useState(() => currentProfile);
  const { styles } = themeEngine;

  useEffect(() => {
    updateConfig();
    fetchVersions();
  }, []);
  useLayoutEffect(() => {
    if (currentProfile.id === profile.id) return;
    if (
      currentProfile
      && currentProfile?.statSettings?.reservedFunds
        .filter((a) => a.is_enabled).length > 0) {
      updateAllDataQuery(currentProfile, 'fullSync');
      logToConsole('debug', 'Changing to a new profile');
      updateLocalProfile(currentProfile);
    }
  }, [currentProfile]);

  return (
    <MemoryRouter>
      <div style={styles} className="rootDiv">
        <UpdateBanner />
        <Sidebar />
        <MainWindow />
      </div>
    </MemoryRouter>
  );
};

export default App;
