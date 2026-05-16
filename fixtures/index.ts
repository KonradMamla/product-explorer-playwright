import { test as base } from '@playwright/test';
import { ProductListPage } from '../pages/ProductListPage';
import { ProductModalPage } from '../pages/ProductModalPage';

type Fixtures = {
  productListPage: ProductListPage;
  productModalPage: ProductModalPage;
};

export const test = base.extend<Fixtures>({
  productListPage: async ({ page }, use) => {
    const productListPage = new ProductListPage(page);
    await productListPage.goto();
    await productListPage.waitForProductsLoaded();

    await use(productListPage);

    await page.evaluate(() => localStorage.clear());
  },

  productModalPage: async ({ page }, use) => {
    await use(new ProductModalPage(page));
  },
});

export { expect } from '@playwright/test';
