import { Page } from '@playwright/test';
import { USERS, PASSWORD } from '../test-data';
import { LoginPage } from '../../pages/LoginPage';

/**
 * Generic login helper — accepts any username from the USERS object.
 * Use this when writing tests that need to authenticate with different user types.
 */
export async function loginAs(page: Page, username: string): Promise<void> {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(username, PASSWORD);
}

/**
 * Semantic shortcut for the most common auth scenario in this suite.
 * All smoke tests and E2E flows use standard_user — this keeps test code readable.
 *
 * Example usage:
 *   test.beforeEach(async ({ page }) => {
 *     await loginAsStandardUser(page);
 *   });
 */
export async function loginAsStandardUser(page: Page): Promise<void> {
  await loginAs(page, USERS.standard);
}
