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
  GAS_LIMIT: 100000,
  GAS_PRICE_BUFFER: 1.1, // 10% buffer
  
  // Transaction settings
  CONFIRMATION_BLOCKS: 1, // Base Sepolia is fast
  TIMEOUT: 300000, // 5 minutes
  
  // Claim settings
  DEFAULT_CLAIM_QUANTITY: 1,
  DEFAULT_CURRENCY: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Standard ETH address
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
  
  // Prepare claim arguments for the correct function signature
  prepareClaimArgs: (tokenId: string, quantity: number = 1, receiver?: string): readonly [`0x${string}`, bigint, bigint, `0x${string}`, bigint, { proof: readonly `0x${string}`[]; quantityLimitPerWallet: bigint; pricePerToken: bigint; currency: `0x${string}` }, `0x${string}`] => [
    (receiver || '0x0000000000000000000000000000000000000000') as `0x${string}`, // _receiver (use zero address if not specified)
    formatTokenId(tokenId), // _tokenId
    formatQuantity(quantity), // _quantity
    CONTRACT_CONFIG.DEFAULT_CURRENCY as `0x${string}`, // _currency (ETH)
    BigInt(CONTRACT_CONFIG.DEFAULT_PRICE), // _pricePerToken (0 for free)
    { // _allowlistProof
      proof: [] as readonly `0x${string}`[], // Empty proof for public claim
      quantityLimitPerWallet: BigInt(0), // Use 0 for unlimited (like successful tx)
      pricePerToken: BigInt(CONTRACT_CONFIG.DEFAULT_PRICE), // Price per token
      currency: CONTRACT_CONFIG.DEFAULT_CURRENCY as `0x${string}` // Currency
    },
    '0x' as `0x${string}` // _data (empty bytes)
  ],
  
  // Prepare verify claim arguments (correct signature)
  prepareVerifyClaimArgs: (conditionId: number, claimer: string, tokenId: string, quantity: number, currency: string, pricePerToken: string) => [
    BigInt(conditionId), // _conditionId
    claimer as `0x${string}`, // _claimer
    BigInt(tokenId), // _tokenId
    BigInt(quantity), // _quantity
    currency as `0x${string}`, // _currency
    BigInt(pricePerToken), // _pricePerToken
    { // _allowlistProof
      proof: [] as readonly `0x${string}`[], // Empty proof for public claim
      quantityLimitPerWallet: BigInt(0), // Use 0 for unlimited
      pricePerToken: BigInt(pricePerToken), // Price per token
      currency: currency as `0x${string}` // Currency
    }
  ],
} as const; 