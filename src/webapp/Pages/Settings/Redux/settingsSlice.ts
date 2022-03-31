import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { updateProfileByPath } from 'webapp/redux/globalFunctions';
import { defaultProfile } from 'common/utils/defaultConfig';

const initialState = {
  editingProfile: defaultProfile,
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setEditingProfile: (state, action) => {
      state.editingProfile = action.payload;
    },
    updateEditProfileByPath: (state, action: { payload: { data: string | {} | [], path: any } }) => {
      const { data, path } = action.payload;
      const newProfile = updateProfileByPath(data, { ...state.editingProfile }, path);
      state.editingProfile = newProfile;
    },
    addEditingProfile: (state) => {
      state.editingProfile = { ...defaultProfile, id: uuidv4() };
    },

  },
});

export const {
  addEditingProfile,
  updateEditProfileByPath,
  setEditingProfile,
} = settingsSlice.actions;

export default settingsSlice.reducer;
