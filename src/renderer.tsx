import React from 'react';
import { render } from 'react-dom';
import App from '@/app/app';
import { ThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import { ThemeEngine } from '@/app/Context/ThemeEngine'

import store from '@/app/redux/store'
import { Provider } from 'react-redux'

const theme = createMuiTheme();


const useStyles = makeStyles((theme) => {
  root: {
    // some css that access to theme
  }
});

render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>

        <ThemeEngine>
          <App />
        </ThemeEngine>
      </Provider>
    </ThemeProvider>;
  </React.StrictMode>
  ,
  document.getElementById('root')

);


