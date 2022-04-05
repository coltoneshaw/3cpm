import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { updateProfileByPath } from 'webapp/redux/globalFunctions';
import { defaultConfig, defaultProfile } from 'common/utils/defaultConfig';
import { logToConsole } from 'common/utils/logging';
import { ConfigValuesType, ProfileType } from 'types/config';

// Define the initial state using that type
const initialState = {
  config: <ConfigValuesType>defaultConfig,
  currentProfile: <ProfileType>defaultProfile,
};

export const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action) => {
      logToConsole('debug', 'setting the config');
      state.config = action.payload;
    },
    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload;
    },
    setCurrentProfileById: (state, action) => {
      const { profileId } = action.payload;
      const newConfig = { ...state.config };
      state.currentProfile = { ...newConfig.profiles[profileId] };
      state.config = { ...newConfig, current: profileId };
    },
    updateLastSyncTime: (state, action) => {
      const { data } = action.payload;
      const newProfile = { ...state.currentProfile };
      newProfile.syncStatus.deals.lastSyncTime = data;
      state.currentProfile = newProfile;
    },
    updateCurrentProfileByPath: (state, action) => {
      const { data, path } = action.payload;
      const newProfile = updateProfileByPath(data, { ...state.currentProfile }, path);
      const newConfig = { ...state.config };
      newConfig.profiles[newProfile.id] = newProfile;
      state.config = newConfig;
      state.currentProfile = newProfile;
    },
    deleteProfileById: (state, action) => {
      const { profileId } = action.payload;
      const profileKeys = Object.keys(state.config.profiles);
      if (profileKeys.length > 1) {
        const newConfig = { ...state.config };
        delete newConfig.profiles[profileId];

        // setting this to the top profile
        [newConfig.current] = Object.keys(newConfig.profiles);
        state.config = newConfig;
      } else {
        logToConsole('error', 'You cannot delete all your profiles. It looks like your down to the last one.');
      }
    },
    // this is my bug
    addConfigProfile: (state) => {
      state.currentProfile = { ...defaultProfile, id: uuidv4() };
    },
    updateNotificationsSettings: (state, action) => {
      const newConfig = { ...state.config };
      newConfig.globalSettings.notifications = {
        ...state.config.globalSettings.notifications,
        ...action.payload,
      };
      state.config = newConfig;
    },
    logout: () => initialState,
  },
});

export const {
  setConfig, setCurrentProfile,
  updateCurrentProfileByPath, deleteProfileById, addConfigProfile,
  setCurrentProfileById,
  updateLastSyncTime,
  updateNotificationsSettings,
  logout,
} = configSlice.actions;

export default configSlice.reducer;
