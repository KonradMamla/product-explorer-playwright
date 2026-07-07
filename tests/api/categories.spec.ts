import { test, expect } from '../../fixtures';
import type { ProductCategory, ProductsResponse, ProductPreview } from '../../src/types/product';
import { API_ROUTES } from '../../helpers/api.routes';
import { CATEGORIES } from '../../helpers/test-data';
import { PATTERNS } from '../../helpers/patterns';

test.describe('Categories API', () => {
  test('returns category list with correct schema @smoke', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.categories);

    expect(response.status()).toBe(200);

    const body: ProductCategory[] = await response.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body).not.toHaveLength(0);

    const firstCategory = body[0];
    expect(firstCategory.slug).toBeTruthy();
    expect(firstCategory.name).toBeTruthy();
    expect(firstCategory.url).toMatch(PATTERNS.URL);
  });

  test('returns products for valid category slug @smoke', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.productsByCategory(CATEGORIES.SMARTPHONES));

    expect(response.status()).toBe(200);

    const body: ProductsResponse = await response.json();

    expect(body.products).not.toHaveLength(0);
    body.products.forEach((product: ProductPreview) => {
      expect(product.category).toBe(CATEGORIES.SMARTPHONES);
    });
  });

  test('returns 200 with empty results for unknown category @regression', async ({
    apiContext,
  }) => {
    const response = await apiContext.get(API_ROUTES.productsByCategory(CATEGORIES.NONEXISTENT));

    expect(response.status()).toBe(200);

    const body: ProductsResponse = await response.json();

    expect(body.products).toHaveLength(0);
    expect(body.total).toBe(0);
  });

  test('response time is within acceptable range @regression', async ({ apiContext }) => {
    const start = Date.now();
    const response = await apiContext.get(API_ROUTES.categories);
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(3000);
  });
});
