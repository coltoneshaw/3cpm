import React from 'react';
import { render } from 'react-dom';
import App from '@/app/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeEngine } from '@/app/Context/ThemeEngine'
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import store from '@/app/redux/store'
import { Provider } from 'react-redux'


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


