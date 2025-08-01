import { useState, useCallback, useEffect } from 'react';
import { 
  useAccount, 
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import type { NFT } from '@/types/nft';
import type {
  MintState,
  UseWeb3Return
} from '@/types/hooks';
import {
  ERC1155_ABI,
  CONTRACTS,
  CONTRACT_CONFIG,
  CONTRACT_HELPERS
} from '@/config/contracts';

/**
 * Simplified Web3 hook focused on NFT minting
 * RainbowKit handles wallet connection, balance, and chain switching
 */
export const useWeb3 = (): UseWeb3Return => {
  const [mintState, setMintState] = useState<MintState>({
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  // Wagmi hooks - only what we need for minting
  const { address, isConnected, chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  // Track transaction status for current mint state
  const { data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: mintState.txHash as `0x${string}`,
    chainId: baseSepolia.id,
    query: {
      enabled: !!mintState.txHash,
      retry: 3,
      retryDelay: 1000,
    },
  });

  const isCorrectChain = chain?.id === baseSepolia.id;

  // Update mint state when transaction is confirmed
  useEffect(() => {
    if (transactionReceipt && mintState.isPending) {
      setMintState(prev => ({
        ...prev,
        isPending: false,
        isSuccess: true,
      }));
    }
  }, [transactionReceipt, mintState.isPending]);

  // Claim logic (real contract interaction)
  const mint = useCallback(async (nft: NFT) => {
    if (!isConnected || !address) {
      throw new Error('Wallet not connected');
    }

    if (!isCorrectChain) {
      throw new Error('Please switch to Base Sepolia network');
    }

    setMintState({
      isIdle: false,
      isPending: true,
      isSuccess: false,
      isError: false,
      error: null,
    });

    try {
      // claim function
      const txHash = await writeContractAsync({
        address: CONTRACTS.NFT_COLLECTION,
        abi: ERC1155_ABI,
        functionName: 'claim',
        args: CONTRACT_HELPERS.prepareClaimArgs(nft.id, CONTRACT_CONFIG.DEFAULT_CLAIM_QUANTITY, address),
        gas: BigInt(300000),
        value: BigInt(0),
      });

      // Set pending state - transaction status will be tracked by useWaitForTransactionReceipt
      setMintState({
        isIdle: false,
        isPending: true,
        isSuccess: false,
        isError: false,
        error: null,
        txHash,
      });

    } catch (error) {
      console.error('Claim error:', error);
      
      setMintState({
        isIdle: false,
        isPending: false,
        isSuccess: false,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to claim NFT'),
      });
    }
  }, [isConnected, address, isCorrectChain, writeContractAsync]);

  const resetMintState = useCallback(() => {
    setMintState({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      txHash: undefined,
    });
  }, []);

  return {
    // Minting
    mintState,
    mint,
    resetMintState,
  };
};