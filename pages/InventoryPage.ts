import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly inventoryItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
  }

  async goto() {
    await this.page.goto('/inventory.html');
  }

  // --- Base method: index-driven cart addition ---
  // Adds a product by index and returns its name and price for later assertions.
  // All semantic methods below delegate to this one.

  async addProductToCart(index: number): Promise<{ name: string; price: string }> {
    const item = this.inventoryItems.nth(index);
    const name = await item.locator('[data-test="inventory-item-name"]').innerText();
    const price = await item.locator('[data-test="inventory-item-price"]').innerText(); 
    await item.locator('[data-test^="add-to-cart-"]').click();
    return { name, price };
  }

  // --- Semantic public methods ---

  // Adds a randomly selected product — used in E2E and smoke tests
  // where the specific product doesn't matter, only the flow does.
  async addRandomProductToCart(): Promise<{ name: string; price: string }> {
    const count = await this.inventoryItems.count();
    const randomIndex = Math.floor(Math.random() * count);
    return await this.addProductToCart(randomIndex);
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.innerText();
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }
}