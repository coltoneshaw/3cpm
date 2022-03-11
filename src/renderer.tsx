import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

// import { ThemeProvider } from '@material-ui/core/styles';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { ThemeEngine } from '@/app/Context/ThemeEngine';

import App from '@/app/app';

import store from '@/app/redux/store';

import {
  ElectronAPIRepository,
  ElectronDealsRepository,
  ElectronDBRepository,
  ElectronConfigRepository,
} from '@/app/Repositories/Impl/electron';

import BaseBinanceRepository from '@/app/Repositories/Impl/Binance';
import {
  BaseGeneralRepository,
  BasePmRepository,
} from '@/app/Repositories/Impl/General';

import { Repository } from '@/app/Repositories/interfaces';

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

render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={DateAdapter}>

      <Provider store={store}>

        <ThemeEngine>
          <App />
        </ThemeEngine>
      </Provider>
    </LocalizationProvider>

  </React.StrictMode>,
  document.getElementById('root'),

);
