import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { NavLink } from 'react-router-dom'


const SidebarOption = (props) => {

    let { Icon, name, link } = props

    return (
        <div className="sidebarOption">
            <NavLink exact to={link} >
                <Tooltip title={name} placement="right" arrow>
                    <span>
                        <Icon />
                    </span>
                </Tooltip>
            </NavLink>
        </div>
    )

}

export default SidebarOption;