
// Cache Configuration (in milliseconds)
export const CACHE_TIMES = {
  // Query cache durations
  NFT_COLLECTION_STALE_TIME: 2 * 60 * 1000,  // 2 minutes
  NFT_COLLECTION_GC_TIME: 5 * 60 * 1000,     // 5 minutes
  
  NFT_DETAILS_STALE_TIME: 1 * 60 * 1000,     // 1 minute
  NFT_DETAILS_GC_TIME: 3 * 60 * 1000,        // 3 minutes
  
  // Real-time data (trading, live prices)
  REALTIME_STALE_TIME: 0,                     // Always fresh
  REALTIME_GC_TIME: 1 * 60 * 1000,           // 1 minute
  
  // Static content (user profiles, metadata)
  STATIC_STALE_TIME: 10 * 60 * 1000,         // 10 minutes
  STATIC_GC_TIME: 30 * 60 * 1000,            // 30 minutes
  
  // Claim status (supply, user balance, conditions)
  CLAIM_STATUS_STALE_TIME: 30 * 1000,        // 30 seconds
  CLAIM_STATUS_GC_TIME: 2 * 60 * 1000,       // 2 minutes
} as const;

// Network Configuration
export const NETWORK_CONFIG = {
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000,                     // 1 second
  RETRY_DELAY_MAX: 30000,                     // 30 seconds
  
  // Request timeouts
  API_TIMEOUT: 10000,                         // 10 seconds
  TRANSACTION_TIMEOUT: 300000,                // 5 minutes
} as const;


// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please try again.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  NFT_NOT_FOUND: 'NFT not found or no longer available.',
  MINT_LIMIT_EXCEEDED: 'You have exceeded the minting limit.',
} as const;

// Success Messages  
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: 'Wallet connected successfully!',
  TRANSACTION_CONFIRMED: 'Transaction confirmed successfully!',
  NFT_MINTED: 'NFT minted successfully!',
  NFT_CLAIMED: 'NFT claimed successfully!',
} as const;

// Time formatting helpers
export const TIME_FORMATS = {
  SECONDS: (s: number) => s * 1000,
  MINUTES: (m: number) => m * 60 * 1000,
  HOURS: (h: number) => h * 60 * 60 * 1000,
  DAYS: (d: number) => d * 24 * 60 * 60 * 1000,
} as const;

// Type exports for better TypeScript support
export type CacheTimeKeys = keyof typeof CACHE_TIMES;
export type NetworkConfigKeys = keyof typeof NETWORK_CONFIG;
export type ErrorMessageKeys = keyof typeof ERROR_MESSAGES;

// Social links configuration
export const KILN_SOCIAL_LINKS = [
  {
    name: 'X (Twitter)',
    url: 'https://x.com/kiln_finance',
    icon: '/x.svg',
    label: '@Kiln_finance'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/kiln-fi/',
    icon: '/linkedin.svg',
    label: '@Kiln-fi'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/channel/UCegmzwd40b91ikGzZBgAa4w',
    icon: '/youtube.svg',
    label: '@kiln_finance'
  }
] as const;

export const KILN_WEBSITE = {
  name: 'Website',
  url: 'https://www.kiln.fi/',
  icon: '/goTo.svg'
} as const;