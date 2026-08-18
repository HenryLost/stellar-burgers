import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/mocks/ingredients.har', {
    url: '**/ingredients'
  });

  await page.goto('/');
});

test('добавляет булку в конструктор', async ({ page }) => {
  const ingredientCard = page
    .getByRole('listitem')
    .filter({ hasText: 'Краторная булка N-200i' });

  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

  await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();

  await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();
});

test('добавляет начинку в конструктор', async ({ page }) => {
  const ingredientCard = page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

  await ingredientCard.getByRole('button', { name: 'Добавить' }).click();

  await expect(
    page.getByText('Биокотлета из марсианской Магнолии').last()
  ).toBeVisible();

  await expect(page.getByText('Выберите начинку')).not.toBeVisible();
});

test('открывает модальное окно ингредиента', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();
});

test('закрывает модальное окно ингредиента по крестику', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  await page.locator('#modals button').click();

  await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
});

test('закрывает модальное окно ингредиента по оверлею', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  const overlay = page.locator('#modals > div').last();

  await overlay.click({
    position: { x: 10, y: 10 }
  });

  await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
});

test('создаёт заказ', async ({ page, context }) => {
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
      path: './tests/mocks/user.json'
    });
  });

  await page.route('**/orders', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        path: './tests/mocks/order.json'
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/');

  const bunCard = page
    .getByRole('listitem')
    .filter({ hasText: 'Краторная булка N-200i' });

  await bunCard.getByRole('button', { name: 'Добавить' }).click();

  const fillingCard = page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' });

  await fillingCard.getByRole('button', { name: 'Добавить' }).click();

  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  await expect(page.getByText('123456')).toBeVisible();

  await expect(page.getByText('Выберите булки').first()).toBeVisible();

  await expect(page.getByText('Выберите начинку')).toBeVisible();

  await page.locator('#modals button').click();

  await expect(page.getByText('123456')).not.toBeVisible();
});
