import React, { useEffect, useState } from "react";

import PersonIcon from '@material-ui/icons/Person';

import HoverMenu from 'material-ui-popup-state/HoverMenu'
import MenuItem from '@material-ui/core/MenuItem';

import { useProfileState } from "@/app/Context/Config/HelperFunctions";

import ManageProfileModal from "@/app/Features/Profiles/ManageProfileModal";

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


// const profiles = ['Binance US', 'Paper Trading', 'Rich BTC', 'Stan']

// When clicking the manage profiles button a modal comes up to edit the current profiles or to make a new one.

const ProfileSwitcher = () => {
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
    const [open, setOpen] = useState(false)

    const {setCurrentProfile, profiles, setProfiles, currentProfileId} = useProfileState()

    const returnMenuOptions = () => {

        if (!profiles) return <MenuItem onClick={popupState.close} >No profiles Configured</MenuItem>

        return Object.keys(profiles).map((p:string) => {

            // @ts-ignore
            // TODO - need to go back and make this a key of profiles properly
            const menuProfile = profiles[p]
            const styles = (p === currentProfileId) ? { backgroundColor: 'lightBlue' } : {};
            return <MenuItem onClick={() => { setCurrentProfile(popupState.close, p) }} style={styles}>{menuProfile.name}</MenuItem>
        })
    }
    return (
        <>
            <ManageProfileModal open={open} setOpen={setOpen} profiles={profiles} currentProfileId={currentProfileId} />

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
                {returnMenuOptions()}
                <MenuItem onClick={() => { setOpen(prevState => !prevState) /* need to add the add new profile function to route to settings with a blank slate. */}}>Add new profile</MenuItem>
                <MenuItem onClick={() => { setOpen(prevState => !prevState) }}>Manage profiles</MenuItem>

            </HoverMenu>
        </>
    )
}

export default ProfileSwitcher;