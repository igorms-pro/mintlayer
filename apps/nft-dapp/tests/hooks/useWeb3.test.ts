import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWeb3 } from '@/hooks/useWeb3';

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
    chain: { id: 84532, name: 'Base Sepolia' },
  }),
  useBalance: () => ({
    data: { value: BigInt(1000000000000000000) }, // 1 ETH
    isLoading: false,
    refetch: vi.fn(),
  }),
  useConnect: () => ({
    connect: vi.fn(),
    connectors: [{ type: 'injected', ready: true }],
    isPending: false,
  }),
  useDisconnect: () => ({
    disconnect: vi.fn(),
    isPending: false,
  }),
  useWriteContract: () => ({
    writeContractAsync: vi.fn(),
  }),
  useWaitForTransactionReceipt: () => ({
    data: null,
    isLoading: false,
    isError: false,
    error: null,
  }),
}));

// Mock viem
vi.mock('viem', () => ({
  formatEther: vi.fn((value: bigint) => value.toString()),
}));

// Mock contracts
vi.mock('@/config/contracts', () => ({
  CONTRACTS: {
    NFT_COLLECTION: '0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf',
  },
  ERC1155_ABI: [],
  CONTRACT_CONFIG: {
    GAS_LIMIT: 300000,
  },
  CONTRACT_HELPERS: {
    prepareClaimArgs: vi.fn(() => [BigInt(0), BigInt(1), '0x0', BigInt(0), [], BigInt(1)]),
  },
}));

// Helper to create a wrapper for TanStack Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => {
    return React.createElement(QueryClientProvider, { client: queryClient }, children);
  };
};

describe('useWeb3 Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper interface structure', () => {
    const { result } = renderHook(() => useWeb3(), {
      wrapper: createWrapper(),
    });

    // Test the hook interface
    expect(result.current).toHaveProperty('mintState');
    expect(result.current).toHaveProperty('mint');
    expect(result.current).toHaveProperty('resetMintState');

    // Test types
    expect(typeof result.current.mint).toBe('function');
    expect(typeof result.current.resetMintState).toBe('function');
  });

  it('should have proper mintState structure', () => {
    const { result } = renderHook(() => useWeb3(), {
      wrapper: createWrapper(),
    });

    expect(result.current.mintState).toHaveProperty('isIdle');
    expect(result.current.mintState).toHaveProperty('isPending');
    expect(result.current.mintState).toHaveProperty('isSuccess');
    expect(result.current.mintState).toHaveProperty('isError');
    expect(result.current.mintState).toHaveProperty('error');

    expect(typeof result.current.mintState.isIdle).toBe('boolean');
    expect(typeof result.current.mintState.isPending).toBe('boolean');
    expect(typeof result.current.mintState.isSuccess).toBe('boolean');
    expect(typeof result.current.mintState.isError).toBe('boolean');
    expect(result.current.mintState.error).toBe(null);
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useWeb3(), {
      wrapper: createWrapper(),
    });

    // Check default values
    expect(result.current.mintState.isIdle).toBe(true);
    expect(result.current.mintState.isPending).toBe(false);
    expect(result.current.mintState.isSuccess).toBe(false);
    expect(result.current.mintState.isError).toBe(false);
  });

  it('should provide action functions', () => {
    const { result } = renderHook(() => useWeb3(), {
      wrapper: createWrapper(),
    });

    // Should not throw when called
    expect(() => result.current.resetMintState()).not.toThrow();
  });

  it('should handle mint function interface', async () => {
    const { result } = renderHook(() => useWeb3(), {
      wrapper: createWrapper(),
    });

    // Mock NFT for testing
    const mockNFT = {
      chainId: 84532,
      id: '0',
      metadata: {
        name: 'Test NFT',
        description: 'Test Description',
        image: 'test.jpg',
        attributes: [],
      },
      tokenAddress: '0x123',
      tokenURI: 'test-uri',
      type: 'ERC1155',
    };

    // Should not throw when called (even though it's mocked)
    expect(() => result.current.mint(mockNFT)).not.toThrow();
  });
}); 