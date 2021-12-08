import React, { useEffect, useLayoutEffect, useState } from 'react';

import './App.global.scss';
import Sidebar from './Components/Sidebar/Sidebar';
import { HashRouter } from 'react-router-dom'
import { MainWindow } from "@/app/Pages/Index"

import { useThemeProvidor } from './Context/ThemeEngine';

import UpdateBanner from './Features/UpdateBanner/UpdateBanner';


import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { updateConfig } from '@/app/redux/config/configActions';
import { updateAllDataQuery } from './redux/threeCommas/Actions';

// @ts-ignore
import { version } from '#/package.json';
import { updateBannerData } from '@/app/Features/UpdateBanner/redux/bannerSlice';

const App = () => {

  const themeEngine = useThemeProvidor();
  const currentProfile = useAppSelector(state => state.config.currentProfile)
  const dispatch = useAppDispatch()
  const [profile, updateLocalProfile] = useState(() => currentProfile)
  const { styles } = themeEngine

  useEffect(() => {
    updateConfig();
  }, []);

  useEffect(() => {
    window.ThreeCPM.Repository.Pm.versions()
      .then(versionData => {
        if (!versionData || !versionData[0]) return
        const currentVersion = versionData.filter((release: any) => !release.prerelease)[0]
        if ("v" + version != currentVersion.tag_name) {
          dispatch(updateBannerData({ show: true, message: currentVersion.tag_name, type: 'updateVersion' }))
        }
      })
  }, [])

  useLayoutEffect(() => {
    if (currentProfile.id == profile.id) return
    if (currentProfile && currentProfile?.statSettings?.reservedFunds.filter(a => a.is_enabled).length > 0) {
      updateAllDataQuery(currentProfile, 'fullSync');
      console.log('Changing to a new profile')
      updateLocalProfile(currentProfile)
    }

  }, [currentProfile])


  return (
    <HashRouter>
      <div style={styles} className="rootDiv">
        <UpdateBanner />
        <Sidebar />
        <MainWindow />
      </div>
    </HashRouter>
  )
}

export default App;
