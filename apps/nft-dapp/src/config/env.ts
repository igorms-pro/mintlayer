/**
 * Environment Configuration
 * Centralized environment variables with validation
 */

// Environment validation
const requiredEnvVars = [
  'VITE_REOWN_PROJECT_ID',
  'VITE_API_BASE_URL',
  'VITE_NFT_CONTRACT_ADDRESS',
] as const;

// Validate required environment variables
requiredEnvVars.forEach((envVar) => {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Environment configuration
export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  
  // Web3 Configuration
  REOWN_PROJECT_ID: import.meta.env.VITE_REOWN_PROJECT_ID as string,
  
  // Contract Configuration
  NFT_CONTRACT_ADDRESS: import.meta.env.VITE_NFT_CONTRACT_ADDRESS as string,
  
  // Environment
  ENV: import.meta.env.VITE_ENV as string,
  IS_DEVELOPMENT: import.meta.env.VITE_ENV === 'development',
  IS_PRODUCTION: import.meta.env.VITE_ENV === 'production',
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
} as const;

// Initialize validation
ENV_VALIDATION.validateAll(); 