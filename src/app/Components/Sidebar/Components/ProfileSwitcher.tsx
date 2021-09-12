import React, { useRef } from "react";

import { SidebarLink } from './index';
import PersonIcon from '@material-ui/icons/Person';

import HoverMenu from 'material-ui-popup-state/HoverMenu'
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';

import {
    usePopupState,
    bindHover,
    bindMenu,
} from 'material-ui-popup-state/hooks'

interface Props {
    // In your case
    Icon: React.ComponentType,
    name: string,
    onClick: any
}

const profiles = ['Binance US', 'Paper Trading', 'Rich BTC', 'Stan']

const ProfileSwitcher = () => {
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

    // const changeDefaultProfile = () => {
    //     // change profile state function
    //     handleClose();
    // }

    // Add a search for the number of profiles and render it as menu items
    // add the current profile to the config context

    return (
        <>
            {/* @ts-ignore */}
            <div className="sidebarOption" {...bindHover(popupState)}>
                <span>
                    <PersonIcon />
                </span>
            </div>
            <HoverMenu
                {...bindMenu(popupState)}
                style={{
                    marginLeft: '45px'
                }}
            >
                {profiles.map((p) => {
                    return <MenuItem onClick={popupState.close}>{p}</MenuItem>
                })}

            </HoverMenu>
        </>
    )
}

export default ProfileSwitcher;