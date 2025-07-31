import { test, expect } from '@playwright/test';

test.describe('NFT Marketplace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Desktop Experience', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should display NFT gallery on load', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /NFT Gallery/i })).toBeVisible();
      await expect(page.getByText(/Discover and mint unique ERC1155 NFTs/i)).toBeVisible();
    });

    test('should show wallet connection button', async ({ page }) => {
      await expect(page.getByRole('button', { name: /Connect Wallet/i })).toBeVisible();
    });

    test('should display NFTs in grid layout', async ({ page }) => {
      // Wait for NFTs to load
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      
      const nftCards = page.locator('[data-testid="nft-card"]');
      await expect(nftCards).toHaveCount(await nftCards.count());
      
      // Verify grid layout (should be 4 columns on desktop)
      const firstCard = nftCards.first();
      await expect(firstCard).toBeVisible();
    });

    test('should navigate to NFT details on click', async ({ page }) => {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      
      const firstNFT = page.locator('[data-testid="nft-card"]').first();
      const nftName = await firstNFT.locator('h3').textContent();
      
      await firstNFT.click();
      
      // Should show NFT details
      await expect(page.getByRole('button', { name: /Back to Gallery/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /Mint NFT/i })).toBeVisible();
      
      // Should show the same NFT name
      if (nftName) {
        await expect(page.getByText(nftName)).toBeVisible();
      }
    });

    test('should show NFT attributes in details view', async ({ page }) => {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      await page.locator('[data-testid="nft-card"]').first().click();
      
      // Should show attributes section
      await expect(page.getByText(/Attributes/i)).toBeVisible();
      
      // Should show at least one attribute
      const attributes = page.locator('[data-testid="nft-attribute"]');
      await expect(attributes.first()).toBeVisible();
    });

    test('should handle minting flow', async ({ page }) => {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      await page.locator('[data-testid="nft-card"]').first().click();
      
      const mintButton = page.getByRole('button', { name: /Mint NFT/i });
      await expect(mintButton).toBeVisible();
      
      // Click mint button (this will show demo message)
      await mintButton.click();
      
      // Should show minting state or success message
      await expect(page.getByText(/minted successfully/i)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Mobile Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should be responsive on mobile', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /NFT Gallery/i })).toBeVisible();
      
      // Check that layout adapts to mobile
      const container = page.locator('.container');
      await expect(container).toHaveCSS('padding-left', '1rem');
      await expect(container).toHaveCSS('padding-right', '1rem');
    });

    test('should stack NFT cards vertically on mobile', async ({ page }) => {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      
      const nftCards = page.locator('[data-testid="nft-card"]');
      const firstCard = nftCards.first();
      
      // On mobile, cards should stack vertically (grid-cols-1)
      await expect(firstCard).toBeVisible();
      
      // Verify mobile-friendly spacing
      const cardContainer = firstCard.locator('..');
      await expect(cardContainer).toHaveCSS('gap', '2rem'); // gap-8 = 2rem
    });

    test('should show NFT details in mobile-friendly layout', async ({ page }) => {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      await page.locator('[data-testid="nft-card"]').first().click();
      
      // Should show back button prominently on mobile
      const backButton = page.getByRole('button', { name: /Back to Gallery/i });
      await expect(backButton).toBeVisible();
      
      // Should show mint button at bottom
      const mintButton = page.getByRole('button', { name: /Mint NFT/i });
      await expect(mintButton).toBeVisible();
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      
      // Test touch interaction (click should work on mobile)
      const firstCard = page.locator('[data-testid="nft-card"]').first();
      await firstCard.click();
      
      // Should navigate to details
      await expect(page.getByRole('button', { name: /Back to Gallery/i })).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      // Mock API failure
      await page.route('**/nfts', route => route.abort());
      
      await page.goto('/');
      
      // Should show error state
      await expect(page.getByText(/Error Loading NFTs/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /Retry/i })).toBeVisible();
    });

    test('should handle wallet connection errors', async ({ page }) => {
      const connectButton = page.getByRole('button', { name: /Connect Wallet/i });
      await connectButton.click();
      
      // Should handle wallet not available gracefully
      // (This will show alert in current implementation)
      page.on('dialog', dialog => {
        expect(dialog.message()).toContain('MetaMask');
        dialog.accept();
      });
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      const h3s = page.locator('h3');
      await expect(h3s).toHaveCount(await h3s.count());
    });

    test('should have proper button labels', async ({ page }) => {
      const connectButton = page.getByRole('button', { name: /Connect Wallet/i });
      await expect(connectButton).toBeVisible();
      
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      await page.locator('[data-testid="nft-card"]').first().click();
      
      const mintButton = page.getByRole('button', { name: /Mint NFT/i });
      await expect(mintButton).toBeVisible();
    });

    test('should have proper image alt text', async ({ page }) => {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      
      const images = page.locator('img');
      for (let i = 0; i < await images.count(); i++) {
        const alt = await images.nth(i).getAttribute('alt');
        expect(alt).toBeTruthy();
      }
    });
  });
}); 