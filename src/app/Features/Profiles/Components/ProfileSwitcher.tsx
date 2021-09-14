import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {setConfig, setEditingProfile, setEditingProfileId, addEditingProfile} from '@/app/redux/configSlice'

import PersonIcon from '@material-ui/icons/Person';

import HoverMenu from 'material-ui-popup-state/HoverMenu'
import MenuItem from '@material-ui/core/MenuItem';

import ManageProfileModal from "@/app/Features/Profiles/ManageProfileModal";

import {
    usePopupState,
    bindHover,
    bindMenu,
} from 'material-ui-popup-state/hooks'

const ProfileSwitcher = () => {
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })
    const [open, setOpen] = useState(false)
    
    const config = useAppSelector(state => state.config.config)
    const dispatch = useAppDispatch();

    const [profiles, updateProfiles] = useState(config.profiles)
    const [currentProfileId, updateCurrentProfileId] = useState(config.current)

    useEffect(() => {
        updateProfiles(config.profiles)
        updateCurrentProfileId(config.current)
    },[config])

    const addNewProfile = () => {
        // navigate to settings
        // add a profile to the store.
        dispatch(addEditingProfile())
    }


    const returnMenuOptions = () => {

        if (!profiles) return <MenuItem onClick={popupState.close} >No profiles Configured</MenuItem>

        return Object.keys(profiles).map((p:string) => {

            const menuProfile = profiles[p]
            const styles = (p === currentProfileId) ? { backgroundColor: 'lightBlue' } : {};
            return (
                <MenuItem 
                    key={p}
                    onClick={() => { 
                        updateCurrentProfileId(p);
                        dispatch(setConfig({...config, current: p}))
                        dispatch(setEditingProfile({...menuProfile}))
                        dispatch(setEditingProfileId(p))
                        popupState.close()
                    }} 
                    style={styles}>
                        {menuProfile.name}
                </MenuItem>
                )
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
                <MenuItem onClick={() => { addNewProfile()}}>Add new profile</MenuItem>
                <MenuItem onClick={() => { setOpen(prevState => !prevState) }}>Manage profiles</MenuItem>

            </HoverMenu>
        </>
    )
}

export default ProfileSwitcher;