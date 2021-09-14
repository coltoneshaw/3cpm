import React, {useEffect} from 'react';

import './App.global.scss';
import Sidebar from './Components/Sidebar/Sidebar';
import { HashRouter } from 'react-router-dom'

import { MainWindow } from "@/app/Pages/Index"

// import { ConfigProvider } from './Context/Config';
import { useThemeProvidor } from './Context/ThemeEngine';

import UpdateBanner from './Features/UpdateBanner/UpdateBanner';


import { useAppDispatch } from '@/app/redux/hooks';
import { updateConfig } from '@/app/redux/configActions';

const App = () => {
  // const classes = useStyles();

  const themeEngine = useThemeProvidor();
  const { styles } = themeEngine
  
  const dispatch = useAppDispatch()
  useEffect(() => {
    updateConfig();
  }, [dispatch])

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
