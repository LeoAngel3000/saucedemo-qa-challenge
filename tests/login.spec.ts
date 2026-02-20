import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { loginAsStandardUser } from './helpers/auth';
import { USERS, PASSWORD } from './test-data';

test.describe('Login', () => {

  test('Successful login with valid credentials', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);

    await loginAsStandardUser(page);

    await expect(page).toHaveURL('/inventory.html');
    await expect(inventoryPage.inventoryItems.first()).toBeVisible();
    // I would like to check that the right user is logged in, but SauceDemo does not display the username anywhere after login,
    // or the API return a user specific ID.

  });

  test('Unsuccessful login displays a generic error message', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(USERS.standard, 'wrong_password');

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Username and password do not match any user in this service');
  });

  // Based on OWASP guidelines, account lockout should trigger after 5 consecutive failed attempts.
  // This test documents that SauceDemo does NOT implement lockout — a brute force vulnerability.
  // The 6th attempt is expected to show a lockout message, but SauceDemo shows the generic error instead.
  // Tag: @security-vulnerability @known-failure
  test('No account lockout after multiple failed login attempts (brute force vulnerability)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    const invalidPasswords = [
      'bad_password1',
      'bad_password2',
      'bad_password3',
      'bad_password4',
      'bad_password5',
    ];

    // Attempts 1–5: generic error expected each time (no lockout)
    for (const password of invalidPasswords) {
      await loginPage.login(USERS.standard, password);
      const error = await loginPage.getErrorMessage();
      expect(error).toContain('Username and password do not match any user in this service');
      await loginPage.goto();
    }

    // Attempt 6: lockout message SHOULD appear per OWASP standard.
    // This assertion is the known failure that documents the vulnerability.
    await loginPage.login(USERS.standard, 'bad_password6');
    const finalError = await loginPage.getErrorMessage();
    expect(finalError).toContain('Account locked');
  });

});