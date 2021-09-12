import React, { useEffect, useState } from "react";

import PersonIcon from '@material-ui/icons/Person';

import HoverMenu from 'material-ui-popup-state/HoverMenu'
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import { TconfigValues } from '@/types/config'

import { useGlobalState } from '@/app/Context/Config';

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

const ProfileSwitcher = () => {
    const popupState = usePopupState({ variant: 'popover', popupId: 'demoMenu' })

    const configState = useGlobalState();
    const {config, state:{currentProfileId, updateCurrentProfileId}} = configState;

    const [profiles, setProfiles ] = useState<TconfigValues["profiles"] | {}>(() => {})

    useEffect(() => {
        const configProfiles = config.profiles
        if( configProfiles && Object.keys(configProfiles).length > 0){
            setProfiles(configProfiles)
        }
    }, [config])


    const setProfile = (closeCallback:CallableFunction, id?:string) => {
        if(id){
            updateCurrentProfileId(id)
            console.log(id)
        } 
        closeCallback()
    }

    const returnMenuOptions = () => {

        if(!profiles) return <MenuItem onClick={popupState.close} >No profiles Configured</MenuItem>

        return Object.keys(profiles).map((p) => {
            //@ts-ignore
            const menuProfile = profiles[p]
            const styles = (p === currentProfileId) ? {backgroundColor: 'green'}: {};
            return <MenuItem onClick={() => { setProfile(popupState.close, p) }} style={styles}>{menuProfile.name}</MenuItem>
        })
    }
    return (
        <>
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

            </HoverMenu>
        </>
    )
}

export default ProfileSwitcher;