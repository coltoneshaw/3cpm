import React, { useContext } from 'react';

import { Route, Redirect } from 'react-router-dom'
import { DonatePage, BotManagerPage, TradingViewPage, SettingsPage, StatsPage } from './Pages/Index'
import { ConfigProvider } from '../Context/Config';
import { DataProvider } from '../Context/DataContext';


const MainWindow = (props) => {

    return (
        <ConfigProvider>
            <div className="mainWindow" >
                <Route path='/'>
                    <Redirect to="/botmanager" />
                </Route>

                <DataProvider>
                    <Route exact path="/botmanager" render={() => <BotManagerPage classes={props.classes} />} />
                    <Route exact path="/stats" render={() => <StatsPage  />} />
                </DataProvider>
                
                <Route exact path="/settings" render={() => <SettingsPage />} />
                <Route exact path="/donate" render={() => <DonatePage />} />
                <Route exact path="/backtesting" render={() => <TradingViewPage />} />
            </div>
        </ConfigProvider>

    )
}


export default MainWindow;