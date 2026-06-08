import { Page, Locator } from '@playwright/test';

/**
 * BasePage — Abstract base class for all Page Objects.
 *
 * Centralizes shared state (page instance) and common utility methods
 * that any page might need. Forces all pages to implement `goto()`,
 * ensuring navigability is a first-class contract across the suite.
 *
 * All Page Objects MUST extend this class.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to this page's URL.
   * Each subclass defines its own route — centralizing navigation logic there.
   */
  abstract goto(): Promise<void>;

  /**
   * Returns the text of a visible error message element.
   * Reusable across any page that shows validation or auth errors.
   */
  async getErrorMessage(locator: Locator): Promise<string> {
    return await locator.innerText();
  }

  /**
   * Returns the current page's <title>.
   * Useful for assertions that verify the correct page was loaded.
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Waits until the browser URL matches the given pattern.
   * Accepts a string (exact match) or RegExp (partial match).
   */
  async waitForURL(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url);
  }
}