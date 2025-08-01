import React from 'react';
import { useNFTs } from '@/hooks/useNFTs';
import { NFTCard } from './NFTCard';
import type { NFT } from '@/types/nft';

export interface NFTGalleryProps {
  onNFTClaim?: (nft: NFT) => void;
}

/**
 * NFT Gallery Component
 */
export const NFTGallery: React.FC<NFTGalleryProps> = ({ onNFTClaim }) => {
  const { nfts, isLoading, isError, error } = useNFTs();

  // Handle NFT claim
  const handleNFTClaim = (nft: NFT) => {
    console.log('NFT claimed:', nft);
    onNFTClaim?.(nft);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          KILN NFT Collection
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 animate-pulse"
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-4" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="px-4 sm:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          KILN NFT Collection
        </h1>
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load NFTs
          </h2>
          <p className="text-gray-600 mb-4">
            {error?.message || 'Something went wrong while loading the NFT collection.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!nfts || nfts.length === 0) {
    return (
      <div className="px-4 sm:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          KILN NFT Collection
        </h1>
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎨</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No NFTs Available
          </h2>
          <p className="text-gray-600">
            There are currently no NFTs in this collection. Try again :)
          </p>
        </div>
      </div>
    );
  }

  // normal state
  return (
    <div className="px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          KILN NFT Collection
        </h1>
        <p className="text-gray-600">
          Discover and claim your unique KILN NFTs
        </p>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id}
            nft={nft}
            onClaim={handleNFTClaim}
          />
        ))}
      </div>

      {/* Collection Stats */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          {nfts.length} NFT{nfts.length !== 1 ? 's' : ''} in collection
        </p>
      </div>
    </div>
  );
}; 