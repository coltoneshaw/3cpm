import React from 'react';
import { render } from 'react-dom';
import App from '@/app/app';
import { ThemeEngine } from '@/app/Context/ThemeEngine'

import store from '@/app/redux/store'
import { Provider } from 'react-redux'

render(
  <React.StrictMode>
    <Provider store={store}>

      <ThemeEngine>
        <App />
      </ThemeEngine>
    </Provider>
  </React.StrictMode>
  ,
  document.getElementById('root')

);


