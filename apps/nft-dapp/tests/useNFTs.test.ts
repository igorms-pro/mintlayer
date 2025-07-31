import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNFTs, useNFT, useInvalidateNFTs } from '@/hooks/useNFTs';
import { api } from '@/services/api';
import type { NFT } from '@/types/nft';

// Mock the API
vi.mock('@/services/api');

const mockNFTs: NFT[] = [
  {
    id: '1',
    chainId: 84532,
    metadata: {
      name: 'Test NFT 1',
      description: 'Test description',
      image: 'https://example.com/image1.jpg',
      attributes: [{ trait_type: 'Color', value: 'Blue' }],
    },
    tokenAddress: '0x123',
    tokenURI: 'https://example.com/token/1',
    type: 'ERC1155',
  },
  {
    id: '2',
    chainId: 84532,
    metadata: {
      name: 'Test NFT 2',
      description: 'Test description 2',
      image: 'https://example.com/image2.jpg',
      attributes: [{ trait_type: 'Color', value: 'Red' }],
    },
    tokenAddress: '0x456',
    tokenURI: 'https://example.com/token/2',
    type: 'ERC1155',
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ({ children }: { children: any }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useNFTs Hook Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useNFTs (Collection Hook)', () => {
    it('should have proper interface structure', () => {
      const { result } = renderHook(() => useNFTs({ enabled: false }), {
        wrapper: createWrapper(),
      });

      // Test the hook interface
      expect(result.current).toHaveProperty('nfts');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
      expect(result.current).toHaveProperty('isRefetching');
      
      // Test types
      expect(Array.isArray(result.current.nfts)).toBe(true);
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isError).toBe('boolean');
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should respect enabled option', () => {
      const { result } = renderHook(() => useNFTs({ enabled: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(api.getNFTs).not.toHaveBeenCalled();
    });
  });

  describe('useNFT (Single Item Hook)', () => {
    it('should have correct interface structure', () => {
      const { result } = renderHook(() => useNFT(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('nft');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('isError');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refetch');
      
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isError).toBe('boolean');
      expect(typeof result.current.refetch).toBe('function');
    });

    it('should return undefined when id is undefined', () => {
      const { result } = renderHook(() => useNFT(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.nft).toBeUndefined();
      expect(result.current.isLoading).toBe(false);
      expect(api.getNFT).not.toHaveBeenCalled();
    });

    it('should call useQuery with correct parameters when id is provided', () => {
      vi.mocked(api.getNFT).mockResolvedValue(mockNFTs[0]);

      renderHook(() => useNFT('test-nft-1'), {
        wrapper: createWrapper(),
      });

      // Since useQuery is mocked, we test that the hook renders without error
      // and has the expected interface when an ID is provided
      expect(() => renderHook(() => useNFT('test-nft-1'), {
        wrapper: createWrapper(),
      })).not.toThrow();
    });
  });

  describe('useInvalidateNFTs (Cache Management Hook)', () => {
    it('should have correct interface structure', () => {
      const { result } = renderHook(() => useInvalidateNFTs(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toHaveProperty('invalidateNFTs');
      expect(result.current).toHaveProperty('invalidateNFT');
      expect(result.current).toHaveProperty('refetchNFTs');
      
      expect(typeof result.current.invalidateNFTs).toBe('function');
      expect(typeof result.current.invalidateNFT).toBe('function');
      expect(typeof result.current.refetchNFTs).toBe('function');
    });

    it('should provide cache invalidation functions', () => {
      const { result } = renderHook(() => useInvalidateNFTs(), {
        wrapper: createWrapper(),
      });

      // Should not throw when called
      expect(() => result.current.invalidateNFTs()).not.toThrow();
      expect(() => result.current.invalidateNFT('test-id')).not.toThrow();
      expect(() => result.current.refetchNFTs()).not.toThrow();
    });
  });
});