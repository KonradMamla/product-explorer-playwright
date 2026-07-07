import { test, expect } from '../../fixtures';
import { CATEGORIES } from '../../helpers/test-data';
import { PATTERNS } from '../../helpers/patterns';

test.describe('Category filtering', () => {
  test('filters products by selected category @smoke', async ({ productListPage }) => {
    const body = await productListPage.selectCategoryAndWaitForResponse(CATEGORIES.SMARTPHONES);

    expect(body.products).not.toHaveLength(0);
    body.products.forEach((product) => {
      expect(product.category).toBe(CATEGORIES.SMARTPHONES);
    });

    await expect(productListPage.resultsSummary).toContainText(CATEGORIES.SMARTPHONES);
    await expect(productListPage.allProductCards()).not.toHaveCount(0);
  });

  test('clears category filter and shows all products @smoke', async ({ productListPage }) => {
    await productListPage.selectCategory(CATEGORIES.SMARTPHONES);
    await productListPage.clearFilters();

    await expect(productListPage.resultsSummary).not.toContainText(CATEGORIES.SMARTPHONES);
    await expect(productListPage.allProductCards()).not.toHaveCount(0);
  });

  test('opens product details from category results @regression', async ({
    productListPage,
    productModalPage,
    page,
  }) => {
    const detailsResponse = page.waitForResponse(
      (response) => PATTERNS.PRODUCT_ENDPOINT.test(response.url()) && response.status() === 200,
    );

    await productListPage.selectCategory(CATEGORIES.SMARTPHONES);
    const productId = await productListPage.getFirstProductId();
    await productListPage.showProductDetails(productId);

    const response = await detailsResponse;
    const body = await response.json();

    expect(body.id).toBeGreaterThan(0);
    expect(body.category).toBe(CATEGORIES.SMARTPHONES);

    await productModalPage.waitForLoaded();
    await expect(productModalPage.content).toBeVisible();
  });
});
