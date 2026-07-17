import { test, expect } from '@playwright/experimental-ct-react';
import { ProductCard } from '../ProductCard';
import { MOCK_PRODUCT_DETAILS } from '../../../fixtures/product-mocks';
import { TESTID_PREFIXES } from '../../../helpers/constants';

test.describe('ProductCard', () => {
  test('renders product title, price and category', async ({ mount }) => {
    const component = await mount(
      <ProductCard
        product={MOCK_PRODUCT_DETAILS}
        isFavourite={false}
        onOpenDetails={() => {}}
        onToggleFavourite={() => {}}
      />,
    );

    await expect(component.getByRole('heading')).toContainText(MOCK_PRODUCT_DETAILS.title);
    await expect(component).toContainText(`$${MOCK_PRODUCT_DETAILS.price}`);
    await expect(component).toContainText(MOCK_PRODUCT_DETAILS.category);
  });

  test('shows "Add to favourites" when product is not favourite', async ({ mount }) => {
    const component = await mount(
      <ProductCard
        product={MOCK_PRODUCT_DETAILS}
        isFavourite={false}
        onOpenDetails={() => {}}
        onToggleFavourite={() => {}}
      />,
    );

    await expect(
      component.getByTestId(`${TESTID_PREFIXES.TOGGLE_FAVOURITE}${MOCK_PRODUCT_DETAILS.id}`),
    ).toContainText('Add to favourites');
  });

  test('shows "Remove from favourites" when product is favourite', async ({ mount }) => {
    const component = await mount(
      <ProductCard
        product={MOCK_PRODUCT_DETAILS}
        isFavourite={true}
        onOpenDetails={() => {}}
        onToggleFavourite={() => {}}
      />,
    );

    await expect(
      component.getByTestId(`${TESTID_PREFIXES.TOGGLE_FAVOURITE}${MOCK_PRODUCT_DETAILS.id}`),
    ).toContainText('Remove from favourites');
  });

  test('calls onOpenDetails with product id when Show details clicked', async ({ mount }) => {
    let capturedId = 0;

    const component = await mount(
      <ProductCard
        product={MOCK_PRODUCT_DETAILS}
        isFavourite={false}
        onOpenDetails={(id) => {
          capturedId = id;
        }}
        onToggleFavourite={() => {}}
      />,
    );

    await component
      .getByTestId(`${TESTID_PREFIXES.SHOW_DETAILS}${MOCK_PRODUCT_DETAILS.id}`)
      .click();

    expect(capturedId).toBe(MOCK_PRODUCT_DETAILS.id);
  });

  test('calls onToggleFavourite with product id when favourite button clicked', async ({
    mount,
  }) => {
    let capturedId = 0;

    const component = await mount(
      <ProductCard
        product={MOCK_PRODUCT_DETAILS}
        isFavourite={false}
        onOpenDetails={() => {}}
        onToggleFavourite={(id) => {
          capturedId = id;
        }}
      />,
    );

    await component
      .getByTestId(`${TESTID_PREFIXES.TOGGLE_FAVOURITE}${MOCK_PRODUCT_DETAILS.id}`)
      .click();

    expect(capturedId).toBe(MOCK_PRODUCT_DETAILS.id);
  });
});
