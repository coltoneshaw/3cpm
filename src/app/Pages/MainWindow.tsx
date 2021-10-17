import React, { useEffect, useState , useLayoutEffect} from 'react';
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
import { useAppSelector } from '@/app/redux/hooks';
import { ChangelogModal } from '@/app/Features/Index';
import { getStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

const MainWindow = () => {

    const { currentProfile } = useAppSelector(state => state.config);


    const [homePage, updateHomePage] = useState<string>('/activeDeals')

    useLayoutEffect(() => {
        if (currentProfile.apis.threeC.key !== "" && currentProfile.apis.threeC.secret !== "") {
            updateHomePage(getStorageItem(storageItem.navigation.homePage) ?? '/activeDeals')
            return
        }

        updateHomePage('/settings')
    }, [currentProfile.apis.threeC])


    // changelog state responsible for opening / closing the changelog
    const [openChangelog, setOpenChangelog] = useState(false);

    const handleOpenChangelog = () => {
        setOpenChangelog(true);
    };

    useEffect(() => {
        window.ThreeCPM.Repository.Config.get('general.version')
            .then((versionData: string) => {
                if (versionData == undefined || versionData != version) {
                    handleOpenChangelog()

                    // setting to false so this does not open again
                    //@ts-ignore
                    window.ThreeCPM.Repository.Config.set('general.version', version)
                }
            })

    }, [])



    return (
        <div className="mainWindow" >
            <CoinPriceHeader />
            <ChangelogModal open={openChangelog} setOpen={setOpenChangelog} />

            <Route path='/'>
                <Redirect to={homePage} />
            </Route>

            <Route exact path="/botplanner" render={() => <BotPlannerPage key="botPlannerPage" />} />
            <Route exact path="/stats" render={() => <StatsPage key="statsPage" />} />
            <Route exact path="/settings" render={() => <SettingsPage key="settingsPage" />} />
            <Route exact path="/activeDeals" render={() => <ActiveDealsPage key="activeDealsPage" />} />

            <Route exact path="/backtesting" render={() => <TradingViewPage key="tradingViewPage" />} />

        </div>

    )
}


export default MainWindow;

