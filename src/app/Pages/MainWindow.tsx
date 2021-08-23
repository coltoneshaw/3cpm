import React, { useContext, useEffect, useState, FC, ReactElement } from 'react';
import { Route, Redirect } from 'react-router-dom'
import { 
    BotPlannerPage, 
    TradingViewPage, 
    SettingsPage, 
    StatsPage, 
    ActiveDealsPage
 } from '@/app/Pages/Index'
 
import { ConfigProvider, useGlobalState } from '@/app/Context/Config';
import { DataProvider } from '@/app/Context/DataContext';

import { ChangelogModal } from '@/app/Features/Index';

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


    // changelog state responsible for opening / closing the changelog
    const [openChangelog, setOpenChangelog] = useState(false);

    const handleOpenChangelog = () => {
        setOpenChangelog(true);
    };

    useEffect( () => {
        if(config.general.updated) {
            handleOpenChangelog()

            // setting to false so this does not open again
            //@ts-ignore
            electron.config.set('general.updated', false)
        }
    }, [config.general.updated])



    return (
        <ConfigProvider>
            <div className="mainWindow" >
                <ChangelogModal open={openChangelog} setOpen={setOpenChangelog} />

                <Route path='/'>
                    {homePage}
                </Route>

                <DataProvider>
                    <Route exact path="/botplanner" render={() => <BotPlannerPage key="botPlannerPage" />} />
                    <Route exact path="/stats" render={() => <StatsPage key="statsPage" />} />
                    <Route exact path="/settings" render={() => <SettingsPage key="settingsPage" />} />
                    <Route exact path="/activeDeals" render={() => <ActiveDealsPage key="activeDealsPage" />} />
                </DataProvider>

                <Route exact path="/backtesting" render={() => <TradingViewPage key="tradingViewPage" />} />

            </div>


        </ConfigProvider>

    )
}


export default MainWindow;

