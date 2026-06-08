import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../tests/test-data';

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly confirmationHeader: Locator;
  readonly errorMessageLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.confirmationHeader = page.locator('[data-test="complete-header"]');
    this.errorMessageLocator = page.locator('[data-test="error"]');
  }

  async goto(): Promise<void> {
    await this.page.goto(ROUTES.checkoutStep1);
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  async confirmOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async getConfirmationMessage(): Promise<string> {
    return await this.confirmationHeader.innerText();
  }

  /**
   * Delegates to BasePage.getErrorMessage() — same pattern as LoginPage.
   * Both share [data-test="error"] but each manages its own locator instance.
   */
  async getErrorMessage(): Promise<string> {
    return await super.getErrorMessage(this.errorMessageLocator);
  }
}