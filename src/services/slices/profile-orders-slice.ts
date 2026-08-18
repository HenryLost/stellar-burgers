import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetchProfileOrders',
  getOrdersApi
);

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки истории заказов';
      });
  }
});

export const profileOrdersReducer = profileOrdersSlice.reducer;

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;

export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.isLoading;

export const selectProfileOrdersError = (state: RootState) =>
  state.profileOrders.error;
