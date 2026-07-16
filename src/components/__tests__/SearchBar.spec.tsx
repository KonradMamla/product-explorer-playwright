import { test, expect } from '@playwright/experimental-ct-react';
import { SearchBar } from '../SearchBar';

test.describe('SearchBar', () => {
  test('renders search input with correct placeholder', async ({ mount }) => {
    const component = await mount(<SearchBar value="" onChange={() => {}} />);

    await expect(component.getByTestId('search-input')).toBeVisible();
    await expect(component.getByTestId('search-input')).toHaveAttribute(
      'placeholder',
      'Try: phone, perfume, chair',
    );
  });

  test('displays provided value in input', async ({ mount }) => {
    const component = await mount(<SearchBar value="phone" onChange={() => {}} />);

    await expect(component.getByTestId('search-input')).toHaveValue('phone');
  });

  test('renders search label', async ({ mount }) => {
    const component = await mount(<SearchBar value="" onChange={() => {}} />);

    await expect(component.getByText('Search products')).toBeVisible();
  });

  test('calls onChange with input value when user types', async ({ mount }) => {
    let capturedValue = '';

    const component = await mount(
      <SearchBar
        value=""
        onChange={(value) => {
          capturedValue = value;
        }}
      />,
    );

    await component.getByTestId('search-input').fill('laptop');

    expect(capturedValue).toBe('laptop');
  });
});
