import { test, expect } from '../../fixtures';

test.describe('Favourites', () => {
  test('adds product to favourites and updates counter @smoke', async ({ productListPage }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites', () => productListPage.toggleFavourite(productId));

    await test.step('Verify counter and preview', async () => {
      await expect(productListPage.favouritesCount).toContainText('1');
      await expect(productListPage.favouritesPreview).toBeVisible();
    });
  });

  test('removes product from favourites @smoke', async ({ productListPage }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites', () => productListPage.toggleFavourite(productId));

    await expect(productListPage.favouritesCount).toContainText('1');

    await test.step('Remove product from favourites', () =>
      productListPage.toggleFavourite(productId));

    await test.step('Verify counter reset and preview hidden', async () => {
      await expect(productListPage.favouritesCount).toContainText('0');
      await expect(productListPage.favouritesPreview).toBeHidden();
    });
  });

  test('persists favourites after page reload @regression', async ({ productListPage, page }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites', () => productListPage.toggleFavourite(productId));

    await expect(productListPage.favouritesCount).toContainText('1');

    await test.step('Reload page', async () => {
      await page.reload();
      await productListPage.waitForProductsLoaded();
    });

    await test.step('Verify favourites persisted', async () => {
      await expect(productListPage.favouritesCount).toContainText('1');
      await expect(productListPage.productCards().first()).toBeVisible();
    });
  });

  test('favourites persist correct product ids in localStorage @regression', async ({
    productListPage,
    page,
  }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites', () => productListPage.toggleFavourite(productId));

    const parsed = await test.step('Read localStorage', async () => {
      const stored = await page.evaluate(() => localStorage.getItem('product-explorer-favourites'));
      return JSON.parse(stored ?? '[]') as number[];
    });

    await test.step('Verify localStorage contains correct product id', () => {
      expect(parsed).toContain(productId);
      expect(parsed).toHaveLength(1);
    });
  });
});
