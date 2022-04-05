import React from 'react';
import './Sidebar.scss';

import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {
  ActiveDealsIcon, TradingViewLogo, BotPlannerIcon, Coffee, Cog, PieChart,
} from 'webapp/Components/icons/Index';
import { ProfileSwitcher } from 'webapp/Features/Profiles/Components/Index';
import { openLink } from 'common/utils/helperFunctions';
import { SidebarNav, SidebarLink } from './Components';

import DisplaySwitcher from './DisplaySwitcher';

/**
 * TODO:
 * - Move the settings / coffee cog into the display switcher.
 */
const Sidebar = () => (
  <div id="sidebar">
    <div className="flex-column sidebar-column">
      <SidebarNav Icon={ActiveDealsIcon} name="Active Deals" link="/activeDeals" />
      <SidebarNav Icon={PieChart} name="Stats" link="/stats" />
      <SidebarNav Icon={BotPlannerIcon} name="Bot Planner" link="/botplanner" />
      <SidebarNav Icon={CalendarTodayIcon} name="Daily Stats" link="/dailystats" />
      <SidebarNav Icon={TradingViewLogo} name="Trading View" link="/backtesting" />

    </div>
    <div className="flex-column sidebar-column" style={{ justifyContent: 'flex-end' }}>
      <SidebarLink Icon={Coffee} name="Donate" onClick={() => openLink('https://www.buymeacoffee.com/ColtonS')} />
      <SidebarLink Icon={MenuBookIcon} name="Documentation" onClick={() => openLink('https://docs.3cpm.io')} />
      <ProfileSwitcher />
      <SidebarNav Icon={Cog} name="Settings" link="/settings" />
      <DisplaySwitcher />
    </div>

  </div>
);

export default Sidebar;
