import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Disable webServer in CI - we'll start it manually in the workflow
  ...(process.env.CI ? {} : {
    webServer: {
      command: 'pnpm dev',
      url: 'http://localhost:5173',
      reuseExistingServer: true,
      timeout: 120 * 1000,
    },
  }),
}); 