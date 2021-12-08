import React, {useEffect, useLayoutEffect, useState} from 'react';

import './App.global.scss';
import Sidebar from './Components/Sidebar/Sidebar';
import { HashRouter } from 'react-router-dom'

import { MainWindow } from "@/app/Pages/Index"

import { useThemeProvidor } from './Context/ThemeEngine';

import UpdateBanner from './Features/UpdateBanner/UpdateBanner';


import { useAppSelector } from '@/app/redux/hooks';
import { updateConfig } from '@/app/redux/config/configActions';
import { updateAllDataQuery } from './redux/threeCommas/Actions';

const App = () => {

  const themeEngine = useThemeProvidor();
  const currentProfile = useAppSelector(state => state.config.currentProfile)
  const [profile, updateLocalProfile] = useState( () => currentProfile)
  const { styles } = themeEngine
  
  useEffect(() => {
    updateConfig();
  }, []);

  useLayoutEffect(() => {
    if(currentProfile.id == profile.id) return
    if(currentProfile && currentProfile?.statSettings?.reservedFunds.filter(a => a.is_enabled).length > 0) {
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
