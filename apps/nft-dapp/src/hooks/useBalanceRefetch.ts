import { useEffect } from 'react';
import type { MintState } from '@/types/hooks';

export const useBalanceRefetch = (mintState: MintState, refetchBalance: () => void) => {
  useEffect(() => {
    // Transaction confirmed - refetch balance after blockchain state update
    if (mintState.isSuccess) {
      console.log('Transaction confirmed! Refetching balance...');
      
      // Add a small delay to ensure blockchain state is updated
      const timeoutId = setTimeout(() => {
        refetchBalance();
      }, 1000);

      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId);
    }
  }, [mintState.isSuccess, refetchBalance]);
};
