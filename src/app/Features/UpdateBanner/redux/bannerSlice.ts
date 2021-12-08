import { createSlice } from '@reduxjs/toolkit';

export type banner = 'updateVersion' | '' | 'apiError'

const initialState = {
    show: false,
    message: '',
    type: <banner> ''
}


export const bannerSlice = createSlice({
    name: 'banner',
    initialState,
    reducers: {
        updateBannerData: (state, action: {payload: {show: boolean, message: string, type: banner}}) => {
            const {show, message, type} = action.payload
            state.show = show;
            state.message = message
            state.type = type
        }
    }
})

export const {
    updateBannerData
} = bannerSlice.actions;

export default bannerSlice.reducer