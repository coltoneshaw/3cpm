import {setConfig, setCurrentProfile, setEditingProfile, setEditingProfileId} from '@/app/redux/configSlice'

import {TconfigValues, Type_Profile} from '@/types/config';

import store from './store'

const updateConfig = async () => {
    
    //@ts-ignore
    await electron.config.get()
        .then((config:any) => {
            store.dispatch(setConfig(config));
            updateCurrentProfile(config.profiles[config.current])
            updateEditingProfile(config.profiles[config.current], config.current)
        })

}

const updateCurrentProfile = (profileData:Type_Profile) => {
    store.dispatch(setCurrentProfile(profileData));
}

const updateEditingProfile = (profileData:Type_Profile, profileId: string) => {
    store.dispatch(setEditingProfile(profileData));
    store.dispatch(setEditingProfileId(profileId));
}


export {
    updateConfig
}