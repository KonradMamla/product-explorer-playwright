import { test, expect } from '../../fixtures';
import { API_ROUTES } from '../../helpers/api.routes';
import { ProductsResponseSchema, ProductSchema } from '../../helpers/schemas/product.schema';

test.describe('Products API — schema validation (Zod)', () => {
  test('product list response matches schema @regression', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.products);
    const body = await response.json();

    const result = ProductsResponseSchema.safeParse(body);

    expect(result.success).toBe(true);
  });

  test('single product response matches schema @regression', async ({ apiContext }) => {
    const response = await apiContext.get(API_ROUTES.productById(1));
    const body = await response.json();

    const result = ProductSchema.safeParse(body);

    expect(result.success).toBe(true);
  });
});
