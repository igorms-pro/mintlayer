import { useEffect } from 'react';
import toast from 'react-hot-toast';
import type { MintState } from '@/types/hooks';
import { TOAST_CONFIG } from '@/config/constants';

export const useToastNotifications = (mintState: MintState, nftName: string) => {
  useEffect(() => {
    // Transaction submitted
    if (mintState.isPending && mintState.txHash) {
      toast('Transaction submitted! Waiting for confirmation...', {
        icon: '⏳',
        duration: TOAST_CONFIG.DURATION,
        id: 'transaction-pending',
      });
    }
    
    // Transaction confirmed
    if (mintState.isSuccess) {
      // Dismiss the pending toast
      toast.dismiss('transaction-pending');
      
      toast.success(`Successfully claimed ${nftName}!`, {
        duration: TOAST_CONFIG.DURATION,
      });
    }
    
    // Transaction failed
    if (mintState.isError) {
      // Dismiss the pending toast if it exists
      toast.dismiss('transaction-pending');
      
      toast.error('Transaction cancelled', {
        duration: TOAST_CONFIG.DURATION,
      });
    }
  }, [mintState.isPending, mintState.isSuccess, mintState.isError, mintState.txHash, nftName]);
};
