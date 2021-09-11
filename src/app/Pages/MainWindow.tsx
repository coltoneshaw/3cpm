import React, { useEffect, useState} from 'react';
import { Route, Redirect } from 'react-router-dom'
import {
    BotPlannerPage,
    TradingViewPage,
    SettingsPage,
    StatsPage,
    ActiveDealsPage
} from '@/app/Pages/Index'

// @ts-ignore
import { version } from '#/package.json';

import CoinPriceHeader from '@/app/Features/CoinPriceHeader/CoinPriceHeader';

import { ConfigProvider, useGlobalState } from '@/app/Context/Config';
import { DataProvider } from '@/app/Context/DataContext';
import { ChangelogModal } from '@/app/Features/Index';

import { getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';


const MainWindow = () => {

    const configState = useGlobalState()
    const { state: { apiData }} = configState;

    const [homePage, updateHomePage] = useState<string>('/activeDeals')

    useEffect(() => {
        if (apiData.key !== "" && apiData.secret !== "") {
            updateHomePage(getStorageItem(storageItem.navigation.homePage) ?? '/activeDeals')
            return
        }

        updateHomePage('/settings')
    }, [apiData])


    // changelog state responsible for opening / closing the changelog
    const [openChangelog, setOpenChangelog] = useState(false);

    const handleOpenChangelog = () => {
        setOpenChangelog(true);
    };

    useEffect(() => {

        // @ts-ignore
        electron.config.get('general.version')
            .then( (versionData:string) => {
                if (versionData == undefined || versionData != version) {
                    handleOpenChangelog()
        
                    // setting to false so this does not open again
                    //@ts-ignore
                    electron.config.set('general.version', version)
                }
            })
        
    }, [])



    return (
        <ConfigProvider>
            <div className="mainWindow" >
                <CoinPriceHeader />
                <ChangelogModal open={openChangelog} setOpen={setOpenChangelog} />

                <Route path='/'>
                    <Redirect to={homePage} />
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

