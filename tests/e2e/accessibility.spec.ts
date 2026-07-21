import { test, expect } from '../../fixtures';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations @regression', async ({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    productListPage,
    page,
  }) => {
    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('product details modal has no accessibility violations @regression', async ({
    productListPage,
    productModalPage,
    page,
  }) => {
    const productId = await productListPage.getFirstProductId();
    await productListPage.showProductDetails(productId);
    await productModalPage.waitForLoaded();

    const results = await new AxeBuilder({ page })
      .include('[data-testid="product-details-modal"]')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
