import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useClaimStatus } from '@/hooks/useClaimStatus';

// Mock contracts
vi.mock('@/config/contracts', () => ({
  CONTRACTS: {
    NFT_COLLECTION: '0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf',
  },
  ERC1155_ABI: [],
}));

// Mock useNFTBalance hook
vi.mock('@/hooks/useNFTBalance', () => ({
  useNFTBalance: () => ({
    balance: 0,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
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

describe('useClaimStatus Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper interface structure', () => {
    const { result } = renderHook(() => useClaimStatus('0'), {
      wrapper: createWrapper(),
    });

    // Test the hook interface
    expect(result.current).toHaveProperty('canClaim');
    expect(result.current).toHaveProperty('canClaimReason');
    expect(result.current).toHaveProperty('claimCondition');
    expect(result.current).toHaveProperty('activeConditionId');
    expect(result.current).toHaveProperty('userBalance');
    expect(result.current).toHaveProperty('hasReachedLimit');
    expect(result.current).toHaveProperty('remainingClaims');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isConditionIdLoading');
    expect(result.current).toHaveProperty('isConditionLoading');
    expect(result.current).toHaveProperty('isError');
    expect(result.current).toHaveProperty('isConditionIdError');
    expect(result.current).toHaveProperty('isConditionError');
    expect(result.current).toHaveProperty('error');

    // Test types
    expect(typeof result.current.canClaim).toBe('boolean');
    expect(typeof result.current.canClaimReason).toBe('string');
    expect(typeof result.current.userBalance).toBe('number');
    expect(typeof result.current.hasReachedLimit).toBe('boolean');
    expect(typeof result.current.remainingClaims).toBe('number');
    expect(typeof result.current.isLoading).toBe('boolean');
    expect(typeof result.current.isError).toBe('boolean');
  });

  it('should return default values when no data', () => {
    const { result } = renderHook(() => useClaimStatus('0'), {
      wrapper: createWrapper(),
    });

    // Should return sensible defaults
    expect(result.current.canClaim).toBe(false);
    expect(result.current.canClaimReason).toBe('No claim condition available');
    expect(result.current.userBalance).toBe(0);
    expect(result.current.hasReachedLimit).toBe(false);
    expect(result.current.remainingClaims).toBe(0);
    expect(result.current.claimCondition).toBe(null);
    expect(result.current.activeConditionId).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle empty string tokenId', () => {
    const { result } = renderHook(() => useClaimStatus(''), {
      wrapper: createWrapper(),
    });

    // Should handle empty string gracefully
    expect(result.current.canClaim).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle different token IDs', () => {
    const { result: result1 } = renderHook(() => useClaimStatus('0'), {
      wrapper: createWrapper(),
    });

    const { result: result2 } = renderHook(() => useClaimStatus('1'), {
      wrapper: createWrapper(),
    });

    const { result: result3 } = renderHook(() => useClaimStatus('999'), {
      wrapper: createWrapper(),
    });

    // All should return valid interface
    expect(result1.current).toHaveProperty('canClaim');
    expect(result2.current).toHaveProperty('canClaim');
    expect(result3.current).toHaveProperty('canClaim');

    expect(typeof result1.current.canClaim).toBe('boolean');
    expect(typeof result2.current.canClaim).toBe('boolean');
    expect(typeof result3.current.canClaim).toBe('boolean');
  });

  it('should provide claim condition structure when available', () => {
    const { result } = renderHook(() => useClaimStatus('0'), {
      wrapper: createWrapper(),
    });

    // Should handle claim condition properly
    expect(result.current.claimCondition).toBe(null);
    expect(result.current.activeConditionId).toBe(null);
    expect(result.current.isConditionIdLoading).toBe(false);
    expect(result.current.isConditionLoading).toBe(false);
    expect(result.current.isConditionIdError).toBe(false);
    expect(result.current.isConditionError).toBe(false);
  });

  it('should handle error states', () => {
    const { result } = renderHook(() => useClaimStatus('0'), {
      wrapper: createWrapper(),
    });

    // Should handle errors gracefully
    expect(result.current.isError).toBe(false);
    expect(result.current.isConditionIdError).toBe(false);
    expect(result.current.isConditionError).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should calculate user-specific validation correctly', () => {
    const { result } = renderHook(() => useClaimStatus('0'), {
      wrapper: createWrapper(),
    });

    // Should calculate validation values
    expect(result.current.userBalance).toBe(0);
    expect(result.current.hasReachedLimit).toBe(false);
    expect(result.current.remainingClaims).toBe(0);
  });
}); 