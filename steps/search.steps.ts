import { expect } from '@playwright/test';
import { test as base, createBdd } from 'playwright-bdd';
import { ProductListPage } from '../pages/ProductListPage';

const { Given, When, Then } = createBdd(base);

Given('the user is on the product explorer homepage', async ({ page }) => {
  const productListPage = new ProductListPage(page);
  await productListPage.goto();
  await productListPage.waitForProductsLoaded();
});

When('the user searches for {string}', async ({ page }, term: string) => {
  const productListPage = new ProductListPage(page);
  await productListPage.search(term);
});

When('the user clears the search', async ({ page }) => {
  const productListPage = new ProductListPage(page);
  await productListPage.clearFilters();
});

Then('the results should contain products matching {string}', async ({ page }, term: string) => {
  const productListPage = new ProductListPage(page);
  await expect(productListPage.resultsSummary).toContainText(term);
});

Then('all products should be visible again', async ({ page }) => {
  const productListPage = new ProductListPage(page);
  await expect(productListPage.allProductCards().first()).toBeVisible();
});
