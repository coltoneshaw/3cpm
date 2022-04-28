import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Route, useNavigate, Routes } from 'react-router-dom';
import {
  BotPlannerPage,
  TradingViewPage,
  SettingsPage,
  StatsPage,
  ActiveDealsPage,
  DailyStats,
} from 'webapp/Pages/Index';

import CoinPriceHeader from 'webapp/Features/CoinPriceHeader/CoinPriceHeader';
import { useAppSelector } from 'webapp/redux/hooks';
import { ChangelogModal } from 'webapp/Features/Index';
import { getStorageItem, storageItem } from 'webapp/Features/LocalStorage/LocalStorage';
import { logToConsole } from 'common/utils/logging';

import { version } from '#/package.json';

const MainWindow = () => {
  const navigate = useNavigate();
  const { currentProfile } = useAppSelector((state) => state.config);

  const [homePage, updateHomePage] = useState<string>('/activeDeals');

  useLayoutEffect(() => {
    logToConsole('debug', homePage);
    if (currentProfile.apis.threeC.key !== '' && currentProfile.apis.threeC.secret !== '') {
      updateHomePage(getStorageItem(storageItem.navigation.homePage) ?? '/activeDeals');
      return;
    }

    updateHomePage('/settings');
  }, [currentProfile.apis.threeC]);

  useEffect(() => {
    navigate(homePage);
  }, []);

  // changelog state responsible for opening / closing the changelog
  const [openChangelog, setOpenChangelog] = useState(false);

  const handleOpenChangelog = () => {
    setOpenChangelog(true);
  };

  useEffect(() => {
    window.ThreeCPM.Repository.Config.get('general.version')
      .then((versionData: string) => {
        if (versionData === undefined || versionData !== version) {
          handleOpenChangelog();

          // setting to false so this does not open again
          window.ThreeCPM.Repository.Config.set('general.version', version);
        }
      });
  }, []);

  return (
    <div className="mainWindow">
      <CoinPriceHeader />
      <ChangelogModal open={openChangelog} setOpen={setOpenChangelog} />
      <Routes>
        <Route path="/botplanner" element={<BotPlannerPage key="botPlannerPage" />} />
        <Route path="/stats" element={<StatsPage key="statsPage" />} />
        <Route path="/settings" element={<SettingsPage key="settingsPage" />} />
        <Route path="/activeDeals" element={<ActiveDealsPage key="activeDealsPage" />} />
        <Route path="/dailystats" element={<DailyStats key="dailyStats" />} />
        <Route path="/backtesting" element={<TradingViewPage key="tradingViewPage" />} />
        {/* <Route path="*" element={<SettingsPage key="settingsPage" />} /> */}

      </Routes>

    </div>

  );
};

export default MainWindow;
