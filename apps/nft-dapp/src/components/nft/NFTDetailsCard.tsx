import React, { useEffect } from 'react';
import { Button, Divider } from '@/components/ui';
import { useNFTBalance } from '@/hooks/useNFTBalance';
import { useClaimStatus } from '@/hooks/useClaimStatus';
import { useWeb3 } from '@/hooks/useWeb3';
import toast from 'react-hot-toast';
import { TOAST_CONFIG } from '@/config/constants';
import { KilnCard } from './index';
import type { NFT } from '@/types/nft';

export interface NFTDetailsCardProps {
  nft: NFT;
}

/**
 * NFT Details Card Component
 * Contains the right side content: title, description, attributes, pricing, and claim button
 */
export const NFTDetailsCard: React.FC<NFTDetailsCardProps> = ({ nft }) => {
  // Hooks for NFT data
  const { balance, refetch: refetchBalance } = useNFTBalance(nft.id);
  const { canClaim, canClaimReason, remainingClaims } = useClaimStatus(nft.id);
  const { mint, mintState, resetMintState } = useWeb3();

  // Handle toast notifications and balance updates based on mint state
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
      console.log('Transaction confirmed! Refetching balance...');
      
      // Dismiss the pending toast
      toast.dismiss('transaction-pending');
      
      // Add a small delay to ensure blockchain state is updated
      setTimeout(() => {
        refetchBalance();
      }, 1000);
      
      toast.success(`Successfully claimed ${nft.metadata.name}!`, {
        duration: TOAST_CONFIG.DURATION,
      });
    }
    
    // Transaction failed
    if (mintState.isError) {
      // Dismiss the pending toast if it exists
      toast.dismiss('transaction-pending');
      
      toast.error('Transaction cancelled or failed. Please try again.', {
        duration: TOAST_CONFIG.DURATION,
      });
    }
  }, [mintState.isPending, mintState.isSuccess, mintState.isError, mintState.txHash, refetchBalance, nft.metadata.name]);



  // Handle claim button click
  const handleClaim = async () => {
    if (canClaim && !mintState.isPending) {
      try {
        await mint(nft);
      } catch (error) {
        console.error('Failed to claim NFT:', error);
        toast.error('Transaction cancelled or failed. Please try again.', {
          duration: TOAST_CONFIG.DURATION,
        });
      }
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Mobile: Claim section first for better UX */}
      <div className="lg:hidden space-y-3">
        <div className="flex flex-col space-y-2">
          <span className="px-2 py-0.5 bg-black-primary text-white text-xs font-medium w-fit">
            Free Mint
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-black-secondary leading-8">
              Ξ 0 ETH
            </span>
            <Button
              onClick={handleClaim}
              variant="primary"
              size="lg"
              loading={mintState.isPending}
              disabled={!canClaim || mintState.isPending}
              className="h-10"
            >
              {mintState.isPending ? 'Claiming...' : 'Claim Now'}
            </Button>
          </div>
        </div>
        {!canClaim && canClaimReason && (
          <p className="text-sm text-grey-primary text-center">
            {canClaimReason}
          </p>
        )}
        {canClaim && (
          <p className="text-sm text-green-600 text-center">
            {remainingClaims === 999 ? 'Unlimited claims available' : `${remainingClaims} claim${remainingClaims > 1 ? 's' : ''} remaining`}
          </p>
        )}
        {mintState.isError && (
          <p className="text-sm text-red-600 text-center">
            Error: {mintState.error?.message || 'Transaction failed'}
          </p>
        )}
        {mintState.isPending && !mintState.isSuccess && (
          <div className="text-sm text-blue-600 text-center">
            <p>Transaction submitted! Check MetaMask for confirmation...</p>
            <button 
              onClick={resetMintState}
              className="text-xs text-gray-500 underline mt-1"
            >
              Reset if failed
            </button>
          </div>
        )}
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-black-secondary leading-8">
            {nft.metadata.name}
          </h1>
          <p className="text-sm text-grey-primary">
            You own {balance}
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="w-9 h-9 bg-white border border-grey-secondary flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.09)] hover:border-gray-300 transition-colors">
            <img src="/share.svg" alt="Share" className="w-5 h-5" />
          </button>
          <button className="w-9 h-9 bg-white border border-grey-secondary flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.09)] hover:border-gray-300 transition-colors">
            <img src="/like.svg" alt="Like" className="w-5 h-5" />
          </button>
        </div>
      </div>
      <p className="text-base text-grey-primary leading-6">
        {nft.metadata.description}
      </p>
      {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {nft.metadata.attributes.map((attr, index) => (
              <div
                key={index}
                className="p-3 border border-grey-secondary"
              >
                <div className="text-xs font-light text-grey-primary uppercase tracking-wide">
                  {attr.trait_type}
                </div>
                <div className="text-sm text-black-secondary mt-1">
                  {attr.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Mobile: Divider after metadata */}
      <div className="lg:hidden mt-6">
        <Divider />
      </div>
      
      {/* Desktop: Claim section at bottom */}
      <div className="hidden lg:block">
        <Divider />
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <span className="px-2 py-0.5 bg-black-primary text-white text-xs font-medium w-fit">
              Free Mint
            </span>
            <span className="text-2xl font-semibold text-black-secondary leading-8">
              Ξ 0 ETH
            </span>
          </div>
          <Button
            onClick={handleClaim}
            variant="primary"
            size="xl"
            loading={mintState.isPending}
            disabled={!canClaim || mintState.isPending}
            className="w-full"
          >
            {mintState.isPending ? 'Claiming...' : 'Claim Now'}
          </Button>
          {!canClaim && canClaimReason && (
            <p className="text-sm text-grey-primary text-center">
              {canClaimReason}
            </p>
          )}
          {canClaim && (
            <p className="text-sm text-green-600 text-center">
              {remainingClaims === 999 ? 'Unlimited claims available' : `${remainingClaims} claim${remainingClaims > 1 ? 's' : ''} remaining`}
            </p>
          )}
          {mintState.isError && (
            <p className="text-sm text-red-600 text-center">
              Error: {mintState.error?.message || 'Transaction failed'}
            </p>
          )}
          {mintState.isPending && !mintState.isSuccess && (
            <div className="text-sm text-blue-600 text-center">
              <p>Transaction submitted! Check MetaMask for confirmation...</p>
              <button 
                onClick={resetMintState}
                className="text-xs text-gray-500 underline mt-1"
              >
                Reset if failed
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Success state - now handled by toast notifications */}
      
      {/* Kiln Card - Only visible on mobile */}
      <div className="lg:hidden mt-8">
        <KilnCard />
      </div>
      
      {/* Mobile: Divider after KilnCard */}
      <div className="lg:hidden mt-6">
        <Divider />
      </div>
    </div>
  );
}; 