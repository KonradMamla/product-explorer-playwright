import { test, expect } from '../../fixtures';
import { ROUTE_PATTERNS } from '../../helpers/constants';
import type { Route } from '@playwright/test';

test.describe('Error handling', () => {
  test('displays error state when products API returns 500 @regression', async ({ page }) => {
    await test.step('Mock products API to return 500', () =>
      page.route(ROUTE_PATTERNS.PRODUCTS_API, (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        }),
      ));

    await test.step('Navigate to app', () => page.goto('/'));

    const errorState = page.getByTestId('error-state');

    await test.step('Verify error state is displayed with retry option', async () => {
      await expect(errorState).toBeVisible();
      await expect(errorState).toContainText('Retry');
    });
  });

  test('displays error state when products API is unreachable @regression', async ({ page }) => {
    await test.step('Mock products API to abort', () =>
      page.route(ROUTE_PATTERNS.PRODUCTS_API, (route) => route.abort()));

    await test.step('Navigate to app', () => page.goto('/'));

    const errorState = page.getByTestId('error-state');

    await test.step('Verify error state is displayed with retry option', async () => {
      await expect(errorState).toBeVisible();
      await expect(errorState).toContainText('Retry');
    });
  });

  test('recovers after retry when API becomes available @regression', async ({ page }) => {
    const errorHandler = (route: Route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });

    await test.step('Mock products API to return 500', () =>
      page.route(ROUTE_PATTERNS.PRODUCTS_API, errorHandler));

    await test.step('Navigate to app', () => page.goto('/'));

    await test.step('Verify error state is displayed', async () =>
      await expect(page.getByTestId('error-state')).toBeVisible());

    await test.step('Remove error mock', () =>
      page.unroute(ROUTE_PATTERNS.PRODUCTS_API, errorHandler));

    await test.step('Click retry button', () =>
      page.getByRole('button', { name: 'Retry' }).click());

    await test.step('Verify app recovered and shows products', async () => {
      await expect(page.getByTestId('error-state')).toBeHidden();
      await expect(page.getByTestId('results-summary')).toBeVisible();
    });
  });
});
