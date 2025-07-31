/**
 * Contract Configuration
 * Contract addresses, settings, and helper functions
 */

// Import ABI from separate file
export { ERC1155_ABI } from './abi/erc1155';

// Import environment configuration
import { ENV_CONFIG } from './env';

// Contract addresses from environment
export const CONTRACTS = {
  NFT_COLLECTION: ENV_CONFIG.NFT_CONTRACT_ADDRESS as `0x${string}`,
} as const;

// Contract configuration
export const CONTRACT_CONFIG = {
  // Gas settings for Base Sepolia
  GAS_LIMIT: 300000, // Higher for claim transactions
  GAS_PRICE_BUFFER: 1.1, // 10% buffer
  
  // Transaction settings
  CONFIRMATION_BLOCKS: 1, // Base Sepolia is fast
  TIMEOUT: 300000, // 5 minutes
  
  // Claim settings
  DEFAULT_CLAIM_QUANTITY: 1,
  DEFAULT_CURRENCY: '0x0000000000000000000000000000000000000000', // ETH
  DEFAULT_PRICE: '0', // Free mint
} as const;

// Helper functions (defined separately to avoid circular reference)
const formatTokenId = (id: string): bigint => BigInt(id);
const formatQuantity = (quantity: number): bigint => BigInt(quantity);
const formatAddress = (address: string): `0x${string}` => address as `0x${string}`;

// Contract interaction helpers
export const CONTRACT_HELPERS = {
  // Format token ID for contract
  formatTokenId,
  
  // Format quantity for contract
  formatQuantity,
  
  // Format address for contract
  formatAddress,
  
  // Prepare claim arguments
  prepareClaimArgs: (tokenId: string, quantity: number = 1): readonly [bigint, bigint, `0x${string}`, bigint, readonly `0x${string}`[], bigint] => [
    formatTokenId(tokenId), // _tokenId
    formatQuantity(quantity), // _quantity
    CONTRACT_CONFIG.DEFAULT_CURRENCY as `0x${string}`, // _currency (ETH)
    BigInt(CONTRACT_CONFIG.DEFAULT_PRICE), // _pricePerToken (0 for free)
    [] as readonly `0x${string}`[], // _proof (empty for public claim)
    formatQuantity(quantity) // _proofMaxQuantityPerTransaction
  ],
  
  // Prepare verify claim arguments
  prepareVerifyClaimArgs: () => [
    {
      proof: [], // Empty proof for public claim
      maxQuantityInAllowlist: BigInt(1)
    }
  ],
} as const; 