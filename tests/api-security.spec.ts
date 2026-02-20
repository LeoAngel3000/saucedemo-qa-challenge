import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { loginAsStandardUser } from './helpers/auth';
import { USERS, PASSWORD, ROUTES } from './test-data';

test.describe('API Security', () => {

  test('Login request does not expose password in plaintext', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    // Intercept any POST request triggered during login
    let loginRequestBody = '';
    page.on('request', request => {
      if (request.url().includes('saucedemo.com') && request.method() === 'POST') {
        loginRequestBody = request.postData() || '';
      }
    });

    await loginPage.login(USERS.standard, PASSWORD);

    // SauceDemo is a static frontend — no real POST request is made.
    // If a POST were present, the password must never appear in plaintext.
    if (loginRequestBody) {
      expect(loginRequestBody).not.toContain(PASSWORD);
    } else {
      // No POST detected — SauceDemo handles auth client-side only.
      // Documented assumption: no server-side auth request to inspect.
      console.log('No POST request detected — SauceDemo uses client-side auth only.');
    }
  });

  // In a production app, unauthenticated requests to protected routes MUST return HTTP 401.
  // SauceDemo returns 200 for all routes regardless of auth state — a known access control gap.
  // Tag: @security-vulnerability @known-failure
  test('Unauthenticated access to a protected route should return HTTP 401', async ({ request }) => {
    const response = await request.get('https://www.saucedemo.com/inventory.html');

    // This assertion intentionally fails on SauceDemo to document the vulnerability.
    expect(response.status()).toBe(401);
  });

  // In a production app, clearing the session token should immediately invalidate access
  // and redirect the user to the login page on the next navigation attempt.
  // SauceDemo does not validate the session server-side, so it allows continued access
  // even after the token is removed — a missing access control vulnerability.
  // Tag: @security-vulnerability @known-failure
  test('Clearing the session token should redirect to login on next navigation', async ({ page }) => {
    await loginAsStandardUser(page);
    await expect(page).toHaveURL(ROUTES.inventory);

    // Simulate token theft or session expiry by clearing browser storage
    await page.evaluate(() => localStorage.clear());

    // Attempt to navigate to a protected route after token removal
    await page.goto(ROUTES.inventory);

    // A production app must redirect to login — SauceDemo will not, documenting the vulnerability
    await expect(page).toHaveURL(ROUTES.login);
  });

});