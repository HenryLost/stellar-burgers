import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { RootState } from '../store';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (
        state,
        action: PayloadAction<TIngredient | TConstructorIngredient>
      ) => {
        const ingredient = action.payload;

        if (ingredient.type === 'bun') {
          state.bun = ingredient;
          return;
        }

        state.ingredients.push(ingredient as TConstructorIngredient);
      },

      prepare: (ingredient: TIngredient) => ({
        payload:
          ingredient.type === 'bun'
            ? ingredient
            : {
                ...ingredient,
                id: uuidv4()
              }
      })
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;

      const [movedIngredient] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, movedIngredient);
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;

export const burgerConstructorReducer = burgerConstructorSlice.reducer;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;
