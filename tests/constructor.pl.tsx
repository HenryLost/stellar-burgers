import ingredientsMock from './hars/d865ae765d0bd24d2055469500cc7f17b1056715.json';
import orderMock from './hars/order.json';
import { expect, test, type Page } from '@playwright/test';

const openConstructorPage = async (page: Page) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/ingredients'
  });

  await page.goto('/');
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await openConstructorPage(page);
  });

  test('добавляет булку в конструктор', async ({ page }) => {
    const ingredientCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Краторная булка N-200i' });

    const constructor = page.getByTestId('burger-constructor');

    await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Краторная булка N-200i (низ)')
    ).toBeVisible();
  });

  test('добавляет начинку в конструктор', async ({ page }) => {
    const ingredientCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    const constructor = page.getByTestId('burger-constructor');

    await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    await expect(constructor.getByText('Выберите начинку')).not.toBeVisible();
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await openConstructorPage(page);
  });

  test('открывает модальное окно с данными выбранного ингредиента', async ({
    page
  }) => {
    const ingredient = ingredientsMock.data.find(
      (item) => item.name === 'Краторная булка N-200i'
    );

    expect(ingredient).toBeDefined();

    await page.getByText('Краторная булка N-200i').first().click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();
    await expect(modal.getByText('Детали ингредиента')).toBeVisible();
    await expect(modal.getByText(ingredient!.name)).toBeVisible();
    await expect(modal.getByText(String(ingredient!.calories))).toBeVisible();
    await expect(modal.getByText(String(ingredient!.proteins))).toBeVisible();
    await expect(modal.getByText(String(ingredient!.fat))).toBeVisible();
    await expect(
      modal.getByText(String(ingredient!.carbohydrates))
    ).toBeVisible();
  });

  test('закрывает модальное окно ингредиента по крестику', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });

  test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
    await page.getByText('Краторная булка N-200i').first().click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await page.getByTestId('modal-overlay').click({
      position: { x: 10, y: 10 }
    });

    await expect(modal).not.toBeVisible();
  });
});

test.describe('Создание заказа', () => {
  test('создаёт заказ и очищает конструктор', async ({ page, context }) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients'
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'mock-access-token',
        domain: 'localhost',
        path: '/'
      }
    ]);

    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.route('**/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        path: './tests/hars/user.json'
      });
    });

    await page.route('**/orders', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          path: './tests/hars/order.json'
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/');

    const constructor = page.getByTestId('burger-constructor');

    const bunCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Краторная булка N-200i' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    const fillingCard = page
      .getByRole('listitem')
      .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

    await fillingCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      constructor.getByText('Краторная булка N-200i (верх)')
    ).toBeVisible();

    await expect(
      constructor.getByText('Биокотлета из марсианской Магнолии')
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');

    await expect(modal).toBeVisible();

    await expect(modal.getByText(String(orderMock.order.number))).toBeVisible();

    await expect(constructor.getByText('Выберите булки').first()).toBeVisible();

    await expect(constructor.getByText('Выберите начинку')).toBeVisible();

    await page.getByTestId('modal-close').click();

    await expect(modal).not.toBeVisible();
  });
});
