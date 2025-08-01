import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useClaimStatus } from '../src/hooks/useClaimStatus';

// Mock the hooks with simple implementations
vi.mock('../src/hooks/useNFTBalance', () => ({
  useNFTBalance: vi.fn(() => ({
    balance: 0,
    isLoading: false,
    isError: false,
  })),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(() => ({
    isConnected: true,
    address: '0x1234567890123456789012345678901234567890',
  })),
  useReadContract: vi.fn(() => ({
    data: BigInt(0),
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

describe('useClaimStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper interface structure', () => {
    const { result } = renderHook(() => useClaimStatus('1'));

    // Test the hook interface
    expect(result.current).toHaveProperty('canClaim');
    expect(result.current).toHaveProperty('canClaimReason');
    expect(result.current).toHaveProperty('claimCondition');
    expect(result.current).toHaveProperty('activeConditionId');
    expect(result.current).toHaveProperty('userBalance');
    expect(result.current).toHaveProperty('hasReachedLimit');
    expect(result.current).toHaveProperty('remainingClaims');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isError');
  });

  it('should return default values when no data', () => {
    const { result } = renderHook(() => useClaimStatus('1'));

    // Should return sensible defaults
    expect(result.current.canClaim).toBe(false);
    expect(result.current.canClaimReason).toBe('No claim condition available');
    expect(result.current.userBalance).toBe(0);
    expect(result.current.hasReachedLimit).toBe(false);
    expect(result.current.remainingClaims).toBe(999);
    expect(result.current.claimCondition).toBe(null);
    expect(result.current.activeConditionId).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle different token IDs', () => {
    const { result: result1 } = renderHook(() => useClaimStatus('0'));
    const { result: result2 } = renderHook(() => useClaimStatus('1'));
    const { result: result3 } = renderHook(() => useClaimStatus('999'));

    // All should return valid interface
    expect(result1.current).toHaveProperty('canClaim');
    expect(result2.current).toHaveProperty('canClaim');
    expect(result3.current).toHaveProperty('canClaim');

    expect(typeof result1.current.canClaim).toBe('boolean');
    expect(typeof result2.current.canClaim).toBe('boolean');
    expect(typeof result3.current.canClaim).toBe('boolean');
  });

  it('should handle empty string tokenId', () => {
    const { result } = renderHook(() => useClaimStatus(''));

    // Should handle empty string gracefully
    expect(result.current.canClaim).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });
}); 