import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

// import { ThemeProvider } from '@material-ui/core/styles';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { ThemeEngine } from 'webapp/Context/ThemeEngine';

import App from 'webapp/app';

import store from 'webapp/redux/store';

import {
  ElectronAPIRepository,
  ElectronDealsRepository,
  ElectronDBRepository,
  ElectronConfigRepository,
} from 'common/repositories/Impl/electron';

import BaseBinanceRepository from 'common/repositories/Impl/Binance';
import {
  BaseGeneralRepository,
  BasePmRepository,
} from 'common/repositories/Impl/General';

import { Repository } from 'common/repositories/interfaces';

interface ThreeCPMNS {
  Repository: Repository
}

declare global {
  interface Window {
    ThreeCPM: ThreeCPMNS;
  }
}

window.ThreeCPM = window.ThreeCPM || {};
const { mainPreload } = window;

const repo: Repository = {
  Deals: new ElectronDealsRepository(mainPreload),
  API: new ElectronAPIRepository(mainPreload),
  Config: new ElectronConfigRepository(mainPreload),
  Database: new ElectronDBRepository(mainPreload),
  Binance: new BaseBinanceRepository(mainPreload),
  General: new BaseGeneralRepository(mainPreload),
  Pm: new BasePmRepository(mainPreload),
};

/*
 * For the future we could have something like this:
 */
// if (electrn) {
//     repo = {
//         API: new ElectronAPIRepository(electrn),
//        ...
//     }
// }
// ...

// TODO: find a more react friendly way of making Repository accessible
window.ThreeCPM.Repository = repo;
const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Provider store={store}>
        <ThemeEngine>
          <App />
        </ThemeEngine>
      </Provider>
    </LocalizationProvider>
  </React.StrictMode>,
);
