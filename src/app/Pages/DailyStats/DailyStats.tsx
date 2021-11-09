import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { isValid } from 'date-fns'
import { CopyTodayStatsButton } from '@/app/Components/Buttons/Index'

import { Grid, TextField } from '@mui/material';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';

import { useAppSelector } from '@/app/redux/hooks';

import type { Type_Profile } from '@/types/config';
import { PairBar, queryDealByPairByDay, queryDealByBotByDay } from "@/app/Pages/DailyStats/Components";

const oldestYear = 2015

const returnTodayUTC = (date?: Date | null) => {
    if (!date) date = new Date();
    return moment.utc(date)
        .subtract(date.getTimezoneOffset(), "minutes")
        .startOf("day")
        .valueOf()
}


const queryDayDashboard = async (utcStartDate: number, profileData: Type_Profile) => {
    const utcEndDate = utcStartDate + 86400000
    const utcDateRange = { utcEndDate, utcStartDate }

    return {
        pairDay: await queryDealByPairByDay(profileData, utcDateRange),
        botDay: await queryDealByBotByDay(profileData, utcDateRange)
    }

}

/**
How to query:

1. Query all deals during the window
2. Parse that data on the JS side out and group by pair


*/

/*
TODO list:

- Add four additional KPI metrics
- Save the query in the redux state. Maybe.
- Move this daily stats page to it's own page.
- Create a dropdown that controls what currency / accounts are shown.
    - Store Accounts / Currencies in the data store
    - Can also filter bots, as needed

*/
type blankDashboard = {
    pairDay: queryDealByPairByDayReturn[] | [],
    botDay: botQueryDealByDayReturn[] | []
}
const blankDashboard: blankDashboard = {
    pairDay: [],
    botDay: []
}

const DailyStats = () => {
    const { currentProfile } = useAppSelector(state => state.config);
    const { metricsData, profitData } = useAppSelector(state => state.threeCommas);


    const [value, setValue] = useState<Date | null>();
    const [utcStartDate, setUtcStartDate] = useState<number>(() => returnTodayUTC());
    const [queryStats, updateQueryStats] = useState(blankDashboard)
    const handleChange = (date: Date | null) => setValue(date);
    useEffect(() => {
        if (value && isValid(value) && value.getFullYear() > oldestYear) setUtcStartDate(returnTodayUTC(value))
    }, [value])

    // take the UTC date and pass it into a database query to pull metrics.
    // should these get stored in redux? Maybe after they're queried

    useEffect(() => {
        queryDayDashboard(utcStartDate, currentProfile)
            .then(data => updateQueryStats(data))
    }, [utcStartDate])

    /*
    Top metrics
    structure them differently than the KPIs. Maybe taller squares?

    What about moving the day dashboard to it's own icon since it doesn't respect the filter?

    Metric ideas:
    - longest running deal
    - 3c total profit - Is this needed? Would be cool to show total that you've made. Outside of date filters.
    - % change from the prior day
    - Best pair / worst pair
    - best bot / worst bot
    - 
    */




    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={5} style={{ marginBottom: '10px' }}>
                    <DesktopDatePicker
                        label="Date desktop"
                        value={value}
                        onChange={handleChange}
                        maxDate={new Date()}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Grid>
                <Grid>
                    <CopyTodayStatsButton 
                        key="copyTodayStatsButton" 
                        currency={currentProfile.general.defaultCurrency} 
                        profitData={profitData} 
                        metricsData={metricsData} 
                        className="CtaButton" 
                        style={{ margin: "auto", height: "36px", marginLeft: "15px", padding: "5px 15px" }} 
                    />

                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <div className="boxData" style={{ height: '10rem' }}>
                        <h3 className="chartTitle">Top Pair</h3>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="boxData" style={{ height: '10rem' }}>
                        <h3 className="chartTitle">Profit</h3>
                        <p>% Up from 10/2/21</p>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="boxData" style={{ height: '10rem' }}>
                    </div>
                </Grid>
                <Grid item xs={3}>
                    <div className="boxData" style={{ height: '10rem' }}>
                    </div>
                </Grid>
                {/* <Grid item xs={3}>
                    <div className="boxData"  style={{height: '10rem'}}>
                    </div>
                </Grid>
                <Grid item xs={3} >
                    <div className="boxData" style={{height: '10rem'}}>
                    </div>
                </Grid> */}


                <Grid item xs={6}>
                    <div className="boxData stat-chart " >
                        <h3 className="chartTitle">Top {(queryStats.pairDay.length < 10) ? '50%' : '5'} Pairs by Profit</h3>
                        <PairBar data={queryStats.pairDay} defaultCurrency={currentProfile.general.defaultCurrency} metric="top" type="pair" />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="boxData stat-chart " >
                        <h3 className="chartTitle">Bottom {(queryStats.pairDay.length < 10) ? '50%' : '5'} Pairs by Profit</h3>
                        <PairBar data={queryStats.pairDay} defaultCurrency={currentProfile.general.defaultCurrency} metric="bottom" type="pair" />
                    </div>
                </Grid>


                <Grid item xs={6}>
                    <div className="boxData stat-chart " >
                        <h3 className="chartTitle">Top {(queryStats.pairDay.length < 10) ? '50%' : '5'} Bots by Profit</h3>
                        <PairBar data={queryStats.botDay} defaultCurrency={currentProfile.general.defaultCurrency} metric="top" type="bot_name" />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div className="boxData stat-chart " >
                        <h3 className="chartTitle">Top {(queryStats.pairDay.length < 10) ? '50%' : '5'} Bots by Profit</h3>
                        <PairBar data={queryStats.botDay} defaultCurrency={currentProfile.general.defaultCurrency} metric="bottom" type="bot_name" />
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default DailyStats;