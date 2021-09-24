import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { NavLink } from 'react-router-dom'
import { setStorageItem, storageItem } from '@/app/Features/LocalStorage/LocalStorage';

interface Props {
    // In your case
    Icon: React.ComponentType,
    name: string, 
    link: string,
  }

const SidebarNav= ({ Icon, name, link }: Props) => {


    return (
        <div className="sidebarOption" onClick={() => setStorageItem(storageItem.navigation.homePage, link)}>
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

export default SidebarNav;