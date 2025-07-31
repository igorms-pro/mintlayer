import { useState, useCallback, useMemo } from 'react';
import { 
  useAccount, 
  useBalance, 
  useConnect, 
  useDisconnect,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi';
import { formatEther } from 'viem';
import { baseSepolia } from 'wagmi/chains';
import type { NFT } from '../types/nft';
import type { 
  MintState, 
  UseWeb3Return, 
  UseTransactionStatusReturn 
} from '../types/hooks';
import { 
  ERC1155_ABI, 
  CONTRACTS, 
  CONTRACT_CONFIG, 
  CONTRACT_HELPERS 
} from '../config/contracts';

/**
 * Comprehensive Web3 hook for wallet management and NFT minting
 * Implements proper error handling, transaction tracking, and user feedback
 */
export const useWeb3 = (): UseWeb3Return => {
  const [mintState, setMintState] = useState<MintState>({
    isIdle: true,
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  });

  // Wagmi hooks
  const { address, isConnected, chain } = useAccount();
  const { connect: wagmiConnect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect: wagmiDisconnect, isPending: isDisconnecting } = useDisconnect();
  
  const { 
    data: balanceData, 
    isLoading: isBalanceLoading,
    refetch: refetchBalance 
  } = useBalance({
    address,
    chainId: baseSepolia.id,
  });

  const { writeContractAsync } = useWriteContract();

  // Chain validation
  const isCorrectChain = useMemo(() => {
    return chain?.id === baseSepolia.id;
  }, [chain]);

  // Connection handlers
  const connect = useCallback(() => {
    try {
      const injectedConnector = connectors.find(
        (connector) => connector.type === 'injected'
      );
      
      if (!injectedConnector) {
        throw new Error('No wallet extension found. Please install MetaMask or another Web3 wallet.');
      }
      
      wagmiConnect({ connector: injectedConnector });
    } catch (error) {
      console.error('Connection error:', error);
      setMintState(prev => ({
        ...prev,
        isError: true,
        error: error instanceof Error ? error : new Error('Failed to connect wallet'),
      }));
    }
  }, [connectors, wagmiConnect]);

  const disconnect = useCallback(() => {
    wagmiDisconnect();
    // resetMintState will be defined later
  }, [wagmiDisconnect]);

  // Chain switching ?
  const switchToBaseSepolia = useCallback(async () => {
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${baseSepolia.id.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch chain:', error);
      // If chain doesn't exist, add it
      if ((error as { code?: number })?.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${baseSepolia.id.toString(16)}`,
              chainName: baseSepolia.name,
              rpcUrls: [baseSepolia.rpcUrls.default.http[0]],
              nativeCurrency: baseSepolia.nativeCurrency,
              blockExplorerUrls: [baseSepolia.blockExplorers.default.url],
            }],
          });
        } catch (addError) {
          console.error('Failed to add chain:', addError);
        }
      }
    }
  }, []);

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
      console.log('Claiming NFT:', nft);
      
      // REAL CONTRACT INTERACTION - claim function
      const txHash = await writeContractAsync({
        address: CONTRACTS.NFT_COLLECTION,
        abi: ERC1155_ABI,
        functionName: 'claim',
        args: CONTRACT_HELPERS.prepareClaimArgs(nft.id, CONTRACT_CONFIG.DEFAULT_CLAIM_QUANTITY),
        gas: BigInt(CONTRACT_CONFIG.GAS_LIMIT),
        value: BigInt(0), // Free claim
      });

      console.log('Claim transaction hash:', txHash);

      setMintState({
        isIdle: false,
        isPending: false,
        isSuccess: true,
        isError: false,
        error: null,
        txHash,
      });

      // Refetch balance after successful claim
      await refetchBalance();

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
  }, [isConnected, address, isCorrectChain, writeContractAsync, refetchBalance]);

  const resetMintState = useCallback(() => {
    setMintState({
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    });
  }, []);

  return {
    // Account state
    address,
    isConnected,
    isConnecting,
    isDisconnecting,
    
    // Balance
    balance: balanceData ? formatEther(balanceData.value) : undefined,
    isBalanceLoading,
    
    // Connection actions
    connect,
    disconnect,
    
    // Minting
    mintState,
    mint,
    resetMintState,
    
    // Chain validation
    isCorrectChain,
    switchToBaseSepolia,
  };
};

/**
 * Hook for transaction status tracking
 * Provides real-time transaction confirmation status
 */
export const useTransactionStatus = (txHash: string | undefined): UseTransactionStatusReturn => {
  const { data, isLoading, isError, error } = useWaitForTransactionReceipt({
    hash: txHash as `0x${string}`,
    chainId: baseSepolia.id,
    query: {
      enabled: !!txHash,
      retry: 3,
      retryDelay: 1000,
    },
  });

  return {
    receipt: data,
    isConfirming: isLoading,
    isConfirmed: !!data,
    isError,
    error,
    confirmations: data?.blockNumber ? Number(data.blockNumber) : 0,
  };
};