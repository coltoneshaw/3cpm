import { hasProperty } from 'dot-prop';
import store from 'webapp/redux/store';
import { showAlert } from 'webapp/Components/Popups/Popups';

import {
  setData,
  setIsSyncing,
  setSyncData,
  setAutoRefresh,
} from 'webapp/redux/threeCommas/threeCommasSlice';
import { initialState } from 'webapp/redux/threeCommas/initialState';

import { updateLastSyncTime } from 'webapp/redux/config/configSlice';
import { updateBannerData } from 'webapp/Features/UpdateBanner/redux/bannerSlice';
import {
  fetchDealDataFunction, fetchPerformanceDataFunction, getActiveDealsFunction,
  fetchBotPerformanceMetrics, fetchPairPerformanceMetrics, botQuery,
  getAccountDataFunction, updateThreeCData, fetchSoData,
} from 'webapp/Features/3Commas/3Commas';
import type { ProfileType, ReservedFundsType } from 'types/config';
import type { QueryPerformanceArray } from 'types/DatabaseQueries';

// Utilities
import { logToConsole } from 'common/utils/logging';

/*
 *
 * Dispatch functions
 *
 * Each has a strict accepted object that's defined in threeCommas/initialState.
 */

const dispatchSetBotData = (data: typeof initialState.botData) => {
  store.dispatch(setData({ type: 'botData', data: data ?? initialState.botData }));
};
const dispatchSetProfitData = (data: typeof initialState.profitData) => {
  store.dispatch(setData({ type: 'profitData', data: data ?? initialState.profitData }));
};

// TODO - Need this to properly know when something is undefined.
const dispatchSetMetricsData = (data: any) => {
  store.dispatch(setData({ type: 'metricsData', data: data ?? initialState.metricsData }));
};
const dispatchSetPerformanceData = (data: typeof initialState.performanceData) => {
  store.dispatch(setData({ type: 'performanceData', data: data ?? initialState.performanceData }));
};
const dispatchSetActiveDeals = (data: typeof initialState.activeDeals) => {
  store.dispatch(setData({ type: 'activeDeals', data: data ?? initialState.activeDeals }));
};
const dispatchSetAccountData = (data: typeof initialState.accountData) => {
  store.dispatch(setData({ type: 'accountData', data: data ?? initialState.accountData }));
};
const dispatchSetBalanceData = (data: typeof initialState.balanceData) => {
  store.dispatch(setData({ type: 'balanceData', data: data ?? initialState.balanceData }));
};

/*
 *
 * Fetching data logic
 *
 * These functions are responsible for fetching the related data from the local database, then updating the current state
 */

const fetchAndStoreBotData = async (currentProfile: ProfileType, update: boolean) => {
  try {
    await botQuery(currentProfile)
      .then((result) => {
        // if (!result) return
        if (update && result.length > 0) dispatchSetBotData(result);
        const inactiveBotFunds = result.filter((b) => b.is_enabled === 1).map((r) => r.enabled_inactive_funds);
        // pull enabled_inactive_funds from the bots and add it to metrics.
        dispatchSetMetricsData({
          inactiveBotFunds: (inactiveBotFunds.length > 0) ? inactiveBotFunds.reduce((sum, funds) => sum + funds) : 0,
        });
      });
  } catch (error) {
    logToConsole('error', error);
  }
};

const fetchAndStoreProfitData = async (profileData: ProfileType) => {
  await fetchDealDataFunction(profileData)
    .then((data) => {
      if (!data) return;
      const { profitData, metrics } = data;
      dispatchSetProfitData(profitData);
      dispatchSetMetricsData(metrics);
    });
};

