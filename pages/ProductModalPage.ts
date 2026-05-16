import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductModalPage extends BasePage {
  readonly modal: Locator;
  private readonly closeButton: Locator;
  private readonly loadingState: Locator;
  private readonly errorState: Locator;
  readonly content: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.getByTestId('product-details-modal');
    this.closeButton = page.getByTestId('close-details-modal');
    this.loadingState = page.getByTestId('details-loading');
    this.errorState = page.getByTestId('details-error');
    this.content = page.getByTestId('details-content');
  }

  async waitForLoaded(): Promise<void> {
    await this.modal.waitFor({ state: 'visible' });
    await this.loadingState.waitFor({ state: 'hidden' });
    await this.content.waitFor({ state: 'visible' });
  }

  async close(): Promise<void> {
    await this.closeButton.click();
    await this.modal.waitFor({ state: 'hidden' });
  }

  async isOpen(): Promise<boolean> {
    return this.modal.isVisible();
  }
}
