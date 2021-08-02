import React from 'react';

import './App.global.scss';
import Sidebar from './Components/Sidebar/Sidebar';

import { HashRouter } from 'react-router-dom'

import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import MainWindow from "./Components/MainWindow"

import { ConfigProvider } from './Context/Config';

// import Settings from './Components/Settings/Settings';
// import Backtesting from './Components/Pages/TradingView/TradingView';

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
      minWidth: 1500,
      overflowX: "auto",
      overflowY: "scroll",
      '& .MuiDataGrid-iconSeparator': {
        display: 'none',
      },
      '& .MuiDataGrid-columnHeaderTitle': {
        fontWeight: 700,

        overflow: "visible",
        textOverflow: "initial",
        whiteSpace: "pre-wrap",
        wordWrap: "break-word",
        lineHeight: "1.1em"
      },
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        textOverflow: "initial",
        padding: 0
      },
      '& .MuiDataGrid-columnHeader': {
        padding: 0
      },
      '& .MuiDataGrid-iconButtonContainer': {
        display: "none"
      },
      '& .MuiDataGrid-columnHeaderWrapper': {
        overflow: "visible"
      },
      '& .MuiDataGrid-row.Mui-even': {
        backgroundColor: '#DEE3EC'
      }
    },
  }),
);

const App = () => {
  const classes = useStyles();
  return (
    <HashRouter>
      <ThemeProvider theme={theme}>
        <ConfigProvider>

          {/* Need to update this to properly pass down the config from the app to the components.*/}

          <Sidebar />
          <MainWindow classes={classes} />
        </ConfigProvider>

      </ThemeProvider>
    </HashRouter>
  )
}

export default App;
