import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACTS, ERC1155_ABI } from '../config/contracts';
import { CACHE_TIMES } from '../config/constants';
import type { UseClaimStatusReturn, ClaimError } from '../types/hooks';
import { useNFTBalance } from './useNFTBalance';

/**
 * Enhanced hook to check claim status and conditions for a specific NFT
 * Provides comprehensive claim validation including user-specific checks
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
      staleTime: CACHE_TIMES.CLAIM_STATUS_STALE_TIME, // 30 seconds
      gcTime: CACHE_TIMES.CLAIM_STATUS_GC_TIME,       // 2 minutes
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
      staleTime: CACHE_TIMES.CLAIM_STATUS_STALE_TIME, // 30 seconds
      gcTime: CACHE_TIMES.CLAIM_STATUS_GC_TIME,       // 2 minutes
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
    allowlistMerkleRoot: claimCondition.allowlistMerkleRoot,
  } : null;

  // Enhanced user-specific validation
  const hasReachedLimit = formattedCondition 
    ? userBalance >= formattedCondition.quantityLimitPerWallet
    : false;

  const remainingClaims = formattedCondition
    ? Math.max(0, formattedCondition.quantityLimitPerWallet - userBalance)
    : 0;

  // claim validation
  const canClaim = formattedCondition && isConnected && (
    // aupply available
    formattedCondition.supplyClaimed < formattedCondition.maxClaimableSupply &&
    // claim period active & user hasn't reached limit
    Date.now() / 1000 >= formattedCondition.startTimestamp &&
    !hasReachedLimit
  );

  // why user can't claim
  const getCanClaimReason = (): string | null => {
    if (!isConnected) return 'Wallet not connected';
    if (!formattedCondition) return 'No claim condition available';
    if (formattedCondition.supplyClaimed >= formattedCondition.maxClaimableSupply) {
      return 'All NFTs have been claimed';
    }
    if (Date.now() / 1000 < formattedCondition.startTimestamp) {
      return 'Claim period not started yet';
    }
    if (hasReachedLimit) {
      return `You've reached the limit of ${formattedCondition.quantityLimitPerWallet} NFTs`;
    }
    return null;
  };

  // Enhanced error handling
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