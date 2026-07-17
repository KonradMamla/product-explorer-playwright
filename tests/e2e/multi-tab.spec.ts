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

  test('two users in separate contexts have isolated favourites @regression', async ({
    productListPage,
    browser,
  }) => {
    const productId = await test.step('Get first product id', () =>
      productListPage.getFirstProductId());

    await test.step('User A adds product to favourites', () =>
      productListPage.toggleFavourite(productId));

    await test.step('Verify User A sees 1 favourite', async () => {
      await expect(productListPage.favouritesCount).toContainText('1');
    });

    const userBContext = await test.step('Open separate browser context for User B', () =>
      browser.newContext());

    const userBPage = await test.step('User B opens application', async () => {
      const page = await userBContext.newPage();
      await page.goto('/');
      return new ProductListPage(page);
    });

    await test.step('Verify User B sees 0 favourites', async () => {
      await userBPage.waitForProductsLoaded();
      await expect(userBPage.favouritesCount).toContainText('0');
    });

    await userBContext.close();
  });
});
