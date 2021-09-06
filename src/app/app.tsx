import React, { CSSProperties } from 'react';

import './App.global.scss';
import Sidebar from './Components/Sidebar/Sidebar';
import { HashRouter } from 'react-router-dom'

import { MainWindow } from "@/app/Pages/Index"

import { ConfigProvider } from './Context/Config';
import { useThemeProvidor } from './Context/ThemeEngine';

const App = () => {
  // const classes = useStyles();

  const themeEngine = useThemeProvidor();
  const { styles } = themeEngine

  return (
    <HashRouter>
      <div style={styles} className="rootDiv">
        <ConfigProvider>

            <Sidebar />
            <MainWindow />

        </ConfigProvider>

      </div>




    </HashRouter>
  )
}

export default App;
