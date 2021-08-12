import React, { Component } from 'react';
// import './Sidebar.scss';


import { ActiveDealsIcon, BackwardClock, BotPlannerIcon, Coffee, Cog, PieChart } from './Icons/Index'

import { SidebarNav, SidebarLink } from './Components';

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
                    <SidebarNav Icon={BotPlannerIcon} name="Bot Planner" link="/botplanner" />
                    <SidebarNav Icon={PieChart} name="Stats" link="/stats" />
                    <SidebarNav Icon={BackwardClock} name="Trading View" link="/backtesting" />
                </div>
                <div className="flex-column sidebar-column" style={{justifyContent: 'flex-end'}}>
                    {/*  @ts-ignore */}
                    <SidebarLink Icon={Coffee} name="Donate" link="" onClick={() => electron.general.openLink('https://www.buymeacoffee.com/ColtonS')} />
                    <SidebarNav Icon={Cog} name="Settings" link="/settings" />
                    <DisplaySwitcher />
                </div>


            </div>
        )
    }
}

export default Sidebar;