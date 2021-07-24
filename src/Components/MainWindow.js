import React, { useContext } from 'react';

import { Route, Redirect } from 'react-router-dom'
import { DonatePage, BotManagerPage, TradingViewPage, SettingsPage, StatsPage } from './Pages/Index'
import { ConfigProvider } from '../Context/Config';



const MainWindow = (props) => {

    return (
        <ConfigProvider>
            <div className="mainWindow" >
                <Route path='/'>
                    <Redirect to="/botmanager" />
                </Route>
                <Route exact path="/botmanager" render={() => <BotManagerPage classes={props.classes} />} />
                <Route exact path="/settings" render={() => <SettingsPage />} />
                <Route exact path="/donate" render={() => <DonatePage />} />
                <Route exact path="/stats" render={() => <StatsPage  />} />
                <Route exact path="/backtesting" render={() => <TradingViewPage />} />
            </div>
        </ConfigProvider>

    )
}


export default MainWindow;