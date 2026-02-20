import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { loginAsStandardUser } from './helpers/auth';
import { SHIPPING, ROUTES } from './test-data';

test.describe('Checkout', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
    await expect(page).toHaveURL(ROUTES.inventory);
  });

  test('Successful E2E purchase of a randomly selected product', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await inventoryPage.addRandomProductToCart();
    await inventoryPage.navigateToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillShippingInfo(SHIPPING.firstName, SHIPPING.lastName, SHIPPING.postalCode);
    await checkoutPage.confirmOrder();

    const confirmation = await checkoutPage.getConfirmationMessage();
    expect(confirmation).toBe('Thank you for your order!');

    // Verify cart is empty after purchase
    await page.goto(ROUTES.inventory);
    expect(await inventoryPage.isCartBadgeVisible()).toBe(false);
  });

  test('Cart reflects correct product name and price after adding an item', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    const { name, price } = await inventoryPage.addRandomProductToCart();
    await inventoryPage.navigateToCart();

    expect(await cartPage.getItemCount()).toBe(1);
    expect(await cartPage.getFirstItemName()).toBe(name);
    expect(await cartPage.getFirstItemPrice()).toBe(price);
  });

  test('Cart item can be removed before checkout', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await inventoryPage.addRandomProductToCart();
    await inventoryPage.navigateToCart();
    await cartPage.removeFirstItem();

    expect(await cartPage.getItemCount()).toBe(0);
    await page.goto(ROUTES.inventory);
    expect(await inventoryPage.isCartBadgeVisible()).toBe(false);
  });

  // Cart state should persist within the same session across page refreshes.
  // This validates that the session storage mechanism works correctly
  // and that a user won't lose their cart if they accidentally refresh.
  test('Cart state persists across page refreshes within the same session', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await inventoryPage.addRandomProductToCart();
    const badgeBefore = await inventoryPage.getCartBadgeCount();

    await page.reload();

    const badgeAfter = await inventoryPage.getCartBadgeCount();
    expect(badgeAfter).toBe(badgeBefore);
  });

});