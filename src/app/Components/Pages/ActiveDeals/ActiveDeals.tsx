import React, { useEffect, useState } from 'react';

import DealsTable from './DealsTable';

import { UpdateDataButton, ToggleRefreshButton } from '@/app/Components/Buttons/Index'


import formatDeals from './Components/FormatDeals';
import { useGlobalData } from '@/app/Context/DataContext';
import { Type_ActiveDeals } from '@/types/3Commas';
import { dynamicSort, getDateString } from '@/utils/helperFunctions';


const ActiveDealsPage = () => {

    const dataState = useGlobalData()
    let { data: { activeDeals } } = dataState

    const [localData, updateLocalData] = useState<object[]>([])

    useEffect(() => {
        updateLocalData(formatDeals(activeDeals))
    }, [activeDeals])

    return (
        <>
            <div className="flex-row">
                <div className="flex-row" style={{flexBasis: '50%'}}>
                    <h1>Active Deals</h1>
                </div>

                <div className="flex-row filters" >
                    <UpdateDataButton className="CtaButton" style={{ width: '250px', margin: '10px' }} />
                    <ToggleRefreshButton style={{ width: '250px', margin: '10px' }} />
                </div>

            </div>


            <div className="boxData">
                <DealsTable data={localData} />
            </div>
        </>

    )
}

export default ActiveDealsPage;