import React from 'react';
import './App.scss';
import Sidebar from './Components/Sidebar/Sidebar';

import BotManager from './Components/BotManager/BotManager';
import Settings from './Components/Settings/Settings';
import Donate from './Components/Donate/Donate';
import Stats from './Components/Stats/Stats';
import Backtesting from './Components/Backtesting/Backtesting';


import { HashRouter, Route, Redirect } from 'react-router-dom'


import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'MuiDataGrid': {
          border: 'none',
        },
      },
    },
  },
});

const useStyles = makeStyles(
  (theme) => ({
    root: {
      border: 0,
      padding: 0,
      fontFamily: 'Open Sans',
      minWidth: 1000,
      overflowX: "auto",
      overflowY: "scroll",
      '& .MuiDataGrid-iconSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 700,
        paddingLeft: 20,
        overflow: "visible",
        textOverflow: "initial"
      },
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        textOverflow: "initial",
      },
    },
  }),
);

function App() {
  const classes = useStyles();



  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <Sidebar />
        <Route path='/'>
          <Redirect to="/botmanager" />
        </Route>
        <Route exact path="/botmanager" render={() => <BotManager classes={classes} />} />
        <Route exact path="/settings" render={() => <Settings />} />
        <Route exact path="/donate" render={() => <Donate />} />
        <Route exact path="/stats" render={() => <Stats />} />
        <Route exact path="/backtesting" render={() => <Backtesting />} />
      </ThemeProvider>
    </HashRouter>

  );
}

export default App;
