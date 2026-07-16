import { test, expect } from '../../fixtures';
import type { Product, ProductsResponse, ProductPreview } from '../../src/types/product';
import { API_ROUTES } from '../../helpers/api.routes';
import { SEARCH_TERMS, PRODUCT_IDS } from '../../helpers/test-data';
import { API_PARAMS } from '../../helpers/constants';
import { assertValidProduct } from '../../helpers/assertions';

test.describe('Products API', () => {
  test('returns product list with correct schema @smoke', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.products);

    expect(response.status()).toBe(200);

    const body: ProductsResponse = await response.json();

    expect(Array.isArray(body.products)).toBe(true);
    expect(body.total).toBeGreaterThan(0);
    expect(body.skip).toBe(0);
    expect(body.limit).toBeGreaterThan(0);

    const firstProduct: ProductPreview = body.products[0];
    assertValidProduct(firstProduct);
  });

  test('returns matching products for search query @smoke', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.productSearch, {
      params: {
        [API_PARAMS.SEARCH_QUERY_KEY]: SEARCH_TERMS.PHONE,
        limit: API_PARAMS.DEFAULT_LIMIT,
      },
    });

    expect(response.status()).toBe(200);

    const body: ProductsResponse = await response.json();

    expect(body.products).not.toHaveLength(0);
    body.products.forEach((product: Product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(SEARCH_TERMS.PHONE) ||
        product.description.toLowerCase().includes(SEARCH_TERMS.PHONE) ||
        product.category.toLowerCase().includes(SEARCH_TERMS.PHONE);
      expect(matchesSearch).toBe(true);
    });
  });

  test('returns single product with correct schema @smoke', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.productById(PRODUCT_IDS.VALID));

    expect(response.status()).toBe(200);

    const body: Product = await response.json();

    expect(body.id).toBe(PRODUCT_IDS.VALID);
    assertValidProduct(body);
  });

  test('returns 404 for non-existent product @regression', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.productById(PRODUCT_IDS.NONEXISTENT));

    expect(response.status()).toBe(404);
  });

  test('returns empty results for nonsense search query @regression', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.productSearch, {
      params: {
        [API_PARAMS.SEARCH_QUERY_KEY]: SEARCH_TERMS.NO_RESULTS,
        limit: API_PARAMS.DEFAULT_LIMIT,
      },
    });

    expect(response.status()).toBe(200);

    const body: ProductsResponse = await response.json();

    expect(body.products).toHaveLength(0);
    expect(body.total).toBe(0);
  });
});
