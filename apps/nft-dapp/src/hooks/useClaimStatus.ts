import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACTS, ERC1155_ABI } from '@/config/contracts';
import { CACHE_TIMES } from '@/config/constants';
import type { UseClaimStatusReturn, ClaimError } from '@/types/hooks';
import { useNFTBalance } from './useNFTBalance';

/**
 * Simplified hook to check claim status for a specific NFT
 * Focuses on practical claim validation
 */
export const useClaimStatus = (tokenId: string): UseClaimStatusReturn => {
  const { isConnected } = useAccount();
  
  // Get user's current NFT balance
  const { balance: userBalance } = useNFTBalance(tokenId);

  // Get active claim condition ID
  const {
    data: activeConditionId,
    isLoading: isConditionIdLoading,
    isError: isConditionIdError,
    error: conditionIdError,
  } = useReadContract({
    address: CONTRACTS.NFT_COLLECTION,
    abi: ERC1155_ABI,
    functionName: 'getActiveClaimConditionId',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!tokenId,
      staleTime: CACHE_TIMES.CLAIM_STATUS_STALE_TIME,
      gcTime: CACHE_TIMES.CLAIM_STATUS_GC_TIME,
    },
  });

  // Get claim condition details
  const {
    data: claimCondition,
    isLoading: isConditionLoading,
    isError: isConditionError,
    error: conditionError,
  } = useReadContract({
    address: CONTRACTS.NFT_COLLECTION,
    abi: ERC1155_ABI,
    functionName: 'getClaimConditionById',
    args: [BigInt(tokenId), activeConditionId || BigInt(0)],
    query: {
      enabled: !!tokenId && activeConditionId !== undefined,
      staleTime: CACHE_TIMES.CLAIM_STATUS_STALE_TIME,
      gcTime: CACHE_TIMES.CLAIM_STATUS_GC_TIME,
    },
  });
 

  // Format claim condition data
  const formattedCondition = claimCondition ? {
    startTimestamp: Number(claimCondition.startTimestamp),
    maxClaimableSupply: Number(claimCondition.maxClaimableSupply),
    supplyClaimed: Number(claimCondition.supplyClaimed),
    quantityLimitPerWallet: Number(claimCondition.quantityLimitPerWallet),
    currency: claimCondition.currency,
    pricePerToken: claimCondition.pricePerToken,
    merkleRoot: claimCondition.merkleRoot,
  } : null;

  // Simple claim validation - ignore supplyClaimed for now
  const canClaim = isConnected && !!formattedCondition;

  // Simple reason check - ignore supplyClaimed
  const getCanClaimReason = (): string | null => {
    if (!isConnected) return 'Wallet not connected';
    if (!formattedCondition) return 'No claim condition available';
    return null;
  };

  // Calculate remaining claims for user
  const hasReachedLimit = formattedCondition && formattedCondition.quantityLimitPerWallet > 0
    ? userBalance >= formattedCondition.quantityLimitPerWallet
    : false;

  const remainingClaims = formattedCondition && formattedCondition.quantityLimitPerWallet > 0
    ? Math.max(0, formattedCondition.quantityLimitPerWallet - userBalance)
    : 999; // Default to high number if no limit

  // Error handling
  const createClaimError = (error: Error | null, type: 'NETWORK' | 'CONTRACT'): ClaimError | null => {
    if (!error) return null;
    
    return {
      type,
      message: type === 'NETWORK' 
        ? 'Failed to fetch claim data. Please check your connection.'
        : 'Contract error occurred. Please try again.',
      details: error.message,
    };
  };

  return {
    // Claim availability
    canClaim: canClaim || false,
    canClaimReason: getCanClaimReason(),
    
    // Claim conditions
    claimCondition: formattedCondition,
    activeConditionId: activeConditionId ? Number(activeConditionId) : null,
    
    // User-specific validation
    userBalance,
    hasReachedLimit,
    remainingClaims,
    
    // Loading states
    isLoading: isConditionIdLoading || isConditionLoading,
    isConditionIdLoading,
    isConditionLoading,
    
    // Error states
    isError: isConditionIdError || isConditionError,
    isConditionIdError,
    isConditionError,
    error: createClaimError(conditionIdError || conditionError, 'CONTRACT'),
  };
}; 