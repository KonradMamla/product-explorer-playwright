import { test, expect } from '../../fixtures';
import { CATEGORIES, SEARCH_TERMS } from '../../helpers/test-data';

test.describe('Product search', () => {
  test('displays products matching search term @smoke', async ({ productListPage }) => {
    const body = await productListPage.searchAndWaitForResponse(SEARCH_TERMS.PHONE);

    expect(body.products).toBeDefined();
    expect(body.products.length).toBeGreaterThan(0);

    await expect(productListPage.allProductCards()).not.toHaveCount(0);
    await expect(productListPage.resultsSummary).toContainText(SEARCH_TERMS.PHONE);
  });

  test('shows all products after clearing search @smoke', async ({ productListPage }) => {
    await productListPage.search(SEARCH_TERMS.PHONE);
    await productListPage.clearFilters();

    await expect(productListPage.resultsSummary).not.toContainText(SEARCH_TERMS.PHONE);
    await expect(productListPage.allProductCards()).not.toHaveCount(0);
  });

  test('combines search term with category filter @regression', async ({ productListPage }) => {
    await productListPage.search(SEARCH_TERMS.PHONE);
    await productListPage.selectCategory(CATEGORIES.SMARTPHONES);

    await expect(productListPage.resultsSummary).toContainText(SEARCH_TERMS.PHONE);
    await expect(productListPage.resultsSummary).toContainText(CATEGORIES.SMARTPHONES);
    await expect(productListPage.allProductCards()).not.toHaveCount(0);
  });
});
