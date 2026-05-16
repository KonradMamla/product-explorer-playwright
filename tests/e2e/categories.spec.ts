import { test, expect } from '../../fixtures';
import { API_ROUTES } from '../../helpers/api.routes';

test.describe('Category filtering', () => {
  test('filters products by selected category @smoke', async ({ productListPage, page }) => {
    const categoryResponse = page.waitForResponse(
      (response) =>
        response.url().includes(API_ROUTES.productsByCategory('smartphones')) &&
        response.status() === 200,
    );

    await productListPage.selectCategory('smartphones');

    const response = await categoryResponse;
    const body = await response.json();

    expect(body.products).toBeDefined();
    expect(body.products.length).toBeGreaterThan(0);
    body.products.forEach((product: { category: string }) => {
      expect(product.category).toBe('smartphones');
    });

    await expect(page.getByTestId('results-summary')).toContainText('smartphones');
    await expect(productListPage.productCards()).not.toHaveCount(0);
  });

  test('clears category filter and shows all products @smoke', async ({
    productListPage,
    page,
  }) => {
    await productListPage.selectCategory('smartphones');
    await productListPage.clearFilters();

    await expect(page.getByTestId('results-summary')).not.toContainText('smartphones');
    await expect(productListPage.productCards()).not.toHaveCount(0);
  });

  test('opens product details from category results @regression', async ({
    productListPage,
    productModalPage,
    page,
  }) => {
    const detailsResponse = page.waitForResponse(
      (response) => API_ROUTES.productById.test(response.url()) && response.status() === 200,
    );

    await productListPage.selectCategory('smartphones');
    const firstCard = productListPage.productCards().first();
    const productId = await firstCard
      .getAttribute('data-testid')
      .then((id) => Number(id?.replace('product-card-', '')));

    await productListPage.showProductDetails(productId);

    const response = await detailsResponse;
    const body = await response.json();

    expect(body.id).toBeDefined();
    expect(body.category).toBe('smartphones');

    await productModalPage.waitForLoaded();
    await expect(productModalPage.content).toBeVisible();
  });
});
