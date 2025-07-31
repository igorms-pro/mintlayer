import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { NFT } from '@/types/nft';
import type {
  UseNFTsOptions,
  UseNFTsReturn,
  UseNFTReturn,
  UseInvalidateNFTsReturn,
} from '@/types/hooks';
import { CACHE_TIMES, NETWORK_CONFIG } from '@/config/constants';

 
/**
 * Hook for fetching and managing NFT collection data
 */
export const useNFTs = (options: UseNFTsOptions = {}): UseNFTsReturn => {
  const { enabled = true, refetchInterval } = options;

  const query = useQuery({
    queryKey: ['nfts'],
    queryFn: api.getNFTs,
    enabled,
    refetchInterval,
    // NFT Collection: Metadata rarely changes, but availability does
    staleTime: CACHE_TIMES.NFT_COLLECTION_STALE_TIME,
    gcTime: CACHE_TIMES.NFT_COLLECTION_GC_TIME,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < NETWORK_CONFIG.MAX_RETRIES;
    },
    retryDelay: (attemptIndex) =>
      Math.min(
        NETWORK_CONFIG.RETRY_DELAY_BASE * 2 ** attemptIndex,
        NETWORK_CONFIG.RETRY_DELAY_MAX
      ),
  });

  return {
    nfts: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isRefetching: query.isRefetching,
  };
};

/**
 * Hook for fetching individual NFT data
 */
export const useNFT = (id: string | undefined): UseNFTReturn => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['nft', id] as const,
    queryFn: () => api.getNFT(id!),
    enabled: !!id,
    staleTime: CACHE_TIMES.NFT_DETAILS_STALE_TIME,
    gcTime: CACHE_TIMES.NFT_DETAILS_GC_TIME,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    initialData: () => {
      const nfts = queryClient.getQueryData<NFT[]>(['nfts']);
      return nfts?.find((nft) => nft.id === id);
    },
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    nft: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};

/**
 * Hook for invalidating NFT cache
 */
export const useInvalidateNFTs = (): UseInvalidateNFTsReturn => {
  const queryClient = useQueryClient();

  return {
    invalidateNFTs: () => queryClient.invalidateQueries({ queryKey: ['nfts'] }),
    invalidateNFT: (id: string) =>
      queryClient.invalidateQueries({ queryKey: ['nft', id] }),
    refetchNFTs: () => queryClient.refetchQueries({ queryKey: ['nfts'] }),
  };
};
