import React, { Component, ReactComponent } from 'react';
import './Sidebar.scss';


import { BackwardClock, BotPlannerIcon, Coffee, Cog, PieChart } from './Icons'

import SidebarOption from './SidebarOption';
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
                    <SidebarOption Icon={BotPlannerIcon} name="Bot Planner" link="/botplanner" />
                    <SidebarOption Icon={PieChart} name="Stats" link="/stats" />
                    <SidebarOption Icon={BackwardClock} name="Trading View" link="/backtesting" />
                </div>
                <div className="flex-column sidebar-column" style={{justifyContent: 'flex-end'}}>
                    <SidebarOption Icon={Coffee} name="Donate" link="/donate" />
                    <SidebarOption Icon={Cog} name="Settings" link="/settings" />
                    <DisplaySwitcher />
                </div>


            </div>
        )
    }
}

export default Sidebar;