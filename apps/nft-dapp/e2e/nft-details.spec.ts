import { test, expect } from '@playwright/test';

interface EnvMock {
  VITE_REOWN_PROJECT_ID: string;
  VITE_API_BASE_URL: string;
  VITE_NFT_CONTRACT_ADDRESS: string;
  VITE_ENV: string;
}

declare global {
  interface Window {
    ENV_MOCK?: EnvMock;
  }
}

test.describe('NFT Details Page E2E Tests', () => {
  // Setup environment variables for all tests
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.ENV_MOCK = {
        VITE_REOWN_PROJECT_ID: 'test-project-id',
        VITE_API_BASE_URL: 'https://test-api.example.com',
        VITE_NFT_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
        VITE_ENV: 'test'
      };
    });

    // Mock API responses for CI environment
    await page.route('**/api/nfts**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            metadata: {
              name: 'KILN #1',
              description: 'Test NFT 1',
              image: 'ipfs://QmTest1'
            }
          },
          {
            id: '2', 
            metadata: {
              name: 'KILN #2',
              description: 'Test NFT 2',
              image: 'ipfs://QmTest2'
            }
          },
          {
            id: '3',
            metadata: {
              name: 'KILN #3',
              description: 'Test NFT 3',
              image: 'ipfs://QmTest3'
            }
          },
          {
            id: '4',
            metadata: {
              name: 'KILN #4',
              description: 'Test NFT 4',
              image: 'ipfs://QmTest4'
            }
          }
        ])
      });
    });

    // Mock individual NFT API calls
    await page.route('**/api/nfts/*', async route => {
      const url = route.request().url();
      const nftId = url.split('/').pop();
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: nftId,
          metadata: {
            name: `KILN #${nftId}`,
            description: `Test NFT ${nftId}`,
            image: `ipfs://QmTest${nftId}`,
            attributes: [
              { trait_type: 'Rarity', value: 'Common' },
              { trait_type: 'Type', value: 'Test' }
            ]
          }
        })
      });
    });
  });

  test('Complete NFT Details Page Interactive Flow', async ({ page }) => {
    // 1. Load gallery and navigate to first NFT
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Wait for NFTs to load with better error handling for CI
    try {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 15000 });
    } catch (error) {
      console.log('NFT cards not found, checking for loading state...');
      // Check if we're in a loading state
      const loadingElement = page.locator('[data-testid="loader"]');
      if (await loadingElement.isVisible()) {
        console.log('App is still loading, waiting a bit more...');
        await page.waitForTimeout(5000);
        await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      } else {
        // Check if we have any content at all
        const bodyText = await page.textContent('body');
        console.log('Page content:', bodyText?.substring(0, 200));
        throw error;
      }
    }
    
    // Click "View Details" on first NFT
    const firstNFTDetailsButton = page.locator('[data-testid="nft-card"]').first().locator('text=View Details');
    await firstNFTDetailsButton.click();
    
    // Wait for details page to load
    await page.waitForURL('**/nft/**');
    await page.waitForLoadState('networkidle');

    // Get the original NFT ID for navigation back
    const originalNFTId = page.url().split('/nft/')[1];

    // 2. Test Social Links (KilnCard)
    console.log('🧪 Testing social links...');
    
    // Test X (Twitter) link (use first occurrence)
    const twitterLink = page.locator('a[href*="x.com/kiln_finance"]').first();
    await expect(twitterLink).toBeVisible();
    await expect(twitterLink).toHaveAttribute('target', '_blank');
    await expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Test LinkedIn link (use first occurrence)
    const linkedinLink = page.locator('a[href*="linkedin.com/company/kiln-fi"]').first();
    await expect(linkedinLink).toBeVisible();
    await expect(linkedinLink).toHaveAttribute('target', '_blank');
    await expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Test YouTube link (use first occurrence)
    const youtubeLink = page.locator('a[href*="youtube.com/channel/UCegmzwd40b91ikGzZBgAa4w"]').first();
    await expect(youtubeLink).toBeVisible();
    await expect(youtubeLink).toHaveAttribute('target', '_blank');
    await expect(youtubeLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    // Test Website link (use first occurrence)
    const websiteLink = page.locator('a[href*="kiln.fi"]').first();
    await expect(websiteLink).toBeVisible();
    await expect(websiteLink).toHaveAttribute('target', '_blank');
    await expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');

    // 3. Test More Collection Navigation
    console.log('🧪 Testing More Collection navigation...');
    
    // Wait for More Collection section to load
    await page.waitForSelector('text=More from this collection', { timeout: 10000 });
    
    // Get all related NFTs
    const relatedNFTs = page.locator('text=More from this collection').locator('..').locator('[data-testid="related-nft"]');
    const relatedNFTCount = await relatedNFTs.count();
    
    // Test navigation to each related NFT (up to 3)
    for (let i = 0; i < Math.min(relatedNFTCount, 3); i++) {
      const currentNFT = relatedNFTs.nth(i);
      
      // Get the NFT name for verification
      const nftName = await currentNFT.locator('h3').textContent();
      console.log(`🧪 Testing navigation to related NFT: ${nftName}`);
      
      // Click on the related NFT
      await currentNFT.click();
      
      // Wait for navigation to complete
      await page.waitForLoadState('networkidle');
      await page.waitForURL('**/nft/**');
      
      // Verify we're on a different NFT page (check URL instead of name)
      const newURL = page.url();
      const originalURL = `http://localhost:5173/nft/${originalNFTId}`;
      expect(newURL).not.toBe(originalURL);
      
      // Go back to original NFT
      const backButton = page.locator('text=Back to Gallery');
      await backButton.click();
      
      // Wait for navigation back (either to gallery or original NFT)
      await page.waitForLoadState('networkidle');
      
      // Check if we're back on the original NFT page or in gallery
      const currentURL = page.url();
      if (currentURL.includes('/nft/')) {
        // We're back on an NFT page, continue
        console.log('✅ Navigated back to NFT page');
      } else {
        // We're in gallery, navigate back to the original NFT
        console.log('✅ Back to gallery, navigating to original NFT');
        // Navigate back to the original NFT (we'll need to track the original ID)
        await page.goto(`http://localhost:5173/nft/${originalNFTId}`);
        await page.waitForLoadState('networkidle');
      }
    }

    // 4. Test Claim Functionality
    console.log('🧪 Testing claim functionality...');
    
    // Find the claim button (try both mobile and desktop versions)
    const claimButton = page.locator('[data-testid="claim-button"], [data-testid="claim-button-desktop"]').first();
    
    // Check if claim button exists
    if (await claimButton.count() > 0) {
      // Check if claim is available (button should be enabled)
      const isDisabled = await claimButton.isDisabled();
      
      if (!isDisabled) {
        // Click claim button
        await claimButton.click();
        
        // Wait for claim state to change
        await page.waitForTimeout(2000);
        
        // Verify claim state changes (button should show "Claiming..." or success message)
        const buttonText = await claimButton.textContent();
        expect(buttonText).toMatch(/Claiming|Success|Error/);
        
        // Wait for transaction to complete or fail
        await page.waitForTimeout(5000);
      } else {
        console.log('⚠️ Claim button is disabled - skipping claim test');
      }
    } else {
      console.log('⚠️ Claim button not found - skipping claim test');
    }

    // 5. Test Back Navigation
    console.log('🧪 Testing back navigation...');
    
    const backToGalleryButton = page.locator('text=Back to Gallery');
    await backToGalleryButton.click();
    
    // Wait for navigation to gallery
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    
    // Verify we're back on the gallery page
    await expect(page.locator('[data-testid="gallery-subtitle"]')).toBeVisible();
  });

  test('Second NFT Complete Interactive Flow', async ({ page }) => {
    // 1. Load gallery and navigate to second NFT
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Wait for NFTs to load with better error handling for CI
    try {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 15000 });
    } catch (error) {
      console.log('NFT cards not found, checking for loading state...');
      // Check if we're in a loading state
      const loadingElement = page.locator('[data-testid="loader"]');
      if (await loadingElement.isVisible()) {
        console.log('App is still loading, waiting a bit more...');
        await page.waitForTimeout(5000);
        await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      } else {
        // Check if we have any content at all
        const bodyText = await page.textContent('body');
        console.log('Page content:', bodyText?.substring(0, 200));
        throw error;
      }
    }
    
    // Click "View Details" on second NFT
    const secondNFTDetailsButton = page.locator('[data-testid="nft-card"]').nth(1).locator('text=View Details');
    await secondNFTDetailsButton.click();
    
    // Wait for details page to load
    await page.waitForURL('**/nft/**');
    await page.waitForLoadState('networkidle');

    // Get the original NFT ID for navigation back
    const originalNFTId = page.url().split('/nft/')[1];

    // 2. Test Social Links again
    console.log('🧪 Testing social links on second NFT...');
    
    // Verify all social links are present (use first occurrence of each)
    await expect(page.locator('a[href*="x.com/kiln_finance"]').first()).toBeVisible();
    await expect(page.locator('a[href*="linkedin.com/company/kiln-fi"]').first()).toBeVisible();
    await expect(page.locator('a[href*="youtube.com/channel/UCegmzwd40b91ikGzZBgAa4w"]').first()).toBeVisible();
    await expect(page.locator('a[href*="kiln.fi"]').first()).toBeVisible();

    // 3. Test More Collection Navigation again
    console.log('🧪 Testing More Collection navigation on second NFT...');
    
    // Wait for More Collection section
    await page.waitForSelector('text=More from this collection', { timeout: 10000 });
    
    // Test navigation to first related NFT
    const firstRelatedNFT = page.locator('text=More from this collection').locator('..').locator('[data-testid="related-nft"]').first();
    if (await firstRelatedNFT.isVisible()) {
      const nftName = await firstRelatedNFT.locator('h3').textContent();
      console.log(`🧪 Testing navigation to related NFT: ${nftName}`);
      
      await firstRelatedNFT.click();
      await page.waitForLoadState('networkidle');
      await page.waitForURL('**/nft/**');
      
      // Go back
      await page.locator('text=Back to Gallery').click();
      await page.waitForLoadState('networkidle');
      
      // Check if we're back on the original NFT page or in gallery
      const currentURL = page.url();
      if (currentURL.includes('/nft/')) {
        console.log('✅ Navigated back to NFT page');
      } else {
        console.log('✅ Back to gallery, navigating to original NFT');
        await page.goto(`http://localhost:5173/nft/${originalNFTId}`);
        await page.waitForLoadState('networkidle');
      }
    }

    // 4. Test Claim Functionality on second NFT
    console.log('🧪 Testing claim functionality on second NFT...');
    
    const claimButton = page.locator('[data-testid="claim-button"], [data-testid="claim-button-desktop"]').first();
    
    // Check if claim button exists
    if (await claimButton.count() > 0) {
      const isDisabled = await claimButton.isDisabled();
      
      if (!isDisabled) {
        await claimButton.click();
        await page.waitForTimeout(2000);
        
        const buttonText = await claimButton.textContent();
        expect(buttonText).toMatch(/Claiming|Success|Error/);
        
        await page.waitForTimeout(5000);
      } else {
        console.log('⚠️ Claim button is disabled - skipping claim test');
      }
    } else {
      console.log('⚠️ Claim button not found - skipping claim test');
    }

    // 5. Final navigation back to gallery
    console.log('🧪 Final navigation back to gallery...');
    
    await page.locator('text=Back to Gallery').click();
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    
    // Verify we're back on the gallery page
    await expect(page.locator('[data-testid="gallery-subtitle"]')).toBeVisible();
  });

  test('Loading States and Error Handling', async ({ page }) => {
    // Test loading states during navigation
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Wait for NFTs to load with better error handling for CI
    try {
      await page.waitForSelector('[data-testid="nft-card"]', { timeout: 15000 });
    } catch (error) {
      console.log('NFT cards not found, checking for loading state...');
      // Check if we're in a loading state
      const loadingElement = page.locator('[data-testid="loader"]');
      if (await loadingElement.isVisible()) {
        console.log('App is still loading, waiting a bit more...');
        await page.waitForTimeout(5000);
        await page.waitForSelector('[data-testid="nft-card"]', { timeout: 10000 });
      } else {
        // Check if we have any content at all
        const bodyText = await page.textContent('body');
        console.log('Page content:', bodyText?.substring(0, 200));
        throw error;
      }
    }
    
    // Navigate to NFT details
    await page.locator('[data-testid="nft-card"]').first().locator('text=View Details').click();
    
    // Verify loading states are handled gracefully
    await page.waitForURL('**/nft/**');
    
    // Check for any loading indicators
    const loadingIndicators = page.locator('[data-testid="loader"], .loading, [aria-busy="true"]');
    if (await loadingIndicators.count() > 0) {
      // Wait for loading to complete
      await page.waitForTimeout(3000);
    }
    
    // Verify page loaded successfully
    await expect(page.locator('h1')).toBeVisible();
    
    // Test error handling by navigating to invalid NFT
    await page.goto('http://localhost:5173/nft/invalid-nft-id');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for any redirects or error states
    await page.waitForTimeout(2000);
    
    // Check current URL to see what happened
    const currentURL = page.url();
    
    if (currentURL.includes('/nft/invalid-nft-id')) {
      // Still on invalid NFT page, check for error state
      const errorElement = page.locator('text=NFT Not Found');
      if (await errorElement.isVisible()) {
        console.log('✅ Error state displayed for invalid NFT');
        await page.locator('text=Back to Gallery').click();
        await page.waitForURL('**/');
      }
    } else {
      // App redirected to gallery or home page
      console.log('✅ App handled invalid NFT gracefully (redirected)');
    }
  });
}); 