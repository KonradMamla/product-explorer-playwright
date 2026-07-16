import { test, expect } from '@playwright/experimental-ct-react';
import { CategoryFilter } from '../CategoryFilter';
import { MOCK_CATEGORIES } from '../../../fixtures/product-mocks';

test.describe('CategoryFilter', () => {
  test('renders all categories option by default', async ({ mount }) => {
    const component = await mount(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        loading={false}
        selectedCategory=""
        onChange={() => {}}
      />,
    );

    await expect(component.getByTestId('category-select')).toBeVisible();
    await expect(component.getByTestId('category-select')).toContainText('All categories');
  });

  test('renders provided categories as options', async ({ mount }) => {
    const component = await mount(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        loading={false}
        selectedCategory=""
        onChange={() => {}}
      />,
    );

    await expect(component.getByTestId('category-select')).toContainText('Smartphones');
    await expect(component.getByTestId('category-select')).toContainText('Laptops');
  });

  test('shows loading state when loading is true', async ({ mount }) => {
    const component = await mount(
      <CategoryFilter categories={[]} loading={true} selectedCategory="" onChange={() => {}} />,
    );

    await expect(component.getByTestId('category-select')).toBeDisabled();
    await expect(component.getByTestId('category-select')).toContainText('Loading categories...');
  });

  test('calls onChange with selected category slug', async ({ mount }) => {
    let capturedCategory = '';

    const component = await mount(
      <CategoryFilter
        categories={MOCK_CATEGORIES}
        loading={false}
        selectedCategory=""
        onChange={(category) => {
          capturedCategory = category;
        }}
      />,
    );

    await component.getByTestId('category-select').selectOption('smartphones');

    expect(capturedCategory).toBe('smartphones');
  });
});
