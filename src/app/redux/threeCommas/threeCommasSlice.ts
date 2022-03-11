import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import type { RootState } from '../store'

// import store from '../store'

import { initialState } from './initialState';

import type {
  setDataType, Type_MetricData, PerformanceMetrics, Type_SyncData,
} from './initialState';
import {
  ActiveDeals, Type_Query_Accounts, Type_Query_bots, ProfitArray,
} from '@/types/3Commas';

const dispatchError = (message: string) => {
  console.error(message);
  return undefined;
};

// const undefToZero = (value: number | undefined) => ((value) || 0);

export const threeCommasSlice = createSlice({
  name: 'threeCommas',
  initialState,
  reducers: {
    setIsSyncing: (state, action) => {
      state.isSyncing = Boolean(action.payload);
      state.isSyncingTime = Date.now();
    },
    setSyncData: (state, action: PayloadAction<Type_SyncData>) => {
      state.syncOptions = action.payload;
    },
    setAutoRefresh: (state, action: PayloadAction<boolean>) => {
      state.autoRefresh = action.payload;

      if (!action.payload) state.syncOptions = { ...state.syncOptions, syncCount: 0, time: 0 };
      if (action.payload) state.syncOptions = { ...state.syncOptions, syncCount: 0, time: new Date().getTime() };
    },
    setData: (state, action: PayloadAction<setDataType>) => {
      if (!action || !action.payload) {
        dispatchError('missing payload, action, or data.');
        return;
      }

      const { type, data } = action.payload;

      switch (type) {
        case 'botData': // update all the api data.
          state.botData = <Type_Query_bots[]>data;
          break;
        case 'profitData': // update all the api data.
          state.profitData = <ProfitArray[]>data;
          break;
        case 'metricsData':
          console.info('updating the metrics data');
          // spread operator since each metric can be updated independently.
          state.metricsData = { ...state.metricsData, ...<Type_MetricData>data };
          break;
        case 'performanceData':
          state.performanceData = { ...state.performanceData, ...<PerformanceMetrics>data };
          break;
        case 'activeDeals':
          state.activeDeals = <ActiveDeals[]>data;
          break;
        case 'accountData':
          state.accountData = { ...state.accountData, ...<Type_Query_Accounts[]>data };
          break;
        case 'balanceData':
          state.balanceData = { ...state.balanceData, ...<{ on_orders: number, position: number }>data };
          break;
        default:
          break;
      }
    },

  },
});

export const {
  setData, setIsSyncing, setSyncData, setAutoRefresh,
} = threeCommasSlice.actions;

export default threeCommasSlice.reducer;
