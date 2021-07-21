import React, { PureComponent } from 'react';
import { Provider } from './Context';

import './App.scss';
import Sidebar from './Components/Sidebar/Sidebar';

import { HashRouter, Route, Redirect } from 'react-router-dom'

import { createTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';

import BotManager from './Components/BotManager/BotManager';
import Settings from './Components/Settings/Settings';
import Donate from './Components/Donate/Donate';
import Stats from './Components/Stats/Stats';
import Backtesting from './Components/Backtesting/Backtesting';

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




class App extends PureComponent {

  state = {
    config: ''
  }

  config = async () => {
    const config = await electron.config.get()
    this.setState({ config })
  }

  componentDidMount(){
    this.config()
  }



  render() {

    return (
      <HashRouter>
        <ThemeProvider theme={theme}>
        {/* Need to update this to properly pass down the config from the app to the components.*/}
          <Provider value={{
            actions: {
              config: {
                set: '',
              },
              classes: this.props.classes
            }
          }}>
            <Sidebar />
            <Route path='/'>
              <Redirect to="/botmanager" />
            </Route>
            <Route exact path="/botmanager" render={() => <BotManager />} />
            <Route exact path="/settings" render={() => <Settings config={ this.state.config } />} />
            <Route exact path="/donate" render={() => <Donate />} />
            <Route exact path="/stats" render={() => <Stats config={ this.state.config } />} />
            <Route exact path="/backtesting" render={() => <Backtesting />} />
          </Provider>

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
