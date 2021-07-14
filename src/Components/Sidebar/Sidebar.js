import React, { Component, ReactComponent } from 'react';
import './Sidebar.scss';




import SidebarOption from './SidebarOption';
import DisplaySwitcher from './DisplaySwitcher';

import BackwardClock from './Icons/Clock';
// import BackwardClock from './svg/backwardClock.svg'
import Botmanager from './Icons/BotManager';
import Coffee from './Icons/Coffee';
import Cog from './Icons/Cog';
import PieChart from './Icons/PieChart';

class Sidebar extends Component {

    render() {
        return (
            <div id="sidebar">
                <SidebarOption Icon={Botmanager} name="Bot Manager" link="/botmanager" />
                <SidebarOption Icon={PieChart} name="Stats" link="/stats" />
                <SidebarOption Icon={BackwardClock} name="Backtesting" link="/backtesting" />
                <SidebarOption Icon={Cog} name="Settings" link="/settings" />
                <SidebarOption Icon={Coffee} name="Donate" link="/donate" />
                <DisplaySwitcher />
            </div>
        )
    }
}

export default Sidebar;