const fetchAndStorePerformanceData = async (profileData: ProfileType) => {
  const pairBot = async () => fetchPerformanceDataFunction(profileData, undefined)
    .then(((data: QueryPerformanceArray[]) => {
      if (!data || data.length === 0) return;
      logToConsole('debug', 'updated Performance Data!');

      dispatchSetPerformanceData({ pair_bot: data });

      const metrics = {
        boughtVolume: (data.length > 0)
          ? data
            .map((deal) => deal.bought_volume)
            .reduce((sum: number, item: number) => sum + item)
          : 0,
        totalProfit_perf: (data.length > 0)
          ? data
            .map((deal) => deal.total_profit)
            .reduce((sum: number, item: number) => sum + item)
          : 0,
        totalDeals: (data.length > 0)
          ? data
            .map((deal) => deal.number_of_deals)
            .reduce((sum: number, item: number) => sum + item)
          : 0,
      };

      dispatchSetMetricsData(metrics);
    }));

  const bot = async () => fetchBotPerformanceMetrics(profileData, undefined)
    .then(((data) => {
      if (!data) return;
      logToConsole('debug', 'getting bot performance metrics');
      dispatchSetPerformanceData({ bot: data });
    }));

  const pair = async () => fetchPairPerformanceMetrics(profileData, undefined)
    .then(((data) => {
      if (!data) return;
      logToConsole('debug', 'getting bot performance metrics');
      dispatchSetPerformanceData({ pair: data });
    }));

  const so = async () => fetchSoData(profileData, undefined)
    .then(((data) => {
      if (!data) return;
      logToConsole('debug', 'getting SO performance metrics');
      dispatchSetPerformanceData({ safety_order: data });
    }));

  await Promise.all([pairBot(), bot(), pair(), so()]);
};

const fetchAndStoreActiveDeals = async (profileData: ProfileType) => {
  await getActiveDealsFunction(profileData)
    .then((data) => {
      if (!data) return;
      logToConsole('debug', 'updated active deals and related metrics!');
      const { activeDeals, metrics } = data;

      dispatchSetActiveDeals(activeDeals);
      dispatchSetMetricsData({ ...metrics, activeDealCount: activeDeals.length });
    });
};

const fetchAndStoreAccountData = async (profileData: ProfileType) => {
  await getAccountDataFunction(profileData)
    .then((data) => {
      if (!data || !data.accountData || data.accountData.length === 0) return;
      const { accountData, balance } = data;
      dispatchSetAccountData(accountData);

      // this data may be in more spots than needed.
      dispatchSetBalanceData(balance);
      dispatchSetMetricsData(balance);
    });
};

const undefToZero = (value: number | undefined) => ((value) || 0);

