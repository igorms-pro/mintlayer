import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { NFT } from '@/types/nft';
import type { AppError } from '@/types/errors';
import { isAPIError } from '@/types/errors';
import type {
  UseNFTsOptions,
  UseNFTsReturn,
  UseNFTReturn,
} from '@/types/hooks';
import { CACHE_TIMES, NETWORK_CONFIG } from '@/config/constants';

/**
 * Hook for fetching and managing NFT collection data
 */
export const useNFTs = (options: UseNFTsOptions = {}): UseNFTsReturn => {
  const { enabled = true, refetchInterval } = options;

  const query = useQuery<NFT[], AppError>({
    queryKey: ['nfts'],
    queryFn: (): Promise<NFT[]> => api.getNFTs(),
    enabled,
    refetchInterval,
    // NFT Collection: Metadata rarely changes, but availability does
    staleTime: CACHE_TIMES.NFT_COLLECTION_STALE_TIME,
    gcTime: CACHE_TIMES.NFT_COLLECTION_GC_TIME,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error: unknown) => {
      // Don't retry on 4xx errors (client errors)
      if (isAPIError(error) && error.status >= 400 && error.status < 500) {
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
  };
};

/**
 * Hook for fetching individual NFT data
 */
export const useNFT = (id: string | undefined): UseNFTReturn => {
  const queryClient = useQueryClient();

  const query = useQuery<NFT, AppError>({
    queryKey: ['nft', id] as const,
    queryFn: (): Promise<NFT> => {
      if (!id) {
        throw new Error('NFT ID is required');
      }
      return api.getNFT(id);
    },
    enabled: !!id,
    staleTime: CACHE_TIMES.NFT_DETAILS_STALE_TIME,
    gcTime: CACHE_TIMES.NFT_DETAILS_GC_TIME,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    initialData: () => {
      const nfts = queryClient.getQueryData<NFT[]>(['nfts']);
      return nfts?.find((nft) => nft.id === id);
    },
    retry: (failureCount, error: unknown) => {
      if (isAPIError(error) && error.status >= 400 && error.status < 500) {
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
  };
};
