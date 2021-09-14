import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store'
import dotProp from 'dot-prop'

import { Type_Profile, TconfigValues, Type_ReservedFunds } from '@/types/config'
import { defaultProfile, defaultConfig } from '@/utils/defaultConfig'


const defaultReservedFunds = {
    id: 0,
    account_name: '',
    reserved_funds: 0,
    is_enabled: false
}

// Define a type for the slice state
interface ConfigState {
    config: TconfigValues
    currentProfile: Type_Profile
    editingProfile: Type_Profile
    editingProfileId: string
    reservedFunds: Type_ReservedFunds[]
}

// Define the initial state using that type
const initialState: ConfigState = {
    config: defaultConfig,
    currentProfile: defaultProfile,
    editingProfile: defaultProfile,
    editingProfileId: defaultConfig.current,
    reservedFunds: [defaultReservedFunds]
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
        setEditingProfile: (state, action) => {
            state.editingProfile = action.payload
        },
        setEditingProfileId: (state, action) => {
            state.editingProfileId = action.payload
        },
        storeEditingProfileData: state => {
            const newConfig = { ...state.config }
            const editingProfile = newConfig.profiles[state.editingProfileId]
            newConfig.profiles[state.editingProfileId] = { ...editingProfile, ...state.editingProfile }

            state.config = newConfig
        },
        setReservedFunds: (state, action) => {
            state.reservedFunds = action.payload
        },
        updateOnEditingProfile: (state, action) => {
            const { data, path } = action.payload
            let newProfile = Object.assign({}, { ...state.editingProfile })
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
                default:
                    newProfile = newProfile
            }

            state.editingProfile = newProfile
        },
        deleteEditingProfile: state => {

            const profileKeys = Object.keys(state.config.profiles)
            if (profileKeys.length > 1) {
                const currentlyEditingProfileId = state.editingProfileId
                const newConfig = { ...state.config }
                delete newConfig.profiles[currentlyEditingProfileId]

                // setting this to the top profile
                newConfig.current = Object.keys(newConfig.profiles)[0]
                state.config = newConfig
            } else {
                console.error('You cannot delete all your profiles. It looks like your down to the last one.')
            }



        },
    }
})

export const { setConfig, setCurrentProfile, setEditingProfile, setEditingProfileId, storeEditingProfileData, setReservedFunds, updateOnEditingProfile, deleteEditingProfile } = configSlice.actions;
export { configPaths }
// export const selectCount = (state: RootState) => state.config.config

export default configSlice.reducer