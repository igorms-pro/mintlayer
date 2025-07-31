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
  // Account state
  address: string | undefined;
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  
  // Balance
  balance: string | undefined;
  isBalanceLoading: boolean;
  
  // Connection actions
  connect: () => void;
  disconnect: () => void;
  
  // Minting state
  mintState: MintState;
  mint: (nft: NFT) => Promise<void>;
  resetMintState: () => void;
  
  // Chain validation
  isCorrectChain: boolean;
  switchToBaseSepolia: () => void;
}

export interface UseTransactionStatusReturn {
  receipt: any; // TransactionReceipt type from viem
  isConfirming: boolean;
  isConfirmed: boolean;
  isError: boolean;
  error: Error | null;
  confirmations: number;
}

// Query Cache Types
export interface CacheInvalidationOptions {
  exact?: boolean;
  refetchType?: 'active' | 'inactive' | 'all';
}