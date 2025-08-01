import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACTS, ERC1155_ABI } from '@/config/contracts';
import { CACHE_TIMES } from '@/config/constants';
import type { UseClaimStatusReturn } from '@/types/hooks';
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

  // Simple claim validation
  const canClaim = isConnected && !!formattedCondition;

  // Simple reason check
  const getCanClaimReason = (): string | null => {
    if (!isConnected) return 'Wallet not connected';
    if (!formattedCondition) return 'No claim condition available';
    return null;
  };

  // Calculate remaining claims for user
  const remainingClaims = formattedCondition && formattedCondition.quantityLimitPerWallet > 0
    ? Math.max(0, formattedCondition.quantityLimitPerWallet - userBalance)
    : 999; // Default to high number if no limit

  return {
    // Claim availability
    canClaim: canClaim || false,
    canClaimReason: getCanClaimReason(),
    remainingClaims,
  };
}; 