import {
  fetchIngredients,
  ingredientsReducer
} from '../ingredients-slice';

import { TIngredient } from '../../../utils/types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients = [
    {
      _id: '1',
      name: 'Краторная булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'image.png',
      image_mobile: 'image-mobile.png',
      image_large: 'image-large.png'
    }
  ] as TIngredient[];

  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(state).toEqual(initialState);
  });

  test('должен обрабатывать fetchIngredients.pending', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('requestId', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать fetchIngredients.fulfilled', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(
        mockIngredients,
        'requestId',
        undefined
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('должен обрабатывать fetchIngredients.rejected', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(
        new Error('Ошибка загрузки'),
        'requestId',
        undefined
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
