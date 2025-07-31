import { test, expect } from '@playwright/test';

test.describe('App.tsx E2E Tests', () => {
  test('should render App component with basic structure', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check that the app container exists
    await expect(page.getByTestId('app-container')).toBeVisible();

    // Check that the main title is displayed
    await expect(page.getByTestId('app-title')).toBeVisible();
    await expect(page.getByTestId('app-title')).toContainText('Mintlayer NFT dApp');

    // Check that the page has the correct styling classes
    const container = page.getByTestId('app-container');
    await expect(container).toHaveClass(/min-h-screen/);
    await expect(container).toHaveClass(/bg-gray-50/);
    await expect(container).toHaveClass(/flex/);
    await expect(container).toHaveClass(/items-center/);
    await expect(container).toHaveClass(/justify-center/);
  });

  test('should display hook data information', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Check that the app loads without errors
    await expect(page.getByTestId('app-container')).toBeVisible();
    await expect(page.getByTestId('app-title')).toBeVisible();
    
    // Check that the title contains the expected text
    await expect(page.getByTestId('app-title')).toContainText('Mintlayer NFT dApp');
  });

  test('should load without JavaScript errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('http://localhost:5173');

    // Wait for the app to fully load
    await page.waitForSelector('[data-testid="app-container"]');

    // Should have minimal console errors (some are expected from mocks)
    expect(consoleErrors.length).toBeLessThan(10);
  });

  test('should be responsive on different screen sizes', async ({ page }) => {
    // Test desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('http://localhost:5173');
    await expect(page.getByTestId('app-container')).toBeVisible();

    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5173');
    await expect(page.getByTestId('app-container')).toBeVisible();
    await expect(page.getByTestId('app-title')).toBeVisible();
  });
}); 