const calculateMetrics = () => {
  const { config, threeCommas } = store.getState();
  const {
    maxRisk, totalBoughtVolume, position, on_orders: onOrders, inactiveBotFunds,
  } = threeCommas.metricsData;
  const reservedFundsArray = <ReservedFundsType[]>config.currentProfile.statSettings.reservedFunds;

  const localOnOrders = undefToZero(onOrders);
  const localPosition = undefToZero(position);
  const localTotalBoughtVolume = undefToZero(totalBoughtVolume);
  const localMaxRisk = undefToZero(maxRisk + inactiveBotFunds);

  // Position = available + on orders.
  const reservedFundsTotal = (reservedFundsArray.length)
    ? reservedFundsArray
      .filter((account) => account.is_enabled)
      .map((account) => Number(account.reserved_funds))
      .reduce((sum, item) => sum + item) : 0;
  const availableBankroll = localPosition - localOnOrders - reservedFundsTotal;
  const totalInDeals = localOnOrders + localTotalBoughtVolume;
  const totalBankroll = localPosition + localTotalBoughtVolume - reservedFundsTotal;

  logToConsole('error', {
    maxRiskPercent: Number(((localMaxRisk / totalBankroll) * 100).toFixed(0)),
    bankrollAvailable: Number(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
    totalBankroll,
    availableBankroll,
    totalInDeals,
    reservedFundsArray,
    totalMaxRisk: localMaxRisk,
    maxRisk,
    inactiveBotFunds,
  });

  // active sum already includes on_orders.

  // TODO - May need to remove the `toFixed` here.

  dispatchSetMetricsData({
    maxRiskPercent: Number(((localMaxRisk / totalBankroll) * 100).toFixed(0)),
    bankrollAvailable: Number(((1 - ((totalInDeals) / totalBankroll)) * 100).toFixed(0)),
    totalBankroll,
    availableBankroll,
    totalInDeals,
    reservedFundsTotal,
    totalMaxRisk: localMaxRisk,
  });
};

const updateAllDataQuery = async (profileData: ProfileType, type: string) => {
  // if the type if fullSync this will store the bot data. If we store the bot data in the redux state it will overwrite any user changes.
  await Promise.all([
    fetchAndStoreBotData(profileData, type === 'fullSync'),
    fetchAndStoreProfitData(profileData),
    fetchAndStorePerformanceData(profileData),
    fetchAndStoreActiveDeals(profileData),
    fetchAndStoreAccountData(profileData),
  ]);

  calculateMetrics();
};
/**
 *
 * Syncing Logic functions
 *
 * These are responsible for kicking off the update sequence
 *
 */

const preSyncCheck = (profileData: ProfileType) => {
  if (!profileData || hasProperty(profileData, 'profileData.apis.threeC')
    || hasProperty(profileData, 'profileData.apis.threeC.key')
    || hasProperty(profileData, 'profileData.apis.threeC.secret')
    || hasProperty(profileData, 'profileData.apis.threeC.mode')
  ) {
    logToConsole('error', 'missing api keys or required profile');
    return false;
  }

  return profileData;
};

const updateAllData = async (
  profileData: ProfileType,
  type: 'autoSync' | 'fullSync',
  offset: number = 1000,
  callback?: CallableFunction,
) => {
  if (!preSyncCheck(profileData)) return;

  const { syncOptions } = store.getState().threeCommas;
  store.dispatch(setIsSyncing(true));

  const originalTime = syncOptions.time || new Date().getTime();
  let time = originalTime;
  let syncCount = syncOptions.syncCount || 0;
  if (type === 'fullSync') {
    syncCount = 0;
    time = 0;
  }
  const options = { syncCount, time, offset };

  try {
    const lastSyncTime = await updateThreeCData(type, options, profileData);
    await updateAllDataQuery(profileData, type);
    store.dispatch(setSyncData({
      syncCount: (type === 'autoSync') ? options.syncCount + 1 : 0,
      // don't override syncOptions.time in case of a fullSync
      // because there might be a concurrent autoSync running
      time: (type === 'autoSync') ? originalTime + 15000 : originalTime,
    }));
    store.dispatch(updateLastSyncTime({ data: lastSyncTime }));
  } catch (error) {
    logToConsole('error', error);
    store.dispatch(updateBannerData({
      show: true,
      message: 'Error updating your data. Check the console for more information.',
      type: 'apiError',
    }));
  } finally {
    if (callback) callback();
    store.dispatch(setIsSyncing(false));
  }
};

const syncNewProfileData = async (editingProfile: ProfileType, offset: number = 1000) => {
  if (!preSyncCheck(editingProfile)) return null;

  store.dispatch(setIsSyncing(true));

  const options = {
    syncCount: 0, summary: false, notifications: false, time: 0, offset,
  };
  let success;
  try {
    await window.ThreeCPM.Repository.Config.profile('create', editingProfile, editingProfile.id);
    await updateThreeCData('newProfile', options, editingProfile);
    updateAllDataQuery(editingProfile, 'fullSync');

    success = true;
  } catch (error) {
    logToConsole('error', error);
    showAlert('Error updating your data. Check the console for more information.');
    success = false;
  }

  store.dispatch(setIsSyncing(false));

  return success;
};

const refreshFunction = (method: string, offset?: number) => {
  // updating the refresh function here to 15000 instead of 50. The update bar doesn't work anymore
  const refreshRate = 15000;

  if (!store.getState().threeCommas.autoRefresh) return;
  switch (method) {
    case 'stop':
      store.dispatch(setAutoRefresh(false));
      break;
    case 'run':
      setTimeout(() => {
        const profileData = preSyncCheck(store.getState().config.currentProfile);
        if (!profileData) {
          refreshFunction('stop');
          return;
        }

        if (!store.getState().threeCommas.autoRefresh) return;
        updateAllData(profileData, 'autoSync', offset, undefined)
          .then(() => {
            refreshFunction('run', offset);
          });
      }, refreshRate);
      break;
    default:
      break;
  }
};

export {
  fetchAndStoreBotData,
  fetchAndStoreProfitData,
  fetchAndStorePerformanceData,
  fetchAndStoreActiveDeals,
  fetchAndStoreAccountData,
  updateAllData,
  refreshFunction,
  updateAllDataQuery,
  syncNewProfileData,
};
