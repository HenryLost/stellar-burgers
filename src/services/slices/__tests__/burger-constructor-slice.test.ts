import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from '../burger-constructor-slice';

import {
  TConstructorIngredient,
  TIngredient
} from '../../../utils/types';

describe('burgerConstructorSlice', () => {
  const bun: TIngredient = {
    _id: 'bun-1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'bun.png',
    image_mobile: 'bun-mobile.png',
    image_large: 'bun-large.png'
  };

  const ingredient: TIngredient = {
    _id: 'main-1',
    name: 'Начинка',
    type: 'main',
    proteins: 20,
    fat: 20,
    carbohydrates: 20,
    calories: 200,
    price: 200,
    image: 'main.png',
    image_mobile: 'main-mobile.png',
    image_large: 'main-large.png'
  };

  const ingredientWithId1: TConstructorIngredient = {
    ...ingredient,
    id: 'ingredient-1'
  };

  const ingredientWithId2: TConstructorIngredient = {
    ...ingredient,
    _id: 'main-2',
    name: 'Вторая начинка',
    id: 'ingredient-2'
  };

  test('должен возвращать начальное состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });

  test('должен добавлять булку', () => {
    const state = burgerConstructorReducer(
      undefined,
      addIngredient(bun)
    );

    expect(state.bun).toEqual(bun);
    expect(state.ingredients).toEqual([]);
  });

  test('должен добавлять ингредиент с id', () => {
    const state = burgerConstructorReducer(
      undefined,
      addIngredient(ingredient)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        ...ingredient,
        id: expect.any(String)
      })
    );
  });

  test('должен удалять ингредиент', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredientWithId1, ingredientWithId2]
    };

    const state = burgerConstructorReducer(
      initialState,
      removeIngredient('ingredient-1')
    );

    expect(state.ingredients).toEqual([ingredientWithId2]);
  });

  test('должен перемещать ингредиент', () => {
    const initialState = {
      bun: null,
      ingredients: [ingredientWithId1, ingredientWithId2]
    };

    const state = burgerConstructorReducer(
      initialState,
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients).toEqual([
      ingredientWithId2,
      ingredientWithId1
    ]);
  });

  test('должен очищать конструктор', () => {
    const initialState = {
      bun,
      ingredients: [ingredientWithId1, ingredientWithId2]
    };

    const state = burgerConstructorReducer(
      initialState,
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
