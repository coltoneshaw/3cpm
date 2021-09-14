import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store'

import { Type_Profile, TconfigValues } from '@/types/config'
import { defaultProfile, defaultConfig } from '@/utils/defaultConfig'

// Define a type for the slice state
interface ConfigState {
    config: TconfigValues
    currentProfile: Type_Profile
    editingProfile: Type_Profile
    editingProfileId: string
}

// Define the initial state using that type
const initialState: ConfigState = {
    config: defaultConfig,
    currentProfile: defaultProfile,
    editingProfile: defaultProfile,
    editingProfileId: defaultConfig.current
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
            // const currentConfig = 
            const newConfig = { ...state.config }
            const editingProfile = newConfig.profiles[state.editingProfileId]
            newConfig.profiles[state.editingProfileId] = { ...editingProfile, ...state.editingProfile }

            state.config = newConfig
        }
    }
})

export const { setConfig, setCurrentProfile, setEditingProfile, setEditingProfileId, storeEditingProfileData } = configSlice.actions;

// export const selectCount = (state: RootState) => state.config.config

export default configSlice.reducer