import { test, expect } from '../../fixtures';
import { STORAGE_KEYS } from '../../helpers/constants';

test.describe('Favourites', () => {
  test('adds product to favourites and updates counter @smoke', async ({ productListPage }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites', () => productListPage.toggleFavourite(productId));

    await test.step('Verify counter and preview', async () => {
      expect(await productListPage.getFavouritesCount()).toBe(1);
      await expect(productListPage.favouritesPreview).toBeVisible();
    });
  });

  test('removes product from favourites @smoke', async ({ productListPage }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites', () => productListPage.toggleFavourite(productId));

    expect(await productListPage.getFavouritesCount()).toBe(1);

    await test.step('Remove product from favourites', () =>
      productListPage.toggleFavourite(productId));

    await test.step('Verify counter reset and preview hidden', async () => {
      expect(await productListPage.getFavouritesCount()).toBe(0);
      await expect(productListPage.favouritesPreview).toBeHidden();
    });
  });

  test('persists favourites after page reload @regression', async ({ productListPage, page }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites', () => productListPage.toggleFavourite(productId));

    expect(await productListPage.getFavouritesCount()).toBe(1);

    await test.step('Reload page', async () => {
      await page.reload();
      await productListPage.waitForProductsLoaded();
    });

    await test.step('Verify favourites persisted', async () => {
      expect(await productListPage.getFavouritesCount()).toBe(1);
      await expect(productListPage.allProductCards().first()).toBeVisible();
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
      const stored = await page.evaluate(
        (key) => localStorage.getItem(key),
        STORAGE_KEYS.FAVOURITES,
      );
      return JSON.parse(stored ?? '[]') as number[];
    });

    await test.step('Verify localStorage contains correct product id', () => {
      expect(parsed).toContain(productId);
      expect(parsed).toHaveLength(1);
    });
  });
});
