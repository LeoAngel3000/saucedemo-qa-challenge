import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../tests/test-data';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessageLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.login);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Delegates to BasePage.getErrorMessage() — no duplicated logic here.
   * Both LoginPage and CheckoutPage share the same [data-test="error"] pattern,
   * but each passes its own locator instance to keep them decoupled.
   */
  async getErrorMessage(): Promise<string> {
    return await super.getErrorMessage(this.errorMessageLocator);
  }
}