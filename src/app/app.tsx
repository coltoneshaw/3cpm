import React, { CSSProperties } from 'react';

import './App.global.scss';
import Sidebar from './Components/Sidebar/Sidebar';

import { HashRouter } from 'react-router-dom'

import MainWindow from "./Components/MainWindow"

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

            {/* Need to update this to properly pass down the config from the app to the components.*/}

            <Sidebar />
            <MainWindow />
          </ConfigProvider>

        </div>




    </HashRouter>
  )
}

export default App;
