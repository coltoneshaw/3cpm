import React, { useEffect, useState } from 'react';
import DealsTable from './DealsTable';
import { UpdateDataButton, ToggleRefreshButton } from '@/app/Components/Buttons/Index'
import { formatDeals } from '@/app/Components/DataTable/Index'

import { useGlobalData } from '@/app/Context/DataContext';
import { Card_ActiveDeals, Card_totalInDeals, Card_ActiveDealReserve, Card_TotalDayProfit } from '@/app/Components/Charts/DataCards';
import { SyncToggles } from './Components/index';

import './ActiveDeals.scss'

const ActiveDealsPage = () => {

    const dataState = useGlobalData()
    let { data: { activeDeals, metricsData, profitData } } = dataState

    const todaysProfit = (profitData.length > 0) ? profitData[profitData.length - 1].profit : 0 
    const activeDealReserve = (activeDeals.length > 0) ? activeDeals.map( deal => deal.actual_usd_profit ).reduce( (sum, profit) => sum  + profit ) : 0;
    
    const { activeDealCount, totalInDeals,  on_orders, totalBoughtVolume } = metricsData

    const [localData, updateLocalData] = useState<object[]>([])

    useEffect(() => {
        updateLocalData(formatDeals(activeDeals))
    }, [activeDeals])




    return (
        <>
            <div className="flex-row activeDealsStats">
                <div className="flex-row" style={{ flex: 1 }}>
                    <div className="riskDiv activeDealCards" style={{padding: 0}}>
                        <Card_ActiveDeals metric={activeDealCount} />
                        <Card_totalInDeals metric={totalInDeals} additionalData={{ on_orders, totalBoughtVolume }} />
                        <Card_TotalDayProfit metric={todaysProfit} />
                        <Card_ActiveDealReserve metric={activeDealReserve} />
                    </div>

                </div>

                <div className="filters activeDealButtons" >
                    <UpdateDataButton className="CtaButton" style={{ width: '250px', margin: '5px' }} disabled={true} />
                    <ToggleRefreshButton style={{ width: '250px', margin: '5px' }} />
                </div>

            </div>


            <div className="boxData flex-column" style={{padding: '.5em 2em 2em 2em', overflow: 'hidden'}}>
                <SyncToggles />
                <DealsTable data={localData} />
            </div>
        </>

    )
}

export default ActiveDealsPage;