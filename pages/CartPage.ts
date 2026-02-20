import { Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.removeButtons = page.locator('[data-test^="remove"]');
  }

  // --- Base method: index-driven access ---
  // All semantic methods below delegate to this one, keeping logic in one place.
  // If the cart structure ever changes, only this method needs updating.

  private async getItemName(index: number): Promise<string> {
    return await this.cartItems.nth(index).locator('[data-test="inventory-item-name"]').innerText();
  }

  private async getItemPrice(index: number): Promise<string> {
    return await this.cartItems.nth(index).locator('[data-test="inventory-item-price"]').innerText();
  }

  private async removeItem(index: number): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  // --- Semantic public methods ---
  // These make test code readable without exposing index details to the caller.

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getItemByIndex(index: number): Promise<{ name: string; price: string }> {
    return {
      name: await this.getItemName(index),
      price: await this.getItemPrice(index),
    };
  }

  async getFirstItemName(): Promise<string> {
    return await this.getItemName(0);
  }

  async getFirstItemPrice(): Promise<string> {
    return await this.getItemPrice(0);
  }

  async removeFirstItem(): Promise<void> {
    await this.removeItem(0);
  }

  async removeItemByIndex(index: number): Promise<void> {
    await this.removeItem(index);
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}