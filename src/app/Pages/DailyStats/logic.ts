import { useEffect, useState } from "react";
import moment from "moment";
import { isValid } from 'date-fns'
import { useAppSelector } from '@/app/redux/hooks';


import type { Type_Profile } from '@/types/config';
import { queryDealByPairByDay, queryDealByBotByDay, queryProfitDataByDay, getTotalProfit, getActiveDealsFunction } from "@/app/Pages/DailyStats/Components";
import { Type_ActiveDeals, Type_Profit } from "@/types/3Commas";
const oldestYear = 2015

export const daysInMilli = {
    thirty: 2592000000,
    sixty: 5184000000
};



type blankDashboard = {
    pairDay: queryDealByPairByDayReturn[] | [],
    botDay: botQueryDealByDayReturn[] | [],
    activeDeals: {
        activeDeals: Type_ActiveDeals[] | [],
        metrics: {
            totalBoughtVolume: number,
            maxRisk: number
        }
    },
    totalProfit: number,
    dailyProfit: {
        profitData: Type_Profit[] | [],
        metrics: {
            totalProfit: number;
            averageDailyProfit: number;
            averageDealHours: number;
            totalClosedDeals: number;
            totalDealHours: number;
            todayProfit: number
        },
        priors: {
            month: number,
            week: number,
            day: number
        },
        current: {
            month: number,
            week: number,
            day: number
        }
    }

}
const blankDashboard: blankDashboard = {
    pairDay: [],
    botDay: [],
    activeDeals: {
        activeDeals: [],
        metrics: {
            totalBoughtVolume: 0,
            maxRisk: 0
        }
    },
    totalProfit: 0,
    dailyProfit: {
        profitData: [],
        metrics: {
            totalProfit: 0,
            averageDailyProfit: 0,
            averageDealHours: 0,
            totalClosedDeals: 0,
            totalDealHours: 0,
            todayProfit: 0
        },
        priors: {
            month: 0,
            week: 0,
            day: 0
        },
        current: {
            month: 0,
            week: 0,
            day: 0
        }
    }
}

const returnTodayUtcEnd = (date: Date) => {
    // if (!date) date = new Date();
    return moment.utc(date)
        .subtract(date.getTimezoneOffset(), "minutes")
        .endOf("day")
        .valueOf()
}


type filters = {
    accounts: number[] | [],
    currency: string[] | string
}


export const queryDayDashboard = async (utcEndDate: number, profileData: Type_Profile, filters: filters) => {
    const utcStartDate = utcEndDate - 86399999
    const utcDateRange = { utcEndDate, utcStartDate }

    return {
        pairDay: await queryDealByPairByDay(profileData, utcDateRange, filters),
        botDay: await queryDealByBotByDay(profileData, utcDateRange, filters),
        dailyProfit: await queryProfitDataByDay(profileData, utcDateRange, filters),
        totalProfit: await getTotalProfit(profileData, filters),
        activeDeals: await getActiveDealsFunction(profileData, filters)
    }

}

export const useDailyState = () => {
    const { currentProfile } = useAppSelector(state => state.config);

    const defaultCurrency = currentProfile.general.defaultCurrency;
    const reservedFunds = currentProfile.statSettings.reservedFunds

    const [value, setValue] = useState<Date | null>();
    const [utcEndDate, setutcEndDate] = useState<number>(() => returnTodayUtcEnd(new Date()));
    const [queryStats, updateQueryStats] = useState(blankDashboard);

    const [currency, updateCurrency] = useState(defaultCurrency);
    const [accounts, updateAccounts] = useState(reservedFunds);

    const handleChange = (date: Date | null) => setValue(date);
    useEffect(() => {
        if (value && isValid(value) && value.getFullYear() > oldestYear) setutcEndDate(returnTodayUtcEnd(value))
    }, [value])

    // take the UTC date and pass it into a database query to pull metrics.
    // should these get stored in redux? Maybe after they're queried

    useEffect(() => {
        const currencyString = (currency) ? currency.map((b: string) => "'" + b + "'") : ""
        const accountIdString = accounts.map(a => a.id)
        queryDayDashboard(utcEndDate, currentProfile, { currency: currencyString, accounts: accountIdString })
            .then(data => updateQueryStats(data))
    }, [utcEndDate, currency, accounts])

    return {
        queryStats,
        value,
        handleChange,
        defaultCurrency: currentProfile.general.defaultCurrency,
        reservedFunds: currentProfile.statSettings.reservedFunds,
        updateCurrency,
        updateAccounts
    }
}

