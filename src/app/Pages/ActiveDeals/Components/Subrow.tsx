import React, { useEffect, useState } from "react";

import { useAppSelector } from "@/app/redux/hooks";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { OrderTimeline, DCA, Orders } from './SubrowTabs/Index'
import type { Type_MarketOrders } from '@/types/3Commas'


function SubRows({ row, visibleColumns, ordersData, loading }: any) {
    if (loading) {
        return (
            <tr>
                <td />
                <td colSpan={visibleColumns.length - 1}>
                    Loading...
                </td>
            </tr>
        );
    }

    const [activeTab, setActiveTab] = React.useState('timeline');
    const handleChange = (event: any, newValue: string) => {
        setActiveTab(newValue);
    };


    return (
        <tr>
            <td />
            <td colSpan={visibleColumns.length - 1}>
                <TabContext value={activeTab}>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChange}>
                            <Tab label="Timeline" value="timeline" />
                            <Tab label="Orders" value="orders" />
                            <Tab label="DCA" value="dca" />
                        </TabList>
                    </Box>
                    <TabPanel value="orders">
                        <Orders ordersData={ordersData} row={row} />
                    </TabPanel>
                    <TabPanel value="dca">
                        <DCA ordersData={ordersData} row={row} />
                    </TabPanel>
                    <TabPanel value="timeline">
                        <OrderTimeline ordersData={ordersData} row={row} />
                    </TabPanel>
                </TabContext>
            </td>
        </tr>
    );
}

function SubRowAsync({ row, visibleColumns }: any) {
    const [loading, setLoading] = useState(true);
    const [ordersData, setOrdersData] = useState<Type_MarketOrders[] | any[]>([]);

    const { currentProfile } = useAppSelector(state => state.config);

    useEffect(() => {
        const getDealOrdersPromise = window.ThreeCPM.Repository.API.getDealOrders(currentProfile, row.original.id)

        Promise.all([getDealOrdersPromise])
            .then(([getDealOrdersResult]) => {
                setOrdersData(getDealOrdersResult.reverse());
                setLoading(false);
            })

    }, []);

    return (
        <SubRows
            row={row}
            visibleColumns={visibleColumns}
            ordersData={ordersData}
            loading={loading}
        />
    );
}

export default SubRowAsync
