import { useEffect, useState } from 'react';
import moment from 'moment';
import { isValid } from 'date-fns';
import { useAppSelector } from '@/webapp/redux/hooks';

import type { ProfileType } from '@/types/config';
import {
  queryDealByPairByDay, queryDealByBotByDay, queryProfitDataByDay, getTotalProfit, getActiveDealsFunction,
} from '@/webapp/Pages/DailyStats/Components';
import { ActiveDeals, ProfitArray } from '@/types/DatabaseQueries';
import { BotQueryDealByDayReturn, QueryDealByPairByDayReturn } from './Components/3Commas/type_dailydashboard';

const oldestYear = 2015;

export const daysInMilli = {
  thirty: 2592000000,
  sixty: 5184000000,
};

const blankDashboard = {
  pairDay: <QueryDealByPairByDayReturn[] | []>[],
  botDay: <BotQueryDealByDayReturn[] | []>[],
  activeDeals: {
    activeDeals: <ActiveDeals[] | []>[],
    metrics: {
      totalBoughtVolume: 0,
      maxRisk: 0,
    },
  },
  totalProfit: 0,
  dailyProfit: {
    profitData: <ProfitArray[] | []>[],
    metrics: {
      totalProfit: 0,
      averageDailyProfit: 0,
      averageDealHours: 0,
      totalClosedDeals: 0,
      totalDealHours: 0,
      todayProfit: 0,
    },
    priors: {
      month: 0,
      week: 0,
      day: 0,
    },
    current: {
      month: 0,
      week: 0,
      day: 0,
    },
  },
};

const returnTodayUtcEnd = (date: Date) => moment.utc(date).endOf('day').valueOf();

type FiltersType = {
  accounts: number[] | [],
  currency: string[] | string
};

const oneMillisecondDay = 86400000;

export const queryDayDashboard = async (utcEndDate: number, profileData: ProfileType, filters: FiltersType) => {
  // removing a day, then adding a millisecond to round to the beginning of the UTC day
  const utcStartDate = utcEndDate - oneMillisecondDay + 1;
  const utcDateRange = { utcEndDate, utcStartDate };
  const [pairDay, botDay, dailyProfit, totalProfit, activeDeals] = await Promise.all([
    queryDealByPairByDay(profileData, utcDateRange, filters),
    queryDealByBotByDay(profileData, utcDateRange, filters),
    queryProfitDataByDay(profileData, utcDateRange, filters),
    getTotalProfit(profileData, filters),
    getActiveDealsFunction(profileData, filters),
  ]);
  return {
    pairDay, botDay, dailyProfit, totalProfit, activeDeals,
  };
};

export const useDailyState = () => {
  const { currentProfile, config } = useAppSelector((state) => state.config);

  const { defaultCurrency } = currentProfile.general;
  const { reservedFunds } = currentProfile.statSettings;

  const [value, setValue] = useState<Date | null>(() => new Date());
  const [utcEndDate, setUtcEndDate] = useState<number>(() => returnTodayUtcEnd(new Date()));
  const [queryStats, updateQueryStats] = useState(blankDashboard);

  const [currency, updateCurrency] = useState(defaultCurrency);
  const [accounts, updateAccounts] = useState(reservedFunds);
  const handleChange = (date: Date | null) => setValue(date);
  useEffect(() => {
    if (value && isValid(value) && value.getFullYear() > oldestYear) setUtcEndDate(returnTodayUtcEnd(value));
  }, [value]);

  // take the UTC date and pass it into a database query to pull metrics.
  // should these get stored in redux? Maybe after they're queried

  useEffect(() => {
    // temp fix for a refresh creating a new database with the default config ID
    if (config.current === 'default') return;
    const currencyString = (currency) ? currency.map((b: string) => `'${b}'`) : '';
    const accountIdString = accounts.map((a) => a.id);
    queryDayDashboard(utcEndDate, currentProfile, { currency: currencyString, accounts: accountIdString })
      .then((data) => updateQueryStats(data));
  }, [utcEndDate, currency, accounts]);

  return {
    queryStats,
    value,
    handleChange,
    defaultCurrency: currentProfile.general.defaultCurrency,
    reservedFunds: currentProfile.statSettings.reservedFunds,
    updateCurrency,
    updateAccounts,
  };
};
