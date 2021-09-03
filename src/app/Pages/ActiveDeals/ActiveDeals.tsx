import React, { useEffect, useState } from 'react';
import DealsTable from './DealsTable';
import { UpdateDataButton, ToggleRefreshButton } from '@/app/Components/Buttons/Index'
import { formatDeals } from '@/app/Components/DataTable/Index'

import { useGlobalData } from '@/app/Context/DataContext';
import { Card_ActiveDeals, Card_totalInDeals, Card_ActiveDealReserve, Card_TotalDayProfit, Card_TotalUnrealizedProfit, Card_TotalRoi } from '@/app/Components/Charts/DataCards';
import { SyncToggles } from './Components/index';


import './ActiveDeals.scss'

const ActiveDealsPage = () => {

    const dataState = useGlobalData()
    let { data: { activeDeals, metricsData, profitData } } = dataState

    const todaysProfit = (profitData.length > 0) ? profitData[profitData.length - 1].profit : 0 
    const activeDealReserve = (activeDeals.length > 0) ? activeDeals.map( deal => deal.actual_usd_profit ).reduce( (sum, profit) => sum  + profit ) : 0;
    const unrealizedProfitTotal = (activeDeals.length > 0) ? activeDeals.map( deal => ( deal.take_profit / 100 ) * deal.bought_volume).reduce( (sum, profit) => sum  + profit ) : 0;
    
    const { activeDealCount, totalInDeals,  on_orders, totalBoughtVolume, totalBankroll } = metricsData

    const [localData, updateLocalData] = useState<object[]>([])

    useEffect(() => {
        updateLocalData(formatDeals(activeDeals))
    }, [activeDeals])

    




    return (
        <>
            <div className="flex-row headerButtonsAndKPIs">
                <div className="flex-row" style={{ flex: 1, paddingBottom: '.5em' }}>
                    <div className="riskDiv activeDealCards">
                        <Card_ActiveDeals metric={activeDealCount} />
                        <Card_totalInDeals metric={totalInDeals} additionalData={{ on_orders, totalBoughtVolume }} />
                        <Card_TotalDayProfit metric={todaysProfit} />
                        <Card_ActiveDealReserve metric={activeDealReserve} />
                        <Card_TotalUnrealizedProfit metric={unrealizedProfitTotal} />
                        <Card_TotalRoi additionalData={{totalBankroll, totalProfit:todaysProfit}} />
                    </div>

                </div>

                

            </div>


            <div className="boxData flex-column" style={{padding: '.5em 1em 1em', overflow: 'hidden'}}>
                <div className="tableSettings">

                    <SyncToggles />

                    <div className="filters tableButtons" >
                    <ToggleRefreshButton style={{ width: '250px', margin: '5px', height: '38px' }} />
                    <UpdateDataButton className="CtaButton" style={{ margin: '5px', height: '38px' }} disabled={true} />
                    </div>


                </div>
                <DealsTable data={localData} />
            </div>
        </>

    )
}

export default ActiveDealsPage;