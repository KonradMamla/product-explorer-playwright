import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { API_ROUTES } from '../helpers/api.routes';
import { TESTID_PREFIXES } from '../helpers/constants';
import { PATTERNS } from '../helpers/patterns';
import type { ProductsResponse } from '../src/types/product';

export class ProductListPage extends BasePage {
  private readonly searchInput: Locator;
  private readonly categorySelect: Locator;
  private readonly loadingState: Locator;
  readonly resultsSummary: Locator;
  private readonly clearFiltersButton: Locator;
  readonly favouritesCount: Locator;
  readonly favouritesPreview: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-input');
    this.categorySelect = page.getByTestId('category-select');
    this.loadingState = page.getByTestId('loading-state');
    this.resultsSummary = page.getByTestId('results-summary');
    this.clearFiltersButton = page.getByTestId('clear-filters-button');
    this.favouritesCount = page.getByTestId('favourites-count');
    this.favouritesPreview = page.getByTestId('favourites-preview');
  }

  async goto(): Promise<void> {
    await this.navigate('/');
  }

  async waitForProductsLoaded(): Promise<void> {
    await this.loadingState.waitFor({ state: 'hidden' });
    await this.resultsSummary.waitFor({ state: 'visible' });
  }

  async search(searchQuery: string): Promise<void> {
    await this.searchInput.fill(searchQuery);
    await this.waitForProductsLoaded();
  }

  async selectCategory(category: string): Promise<void> {
    await this.categorySelect.selectOption(category);
    await this.waitForProductsLoaded();
  }

  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
    await this.waitForProductsLoaded();
  }

  async showProductDetails(productId: number): Promise<void> {
    await this.page.getByTestId(`${TESTID_PREFIXES.SHOW_DETAILS}${productId}`).click();
  }

  async toggleFavourite(productId: number): Promise<void> {
    await this.page.getByTestId(`${TESTID_PREFIXES.TOGGLE_FAVOURITE}${productId}`).click();
  }

  allProductCards(): Locator {
    return this.page.locator(`[data-testid^="${TESTID_PREFIXES.PRODUCT_CARD}"]`);
  }

  async getFirstProductId(): Promise<number> {
    const firstCard = this.allProductCards().first();
    const testId = await firstCard.getAttribute('data-testid');
    return Number(testId?.replace(TESTID_PREFIXES.PRODUCT_CARD, ''));
  }

  async getFavouritesCount(): Promise<number> {
    const text = await this.favouritesCount.textContent();
    const match = text?.match(PATTERNS.FIRST_NUMBER);
    return match ? Number(match[0]) : 0;
  }

  async searchAndWaitForResponse(searchQuery: string): Promise<ProductsResponse> {
    const responsePromise = this.page.waitForResponse(
      (response) => response.url().includes(API_ROUTES.productSearch) && response.status() === 200,
    );

    await this.search(searchQuery);

    const response = await responsePromise;
    return response.json();
  }

  async selectCategoryAndWaitForResponse(category: string): Promise<ProductsResponse> {
    const responsePromise = this.page.waitForResponse(
      (response) =>
        response.url().includes(API_ROUTES.productsByCategory(category)) &&
        response.status() === 200,
    );

    await this.selectCategory(category);

    const response = await responsePromise;
    return response.json();
  }
}
