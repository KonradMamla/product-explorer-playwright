import { test, expect } from '../../fixtures';
import { API_ROUTES } from '../../helpers/api.routes';

test.describe('Product search', () => {
  test('displays products matching search term @smoke', async ({ productListPage, page }) => {
    const searchResponse = page.waitForResponse(
      (response) => response.url().includes(API_ROUTES.productSearch) && response.status() === 200,
    );

    await productListPage.search('phone');

    const response = await searchResponse;
    const body = await response.json();

    expect(body.products).toBeDefined();
    expect(body.products.length).toBeGreaterThan(0);

    await expect(productListPage.productCards()).not.toHaveCount(0);
    await expect(page.getByTestId('results-summary')).toContainText('phone');
  });

  test('shows all products after clearing search @smoke', async ({ productListPage, page }) => {
    await productListPage.search('phone');
    await productListPage.clearFilters();

    await expect(page.getByTestId('results-summary')).not.toContainText('phone');
    await expect(productListPage.productCards()).not.toHaveCount(0);
  });

  test('combines search term with category filter @regression', async ({
    productListPage,
    page,
  }) => {
    await productListPage.search('phone');
    await productListPage.selectCategory('smartphones');

    await expect(page.getByTestId('results-summary')).toContainText('phone');
    await expect(page.getByTestId('results-summary')).toContainText('smartphones');
    await expect(productListPage.productCards()).not.toHaveCount(0);
  });
});
