import React, { useContext, useEffect, useState, FC, ReactElement } from 'react';

import { Route, Redirect } from 'react-router-dom'
import { DonatePage, BotPlannerPage, TradingViewPage, SettingsPage, StatsPage, ActiveDealsPage } from './Pages/Index'
import { ConfigProvider, useGlobalState } from '../Context/Config';
import { DataProvider } from '../Context/DataContext';

import ToastNotifcation from '@/app/Components/ToastNotification'


const MainWindow = () => {

    const configState = useGlobalState()
    const { state: { apiData }, config } = configState;

    const [homePage, updateHomePage] = useState<ReactElement>()

    useEffect(() => {
        if (apiData.key !== "" || apiData.secret !== "") {
            updateHomePage(<Redirect to="/activeDeals" />)
        } else {
            updateHomePage(<Redirect to="/settings" />)
        }
    }, [apiData])



    return (
        <ConfigProvider>
            <div className="mainWindow" >
                <Route path='/'>
                    {homePage}
                </Route>

                <DataProvider>
                    <Route exact path="/botplanner" render={() => <BotPlannerPage key="botPlannerPage" />} />
                    <Route exact path="/stats" render={() => <StatsPage key="statsPage" />} />
                    <Route exact path="/settings" render={() => <SettingsPage key="settingsPage" />} />
                    <Route exact path="/activeDeals" render={() => <ActiveDealsPage key="activeDealsPage" />} />

                </DataProvider>

                <Route exact path="/donate" render={() => <DonatePage  key="donatePage"/>} />
                <Route exact path="/backtesting" render={() => <TradingViewPage  key="tradingViewPage"/>} />

            </div>


        </ConfigProvider>

    )
}


export default MainWindow;

