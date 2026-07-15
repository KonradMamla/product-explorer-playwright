import { test, expect } from '../../fixtures';
import { ROUTE_PATTERNS } from '../../helpers/constants';
import { MOCK_PRODUCTS, MOCK_PRODUCT_DETAILS } from '../../fixtures/product-mocks';

test.describe('Visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(ROUTE_PATTERNS.PRODUCTS_API, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PRODUCTS),
      }),
    );

    await page.goto('/');
  });

  test('toolbar matches baseline @regression', async ({ page }) => {
    await expect(page.getByTestId('toolbar')).toHaveScreenshot('toolbar.png');
  });

  test('product grid matches baseline @regression', async ({ page }) => {
    await expect(page.getByTestId('product-grid')).toHaveScreenshot('product-grid.png');
  });

  test('product details modal matches baseline @regression', async ({ page }) => {
    await page.route(`${MOCK_PRODUCT_DETAILS.id}`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PRODUCT_DETAILS),
      }),
    );

    await page.getByTestId(`show-details-${MOCK_PRODUCT_DETAILS.id}`).click();
    await page.getByTestId('details-content').waitFor({ state: 'visible' });

    await expect(page.getByTestId('product-details-modal')).toHaveScreenshot('product-modal.png');
  });
});
