import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { RootState } from '../store';

import { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;

  orderByNumber: TOrder | null;
  orderByNumberRequest: boolean;

  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,

  orderByNumber: null,
  orderByNumberRequest: false,

  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);

    return {
      ...response.order,
      ingredients: ingredientIds
    };
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];

    if (!order) {
      throw new Error('Заказ не найден');
    }

    return order;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },

    clearOrderByNumber: (state) => {
      state.orderByNumber = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Ошибка оформления заказа';
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.orderByNumberRequest = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumberRequest = false;
        state.orderByNumber = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderByNumberRequest = false;
        state.orderByNumber = null;
        state.error = action.error.message ?? 'Ошибка загрузки заказа';
      });
  }
});

export const { clearOrderModalData, clearOrderByNumber } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;

export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;

export const selectOrderByNumber = (state: RootState) =>
  state.order.orderByNumber;

export const selectOrderByNumberRequest = (state: RootState) =>
  state.order.orderByNumberRequest;

export const selectOrderError = (state: RootState) => state.order.error;
