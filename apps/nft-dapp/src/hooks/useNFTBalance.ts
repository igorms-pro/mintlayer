import { useReadContract } from 'wagmi';
import { useAccount } from 'wagmi';
import { CONTRACTS, ERC1155_ABI } from '@/config/contracts';
import type { UseNFTBalanceReturn } from '@/types/hooks';

/**
 * Hook to check user's NFT balance for a specific token
 */
export const useNFTBalance = (tokenId: string): UseNFTBalanceReturn => {
  const { address, isConnected } = useAccount();

  const {
    data: balance,
    isLoading,
    isError,
    refetch
  } = useReadContract({
    address: CONTRACTS.NFT_COLLECTION,
    abi: ERC1155_ABI,
    functionName: 'balanceOf',
    args: [address!, BigInt(tokenId)],
    query: {
      enabled: isConnected && !!address && !!tokenId,
    },
  });

  return {
    balance: balance ? Number(balance) : 0,
    isLoading,
    isError,
    refetch,
  };
}; 