import moment from "moment";


import {
    Type_Pair_By_Date,
    Type_UpdateFunction,
} from '@/types/3Commas'
import { Type_Profile } from '@/types/config'
import { DateRange } from "@/types/Date";

import { getFiltersQueryString } from './queryString';
import { fetchPerformanceDataFunction, fetchDealDataFunction, getActiveDealsFunction, fetchSoData } from "./DataQueries/deals";
import { fetchBotPerformanceMetrics, botQuery } from "./DataQueries/bots";
import { getAccountDataFunction } from "./DataQueries/accounts";

// these queries use the deals database but are pairs only. Can probably combine this with the deals queries or create a new folder.
import { fetchPairPerformanceMetrics, getSelectPairDataByDate  } from "./DataQueries/pairs";

/**
 * @description This kicks off the update process that updates all 3Commas data within the database.
 *
 * @params - type 'autoSync'
 * @params {options} - option string
 */
const updateThreeCData = async (type: string, options: Type_UpdateFunction, profileData: Type_Profile) => {
    console.info({ options })
    return await window.ThreeCPM.Repository.API.update(type, options, profileData);
}

export const initDate = (startString: number, oDate?: DateRange) => {
    let date = new DateRange()
    if (oDate) {
        date = { ...oDate }
    }

    if (date.from == null) {
        date.from = moment(startString).startOf("day").toDate()

    }

    if (date.to == null) {
        date.to = moment().endOf("day").toDate()
    }
    return date;
}

export const DateRangeToSQLString = (d: DateRange) => {
    let fromDateStr = moment.utc(d.from)
        .subtract(d.from?.getTimezoneOffset(), "minutes")
        .startOf("day")
        .toISOString()


    let toDateStr = moment.utc(d.to)
        .subtract(d.to?.getTimezoneOffset(), "minutes")
        .add(1, "days")
        .startOf("day")
        .toISOString()

    return [fromDateStr, toDateStr]
}




export {
    fetchDealDataFunction,
    fetchPerformanceDataFunction,
    getActiveDealsFunction,
    updateThreeCData,
    getAccountDataFunction,
    fetchBotPerformanceMetrics,
    fetchPairPerformanceMetrics,
    botQuery,
    getSelectPairDataByDate,
    getFiltersQueryString,
    fetchSoData
}


