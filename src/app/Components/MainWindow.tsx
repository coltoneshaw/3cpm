import React, { useContext, useEffect, useState, FC, ReactElement } from 'react';

import { Route, Redirect } from 'react-router-dom'
import { DonatePage, BotPlannerPage, TradingViewPage, SettingsPage, StatsPage } from './Pages/Index'
import { ConfigProvider, useGlobalState } from '../Context/Config';
import { DataProvider } from '../Context/DataContext';

import ToastNotifcation from '@/app/Components/ToastNotification'


const MainWindow = (props: { classes: object }) => {

    const configState = useGlobalState()
    const { state: { apiData }, config } = configState;

    const [homePage, updateHomePage] = useState<ReactElement>()

    useEffect(() => {
        if (apiData.key.length > 0 || apiData.secret.length > 0) {
            updateHomePage(<Redirect to="/botplanner" />)
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
                    <Route exact path="/botplanner" render={() => <BotPlannerPage classes={props.classes} />} />
                    <Route exact path="/stats" render={() => <StatsPage />} />
                </DataProvider>

                <Route exact path="/settings" render={() => <SettingsPage />} />
                <Route exact path="/donate" render={() => <DonatePage />} />
                <Route exact path="/backtesting" render={() => <TradingViewPage />} />

            </div>


        </ConfigProvider>

    )
}


export default MainWindow;