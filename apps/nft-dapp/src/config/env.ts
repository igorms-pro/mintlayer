/**
 * Environment Configuration
 * Centralized environment variables with validation
 */

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

// Environment validation
const requiredEnvVars = [
  'VITE_REOWN_PROJECT_ID',
  'VITE_API_BASE_URL',
  'VITE_NFT_CONTRACT_ADDRESS',
] as const;

// Validate required environment variables (only in production builds)
if (import.meta.env.PROD && import.meta.env.VITE_ENV === 'production') {
  requiredEnvVars.forEach((envVar) => {
    if (!import.meta.env[envVar]) {
      console.error(`Missing required environment variable: ${envVar}`);
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  });
} else {
  // Log environment variables in development/testing for debugging
  console.log('Environment variables check:', {
    VITE_REOWN_PROJECT_ID: import.meta.env.VITE_REOWN_PROJECT_ID || 'NOT SET',
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'NOT SET',
    VITE_NFT_CONTRACT_ADDRESS: import.meta.env.VITE_NFT_CONTRACT_ADDRESS || 'NOT SET',
    VITE_ENV: import.meta.env.VITE_ENV || 'NOT SET',
  });
}

// Environment configuration with fallbacks for development/testing
export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: window.ENV_MOCK?.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'https://test-api.example.com',
  
  // Web3 Configuration
  REOWN_PROJECT_ID: window.ENV_MOCK?.VITE_REOWN_PROJECT_ID || import.meta.env.VITE_REOWN_PROJECT_ID || 'test-project-id',
  
  // Contract Configuration
  NFT_CONTRACT_ADDRESS: window.ENV_MOCK?.VITE_NFT_CONTRACT_ADDRESS || import.meta.env.VITE_NFT_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890',
  
  // Environment
  ENV: window.ENV_MOCK?.VITE_ENV || import.meta.env.VITE_ENV || 'development',
  IS_DEVELOPMENT: window.ENV_MOCK?.VITE_ENV === 'development' || import.meta.env.VITE_ENV === 'development',
  IS_PRODUCTION: window.ENV_MOCK?.VITE_ENV === 'production' || import.meta.env.VITE_ENV === 'production',
} as const;

// Validation helpers
export const ENV_VALIDATION = {
  // Validate contract address format
  isValidContractAddress: (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  },
  
  // Validate all environment variables
  validateAll: (): void => {
    if (!ENV_VALIDATION.isValidContractAddress(ENV_CONFIG.NFT_CONTRACT_ADDRESS)) {
      throw new Error(`Invalid contract address: ${ENV_CONFIG.NFT_CONTRACT_ADDRESS}`);
    }
  },
  
  // Validate for specific environment
  validateForEnvironment: (env: string): void => {
    if (env === 'production') {
      ENV_VALIDATION.validateAll();
    } else if (env === 'test') {
      // Only validate contract address format for test environment
      if (!ENV_VALIDATION.isValidContractAddress(ENV_CONFIG.NFT_CONTRACT_ADDRESS)) {
        console.warn(`Test environment: Invalid contract address format: ${ENV_CONFIG.NFT_CONTRACT_ADDRESS}`);
      }
    }
  },
} as const;

// Initialize validation (only in production builds)
if (import.meta.env.PROD && import.meta.env.VITE_ENV === 'production') {
  ENV_VALIDATION.validateAll();
} 