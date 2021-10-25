import React from 'react';
import { render } from 'react-dom';
import App from '@/app/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeEngine } from '@/app/Context/ThemeEngine'
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import store from '@/app/redux/store'
import { Provider } from 'react-redux'

import {
  ElectronAPIRepository,
  ElectronDealsRepository,
  ElectronDBRepository,
  ElectronConfigRepository,
  ElectronBinanceRepository
} from "@/app/Repositories/Impl/electron";
import {Repository} from '@/app/Repositories/interfaces'


interface ThreeCPMNS {
    Repository: Repository
}

declare global {
    interface Window { ThreeCPM: ThreeCPMNS; }
}
window.ThreeCPM = window.ThreeCPM || {};

// @ts-ignore - we do that to avoid having tons of ts-ignore
const mainPreload = window.mainPreload
let repo: Repository = {
    Deals: new ElectronDealsRepository(mainPreload),
    API: new ElectronAPIRepository(mainPreload),
    Binance: new ElectronBinanceRepository(mainPreload),
    Config: new ElectronConfigRepository(mainPreload),
    Database: new ElectronDBRepository(mainPreload),
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
window.ThreeCPM.Repository = repo

render(
  <React.StrictMode>
    <LocalizationProvider dateAdapter={DateAdapter}>

      <Provider store={store}>

        <ThemeEngine>
          <App />
        </ThemeEngine>
      </Provider>
    </LocalizationProvider>

  </React.StrictMode>
  ,
  document.getElementById('root')

);


