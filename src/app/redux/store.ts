import { configureStore } from '@reduxjs/toolkit';
import configSlice from '@/app/redux/config/configSlice';
import threeCommasSlice from '@/app/redux/threeCommas/threeCommasSlice';
import settingsSlice from '@/app/Pages/Settings/Redux/settingsSlice';
import bannerSlice from '@/app/Features/UpdateBanner/redux/bannerSlice';

const store = configureStore({
  reducer: {
    config: configSlice,
    threeCommas: threeCommasSlice,
    settings: settingsSlice,
    banner: bannerSlice,
  },
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
