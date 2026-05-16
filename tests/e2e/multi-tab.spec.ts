import { test, expect } from '../../fixtures';

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
      return newPage;
    });

    await test.step('Verify favourites count in tab 2', async () => {
      await expect(tab2.getByTestId('favourites-count')).toContainText('1');
    });

    await tab2.close();
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
      return newPage;
    });

    await test.step('Add to favourites in tab 1', () => productListPage.toggleFavourite(productId));

    await test.step('Reload tab 2 and verify favourites persisted', async () => {
      await tab2.reload();
      await tab2.waitForLoadState('domcontentloaded');
      await expect(tab2.getByTestId('favourites-count')).toContainText('1');
    });

    await test.step('Remove from favourites in tab 1', () =>
      productListPage.toggleFavourite(productId));

    await test.step('Reload tab 2 and verify favourites cleared', async () => {
      await tab2.reload();
      await tab2.waitForLoadState('domcontentloaded');
      await expect(tab2.getByTestId('favourites-count')).toContainText('0');
    });

    await tab2.close();
  });
});
