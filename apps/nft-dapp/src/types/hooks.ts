import type { NFT } from './nft';

// NFT Hooks Types
export interface UseNFTsOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export interface UseNFTsReturn {
  nfts: NFT[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  isRefetching: boolean;
}

export interface UseNFTReturn {
  nft: NFT | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseInvalidateNFTsReturn {
  invalidateNFTs: () => void;
  invalidateNFT: (id: string) => void;
  refetchNFTs: () => void;
}

// Web3 Hooks Types
export interface MintState {
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  txHash?: string;
}

export interface UseWeb3Return {
  // Account state (read-only for RainbowKit)
  address: string | undefined;
  isConnected: boolean;
  
  // Minting state
  mintState: MintState;
  mint: (nft: NFT) => Promise<void>;
  resetMintState: () => void;
  
  // Chain validation
  isCorrectChain: boolean;
}

export interface UseTransactionStatusReturn {
  receipt: import('viem').TransactionReceipt | undefined;
  isConfirming: boolean;
  isConfirmed: boolean;
  isError: boolean;
  error: Error | null;
  confirmations: number;
}

// useNFTBalance hook types
export interface UseNFTBalanceReturn {
  balance: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// useClaimStatus hook types
export interface ClaimCondition {
  startTimestamp: number;
  maxClaimableSupply: number;
  supplyClaimed: number;
  quantityLimitPerWallet: number;
  currency: string;
  pricePerToken: bigint;
  allowlistMerkleRoot: string;
}

export interface ClaimError {
  type: 'NETWORK' | 'CONTRACT' | 'VALIDATION' | 'USER_LIMIT';
  message: string;
  code?: number;
  details?: string;
}

export interface UseClaimStatusReturn {
  // Claim availability
  canClaim: boolean;
  canClaimReason: string | null;
  
  // Claim conditions
  claimCondition: ClaimCondition | null;
  activeConditionId: number | null;
  
  // User-specific validation
  userBalance: number;
  hasReachedLimit: boolean;
  remainingClaims: number;
  
  // Loading states
  isLoading: boolean;
  isConditionIdLoading: boolean;
  isConditionLoading: boolean;
  
  // Error states
  isError: boolean;
  isConditionIdError: boolean;
  isConditionError: boolean;
  error: ClaimError | null;
}

// Query Cache Types
export interface CacheInvalidationOptions {
  exact?: boolean;
  refetchType?: 'active' | 'inactive' | 'all';
}