import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useAppSelector } from '@/app/redux/hooks';
import { OrderTimeline, DCA, Orders } from '../SubrowTabs/Index';
import type { MarketOrdersType } from '@/types/DatabaseQueries';

const SubRows = ({
  row, ordersData, loading,
}: any) => {
  if (loading) {
    return (
      <div>
        <div />
        <div>
          Loading...
        </div>
      </div>
    );
  }

  const [activeTab, setActiveTab] = React.useState('timeline');
  const handleChange = (event: any, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <div>
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
      </div>
    </div>
  );
};

const SubRowAsync = ({ row }: any) => {
  const [loading, setLoading] = useState(true);
  const [ordersData, setOrdersData] = useState<MarketOrdersType[] | any[]>([]);

  const { currentProfile } = useAppSelector((state) => state.config);

  useEffect(() => {
    const getDealOrdersPromise = window.ThreeCPM.Repository.API.getDealOrders(currentProfile, row.original.id);

    Promise.all([getDealOrdersPromise])
      .then(([getDealOrdersResult]) => {
        setOrdersData(getDealOrdersResult.reverse());
        setLoading(false);
      });
  }, []);

  return (
    <SubRows
      row={row}
      // visibleColumns={visibleColumns}
      ordersData={ordersData}
      loading={loading}
    />
  );
};

export default SubRowAsync;
