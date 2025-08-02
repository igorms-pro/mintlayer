import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Loader } from '@/components/ui';
import { useNFT } from '@/hooks/useNFTs';
import { NFTLeftPanel } from './NFTLeftPanel';
import { NFTDetailsCard } from './NFTDetailsCard';
import { MoreCollection } from './MoreCollection';

/**
 * NFT Details Page Component
 */
export const NFTDetails: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  
  // Hooks for NFT data
  const { nft, isLoading, isError } = useNFT(tokenId || '');

  // Handle back to gallery
  const handleBackToGallery = () => {
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-8 py-8">
        <Loader size="lg" className="py-20" />
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
          <Button onClick={handleBackToGallery} variant="primary" data-testid="back-to-gallery-error">
            Back to Gallery
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 py-4 lg:py-8">
      <button
        onClick={handleBackToGallery}
        className="flex items-center text-grey-primary hover:text-black-primary mb-4 lg:mb-8 transition-colors"
        data-testid="back-to-gallery-normal"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Gallery
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        <NFTLeftPanel nft={nft} />
        <NFTDetailsCard nft={nft} />
      </div>

      {/* More from this collection */}
      <MoreCollection currentNFTId={nft.id} />
    </div>
  );
}; 