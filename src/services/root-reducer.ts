import { combineReducers } from '@reduxjs/toolkit';

import {
  ingredientsReducer,
  burgerConstructorReducer,
  feedReducer,
  userReducer,
  orderReducer,
  profileOrdersReducer
} from '@slices';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feed: feedReducer,
  user: userReducer,
  order: orderReducer,
  profileOrders: profileOrdersReducer
});
