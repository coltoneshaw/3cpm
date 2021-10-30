import React, { Component } from 'react';
import './Sidebar.scss';


import { ActiveDealsIcon, TradingViewLogo, BotPlannerIcon, Coffee, Cog, PieChart } from '@/app/Components/icons/Index';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { SidebarNav, SidebarLink } from './Components';
import { ProfileSwitcher } from '@/app/Features/Profiles/Components/Index'

import DisplaySwitcher from './DisplaySwitcher';



/**
 * TODO:
 * - Move the settings / coffee cog into the display switcher.
 */
class Sidebar extends Component {

    render() {
        return (
            <div id="sidebar">
                <div className="flex-column sidebar-column">
                    <SidebarNav Icon={ActiveDealsIcon} name="Active Deals" link="/activeDeals" />
                    <SidebarNav Icon={PieChart} name="Stats" link="/stats" />
                    <SidebarNav Icon={BotPlannerIcon} name="Bot Planner" link="/botplanner" />
                    <SidebarNav Icon={TradingViewLogo} name="Trading View" link="/backtesting" />
                </div>
                <div className="flex-column sidebar-column" style={{ justifyContent: 'flex-end' }}>
                    <SidebarLink Icon={Coffee} name="Donate" onClick={() => window.ThreeCPM.Repository.General.openLink('https://www.buymeacoffee.com/ColtonS')} />

                    <SidebarLink Icon={MenuBookIcon} name="Documentation"  onClick={() => window.ThreeCPM.Repository.General.openLink('https://docs.3cpm.io')} />
                    <ProfileSwitcher />
                    <SidebarNav Icon={Cog} name="Settings" link="/settings" />
                    <DisplaySwitcher />
                </div>


            </div>
        )
    }
}

export default Sidebar;