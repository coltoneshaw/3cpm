import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { v4 as uuidv4 } from 'uuid';

import { Type_Profile, TconfigValues, Type_ReservedFunds } from '@/types/config'
import { defaultProfile, defaultConfig } from '@/utils/defaultConfig'


const defaultReservedFunds = {
    id: 0,
    account_name: '',
    reserved_funds: 0,
    is_enabled: false
}


// Define the initial state using that type
const initialState = {
    config: <TconfigValues>defaultConfig,
    currentProfile: <Type_Profile>defaultProfile,
    reservedFunds: <Type_ReservedFunds[]>[defaultReservedFunds]
}

const configPaths = {
    apis: {
        threeC: {
            main: 'apis.threeC',
            key: 'apis.threeC.key',
            secret: 'apis.threeC.secret',
            mode: 'apis.threeC.mode'
        }
    },
    syncStatus: {
        deals: {
            lastSyncTime: 'syncStatus.deals.lastSyncTime'
        }
    },
    statSettings: {
        reservedFunds: 'statSettings.reservedFunds',
        startDate: 'statSettings.startDate',
        account_id: 'statSettings.account_id',
    },
    name: 'name',
    general: {
        defaultCurrency: 'general.defaultCurrency'
    }
}

export const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        setConfig: (state, action) => {
            console.log('setting the config')
            state.config = action.payload
        },
        setCurrentProfile: (state, action) => {
            state.currentProfile = action.payload
        },
        setCurrentProfileById: (state, action) => {
            const { profileId } = action.payload
            console.log({ profileId })
            const newConfig = { ...state.config }
            state.currentProfile = { ...newConfig.profiles[profileId] }
            state.config = { ...newConfig, current: profileId }
        },
        storeCurrentProfile: state => {
            const newConfig = { ...state.config }
            const currentProfile = state.currentProfile
            newConfig.profiles[currentProfile.id] = currentProfile
            state.config = newConfig
        },
        updateLastSyncTime: (state, action) => {
            const { data } = action.payload
            let newProfile = Object.assign({}, { ...state.currentProfile })
            newProfile.syncStatus.deals.lastSyncTime = data
            state.currentProfile = newProfile
        },
        updateCurrentProfileByPath: (state, action) => {
            const { data, path} = action.payload
            let newProfile = Object.assign({}, { ...state.currentProfile })
            switch (path) {
                case configPaths.apis.threeC.main: // update all the api data.
                    newProfile.apis.threeC = data
                    break
                case configPaths.statSettings.reservedFunds: // update all the api data.
                    newProfile.statSettings.reservedFunds = data
                    break
                case configPaths.name: // update all the api data.
                    newProfile.name = data
                    break
                case configPaths.general.defaultCurrency: // update all the currency data
                    newProfile.general.defaultCurrency = data
                    break
                case configPaths.statSettings.startDate: // update all the api data.
                    newProfile.statSettings.startDate = data
                    break
                case configPaths.syncStatus.deals.lastSyncTime: 
                    newProfile.statSettings.startDate = data
                    break
                default:
                    newProfile = newProfile
            }

            const newConfig = { ...state.config }
            newConfig.profiles[newProfile.id] = newProfile
            state.config = newConfig
            state.currentProfile = newProfile
        },
        deleteProfileById: (state, action) => {
            const { profileId } = action.payload
            const profileKeys = Object.keys(state.config.profiles)
            if (profileKeys.length > 1) {
                const newConfig = { ...state.config }
                delete newConfig.profiles[profileId]

                // setting this to the top profile
                newConfig.current = Object.keys(newConfig.profiles)[0]
                state.config = newConfig
            } else {
                console.error('You cannot delete all your profiles. It looks like your down to the last one.')
            }
        },
        addConfigProfile: state => {
            state.currentProfile = { ...defaultProfile, id: uuidv4() }
        }
    }
})

export const {
    setConfig, setCurrentProfile, 
    updateCurrentProfileByPath, deleteProfileById, addConfigProfile,
    setCurrentProfileById,
    updateLastSyncTime
} = configSlice.actions;
export { configPaths }

export default configSlice.reducer