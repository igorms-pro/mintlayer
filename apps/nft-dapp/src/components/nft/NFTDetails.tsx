import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useNFT } from '@/hooks/useNFTs';
import { useNFTBalance } from '@/hooks/useNFTBalance';
import { useClaimStatus } from '@/hooks/useClaimStatus';
import { useWeb3 } from '@/hooks/useWeb3';
import { NFTLeftPanel } from './NFTLeftPanel';

/**
 * NFT Details Page Component
 * Staff Engineer level: Full page layout, proper routing, responsive design
 */
export const NFTDetails: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  
  // Hooks for NFT data
  const { nft, isLoading, isError } = useNFT(tokenId || '');
  const { balance } = useNFTBalance(tokenId || '');
  const { canClaim, canClaimReason, remainingClaims } = useClaimStatus(tokenId || '');
  const { mint, mintState } = useWeb3();

  // Handle claim button click
  const handleClaim = async () => {
    if (nft && canClaim && !mintState.isPending) {
      try {
        await mint(nft);
      } catch (error) {
        console.error('Failed to claim NFT:', error);
      }
    }
  };

  // Handle back to gallery
  const handleBackToGallery = () => {
    navigate('/');
  };

  // Format IPFS image URL - now handled in NFTLeftPanel
  // const getImageUrl = (ipfsUrl: string) => {
  //   if (ipfsUrl.startsWith('ipfs://')) {
  //     return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  //   }
  //   return ipfsUrl;
  // };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-20 bg-gray-200 rounded" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded w-32" />
              </div>
              <div className="h-12 bg-gray-200 rounded w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !nft) {
    return (
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            NFT Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The NFT you're looking for doesn't exist.
          </p>
          <Button onClick={handleBackToGallery} variant="primary">
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={handleBackToGallery}
        className="flex items-center text-grey-primary hover:text-black-primary mb-8 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Gallery
      </button>

      {/* Main NFT Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left Panel - NFT Image and Creator Card */}
        <NFTLeftPanel nft={nft} />

        {/* NFT Details */}
        <div className="space-y-6">
          {/* Title and Ownership */}
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
              <button className="w-9 h-9 border border-grey-secondary flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.09)] hover:border-gray-300 transition-colors">
                <img src="/share.svg" alt="Share" className="w-5 h-5" />
              </button>
              <button className="w-9 h-9 border border-grey-secondary flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(0,0,0,0.09)] hover:border-gray-300 transition-colors">
                <img src="/like.svg" alt="Like" className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-base text-grey-primary leading-6">
            {nft.metadata.description}
          </p>

          {/* Attributes */}
          {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {nft.metadata.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="p-3 border border-grey-secondary"
                  >
                    <div className="text-xs font-light  text-grey-primary uppercase tracking-wide">
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

          {/* Divider */}
          <div className="border-t border-grey-secondary my-6"></div>

          {/* Pricing and Claim */}
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

            {/* Claim Status */}
            {!canClaim && canClaimReason && (
              <p className="text-sm text-grey-primary text-center">
                {canClaimReason}
              </p>
            )}

            {/* Remaining Claims */}
            {remainingClaims > 0 && (
              <p className="text-sm text-blue-600 text-center">
                {remainingClaims} claim{remainingClaims > 1 ? 's' : ''} remaining
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Success State */}
      {mintState.isSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-none max-w-md mx-4 text-center">
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <h3 className="text-xl font-bold text-black-primary mb-2">
              Claimed Successfully!
            </h3>
            <p className="text-grey-primary mb-6">
              Your NFT has been claimed and added to your wallet.
            </p>
            <Button onClick={handleBackToGallery} variant="primary">
              Back to Gallery
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 