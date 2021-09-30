import React, {useEffect, useState} from 'react';

import './App.global.scss';
import Sidebar from './Components/Sidebar/Sidebar';
import { HashRouter } from 'react-router-dom'

import { MainWindow } from "@/app/Pages/Index"

// import { ConfigProvider } from './Context/Config';
import { useThemeProvidor } from './Context/ThemeEngine';

import UpdateBanner from './Features/UpdateBanner/UpdateBanner';


import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { updateConfig } from '@/app/redux/configActions';
import { updateAllDataQuery } from './redux/threeCommas/Actions';

const App = () => {
  // const classes = useStyles();

  const themeEngine = useThemeProvidor();
  const {currentProfile} = useAppSelector(state => state.config)
  // const [updated, updateUpdated] = useState(() => false)
  const [profile, updateLocalProfile] = useState( () => currentProfile)
  const { styles } = themeEngine
  
  const dispatch = useAppDispatch()
  useEffect(() => {
    updateConfig();

  }, [dispatch]);

  // useEffect(() => {
  //   console.log('updating profile');
  //   console.log(currentProfile)
  // }, [currentProfile]);

  useEffect(() => {
    // if(updated) return
    if(currentProfile.id == profile.id) return
    
    if(currentProfile && currentProfile.statSettings && currentProfile.statSettings.reservedFunds.filter(a => a.is_enabled).length > 0) {
      updateAllDataQuery(currentProfile, 'fullSync');
      console.log('Changing to a new profile')
      // updateUpdated(true)
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
