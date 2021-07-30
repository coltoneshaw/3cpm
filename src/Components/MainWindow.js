import React, { useContext, useEffect, useState } from 'react';

import { Route, Redirect } from 'react-router-dom'
import { DonatePage, BotManagerPage, TradingViewPage, SettingsPage, StatsPage } from './Pages/Index'
import { ConfigProvider, useGlobalState } from '../Context/Config';
import { DataProvider } from '../Context/DataContext';



const MainWindow = (props) => {

    const configState = useGlobalState()
    const { state: { apiData }, config } = configState;

    const [ homePage, updateHomePage ] = useState()

    useEffect(() => {
        if( apiData.key.length > 0 ||  apiData.secret.length > 0){
            updateHomePage(<Redirect to="/botmanager" />)
        } else {
            updateHomePage(<Redirect to="/settings" />)
        }
    }, [apiData])


    return (
        <ConfigProvider>
            <div className="mainWindow" >
                <Route path='/'>
                    { homePage }
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