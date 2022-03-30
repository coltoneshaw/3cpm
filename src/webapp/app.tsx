import React, { useEffect, useLayoutEffect, useState } from 'react';

import './App.global.scss';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Components/Sidebar/Sidebar';
import { MainWindow } from '@/webapp/Pages/Index';
import { logToConsole } from '@/utils/logging';

import { useThemeProvidor } from './Context/ThemeEngine';

import UpdateBanner from './Features/UpdateBanner/UpdateBanner';

import { useAppSelector, useAppDispatch } from '@/webapp/redux/hooks';
import { updateConfig } from '@/webapp/redux/config/configActions';
import { updateAllDataQuery } from './redux/threeCommas/Actions';

// @ts-ignore
import { version } from '#/package.json';
import {
  updateBannerData,
} from '@/webapp/Features/UpdateBanner/redux/bannerSlice';

const App = () => {
  const themeEngine = useThemeProvidor();
  const currentProfile = useAppSelector((state) => state.config.currentProfile);
  const dispatch = useAppDispatch();
  const [profile, updateLocalProfile] = useState(() => currentProfile);
  const { styles } = themeEngine;

  useEffect(() => {
    updateConfig();
  }, []);

  useEffect(() => {
    window.ThreeCPM.Repository.Pm.versions()
      .then((versionData) => {
        if (!versionData || !versionData[0]) return;
        const currentVersion = versionData
          .filter((release: any) => !release.prerelease)[0];
        if (`v${version}` !== currentVersion.tag_name) {
          dispatch(updateBannerData({
            show: true,
            message: currentVersion.tag_name,
            type: 'updateVersion',
          }));
        }
      });
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
