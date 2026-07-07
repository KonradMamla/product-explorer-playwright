import { test, expect } from '../../fixtures';
import { ProductListPage } from '../../pages/ProductListPage';

test.describe('Multi-tab behaviour', () => {
  test('favourites added in one tab are visible in a new tab @regression', async ({
    productListPage,
    context,
  }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('Add product to favourites in tab 1', () =>
      productListPage.toggleFavourite(productId));

    await expect(productListPage.favouritesCount).toContainText('1');

    const tab2 = await test.step('Open application in new tab', async () => {
      const newPage = await context.newPage();
      await newPage.goto('/');
      return new ProductListPage(newPage);
    });

    await test.step('Verify favourites count in tab 2', async () => {
      await expect(tab2.favouritesCount).toContainText('1');
    });
  });

  test('favourites state stays in sync after reload in both tabs @regression', async ({
    productListPage,
    context,
  }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    const tab2 = await test.step('Open second tab', async () => {
      const newPage = await context.newPage();
      await newPage.goto('/');
      return new ProductListPage(newPage);
    });

    await test.step('Add to favourites in tab 1', () => productListPage.toggleFavourite(productId));

    await test.step('Reload tab 2 and verify favourites persisted', async () => {
      await tab2.goto();
      await tab2.waitForProductsLoaded();
      await expect(tab2.favouritesCount).toContainText('1');
    });

    await test.step('Remove from favourites in tab 1', () =>
      productListPage.toggleFavourite(productId));

    await test.step('Reload tab 2 and verify favourites cleared', async () => {
      await tab2.goto();
      await tab2.waitForProductsLoaded();
      expect(await tab2.getFavouritesCount()).toBe(0);
    });
  });
});
