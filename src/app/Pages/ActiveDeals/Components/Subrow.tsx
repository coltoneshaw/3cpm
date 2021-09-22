import React, { useEffect, useState } from "react";

import { useAppSelector } from "@/app/redux/hooks";
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
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
        // @ts-ignore
        const getDealOrdersPromise = electron.api.getDealOrders(currentProfile, row.original.id)

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
