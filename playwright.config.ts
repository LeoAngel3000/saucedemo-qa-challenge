import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  
  // 4 workers locally for speed, 2 in CI to avoid resource constraints.
  // GitHub Actions sets the CI environment variable automatically.
  workers: process.env.CI ? 2 : 4,
  
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://www.saucedemo.com',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Smoke gate: runs on every commit — Chromium only for speed
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // Extended suite: scheduled / pre-release cross-browser validation
    // Run with: npm run test:full
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
