import { createSlice } from '@reduxjs/toolkit';

export type Banner = 'updateVersion' | '' | 'apiError';

const initialState = {
  show: false,
  message: '',
  type: <Banner>'',
};

export const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    updateBannerData: (state, action: { payload: { show: boolean, message: string, type: Banner } }) => {
      const { show, message, type } = action.payload;
      state.show = show;
      state.message = message;
      state.type = type;
    },
  },
  extraReducers: {
    'config/logout': () => initialState,
  },

});

export const {
  updateBannerData,
} = bannerSlice.actions;

export default bannerSlice.reducer;
