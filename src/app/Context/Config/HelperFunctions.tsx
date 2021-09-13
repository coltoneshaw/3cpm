import React, { useEffect, useState } from "react";
import { TconfigValues } from '@/types/config'

import { useGlobalState } from '@/app/Context/Config';
/**
 * 
 * @returns current profile or undefined
 */
const returnCurrentProfile = () => {
    const configState = useGlobalState();
    const { currentProfile } = configState;
    return currentProfile;
}


/**
 * @description used to fetch current profiles and set current profile state.
 * @returns Object with profile state functions
 */
const useProfileState = () => {
    const configState = useGlobalState();
    const { config, state: { currentProfileId, updateCurrentProfileId } } = configState;

    const [profiles, setProfiles] = useState<TconfigValues["profiles"] | {}>(() => { })

    useEffect(() => {
        const configProfiles = config.profiles
        if (configProfiles && Object.keys(configProfiles).length > 0) {
            setProfiles(configProfiles)
        }
    }, [config])

    const setCurrentProfile = (closeCallback: CallableFunction, id?: string) => {
        if (id) {
            updateCurrentProfileId(id)
            console.log(id)
        }
        closeCallback()
    }

    return {
        setCurrentProfile,
        profiles,
        setProfiles,
        currentProfileId
    }

}


export {
    returnCurrentProfile,
    useProfileState
}