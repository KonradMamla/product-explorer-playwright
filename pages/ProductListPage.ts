import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductListPage extends BasePage {
  private readonly searchInput: Locator;
  private readonly categorySelect: Locator;
  private readonly loadingState: Locator;
  private readonly resultsSummary: Locator;
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

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.waitForProductsLoaded();
  }

  async selectCategory(slug: string): Promise<void> {
    await this.categorySelect.selectOption(slug);
    await this.waitForProductsLoaded();
  }

  async clearFilters(): Promise<void> {
    await this.clearFiltersButton.click();
    await this.waitForProductsLoaded();
  }

  getProductCard(productId: number): Locator {
    return this.page.getByTestId(`product-card-${productId}`);
  }

  async showProductDetails(productId: number): Promise<void> {
    await this.page.getByTestId(`show-details-${productId}`).click();
  }

  async toggleFavourite(productId: number): Promise<void> {
    await this.page.getByTestId(`toggle-favourite-${productId}`).click();
  }

  productCards(): Locator {
    return this.page.locator('[data-testid^="product-card-"]');
  }

  async getFirstProductId(): Promise<number> {
    const firstCard = this.productCards().first();
    const testId = await firstCard.getAttribute('data-testid');
    return Number(testId?.replace('product-card-', ''));
  }
}
