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
}

export interface UseNFTReturn {
  nft: NFT | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
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
  // Minting state
  mintState: MintState;
  mint: (nft: NFT) => Promise<void>;
  resetMintState: () => void;
}

// useNFTBalance hook types
export interface UseNFTBalanceReturn {
  balance: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

// useClaimStatus hook types
export interface UseClaimStatusReturn {
  canClaim: boolean;
  canClaimReason: string | null;
  remainingClaims: number;
}