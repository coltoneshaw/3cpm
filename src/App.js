import React, { PureComponent } from 'react';

import './App.scss';
import Sidebar from './Components/Sidebar/Sidebar';

import { HashRouter } from 'react-router-dom'

import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import MainWindow from "./Components/MainWindow"

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
    },
  }),
);


class App extends PureComponent {

  render() {

    return (
      <HashRouter>
        <ThemeProvider theme={theme}>
        {/* Need to update this to properly pass down the config from the app to the components.*/}

            <Sidebar />
            <MainWindow classes={this.props.classes}/>
            
        </ThemeProvider>
      </HashRouter>

    );
  }


}

const AppClass = () => {
  const classes = useStyles();
  console.log(classes)
  return (
      <App classes={classes} />
  )
}

export default AppClass;
