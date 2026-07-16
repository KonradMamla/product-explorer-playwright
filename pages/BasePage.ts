import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  private async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageReady();
  }
}
