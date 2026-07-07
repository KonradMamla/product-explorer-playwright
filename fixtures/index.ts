import { test as base, request } from '@playwright/test';
import { ProductListPage } from '../pages/ProductListPage';
import { ProductModalPage } from '../pages/ProductModalPage';
import { BASE_URLS } from '../helpers/constants';

type Fixtures = {
  productListPage: ProductListPage;
  productModalPage: ProductModalPage;
  apiContext: Awaited<ReturnType<typeof request.newContext>>;
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

  apiContext: async ({}, use) => {
    const context = await request.newContext({
      baseURL: BASE_URLS.API,
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });

    await use(context);

    await context.dispose();
  },
});

export { expect } from '@playwright/test';
