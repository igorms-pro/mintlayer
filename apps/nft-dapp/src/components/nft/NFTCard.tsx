import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useNFTBalance } from '@/hooks/useNFTBalance';
import type { NFT } from '@/types/nft';
import { getImageUrl } from '@/utils/ipfs';

export interface NFTCardProps {
  nft: NFT;
}

/**
 * NFT Card Component
 * Displays NFT information with a "View Details" button
 */
export const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const navigate = useNavigate();

  // Hook for NFT balance display
  const { balance, isLoading: balanceLoading, isError: balanceError } = useNFTBalance(nft.id);

  return (
    <div className="group relative bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 overflow-hidden" data-testid="nft-card">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(nft.metadata.image)}
          alt={nft.metadata.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          data-testid="nft-image"
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1" data-testid="nft-name">
            {nft.metadata.name}
          </h3>
          {!balanceLoading && !balanceError && balance > 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-none" data-testid="nft-balance">
              You own {balance}
            </span>
          )}
          {balanceLoading && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-none" data-testid="nft-balance-loading">
              Loading...
            </span>
          )}
          {balanceError && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-none" data-testid="nft-balance-error">
              Error
            </span>
          )}
        </div>
        
        <p className="sm:text-base text-sm text-grey-primary mb-4 line-clamp-2 font-normal leading-6 tracking-normal" data-testid="nft-description">
          {nft.metadata.description.length > 80
            ? `${nft.metadata.description.substring(0, 80)}...`
            : nft.metadata.description}
        </p>
        
        <Button
          onClick={() => navigate(`/nft/${nft.id}`)}
          variant="primary"
          size="md"
          className="w-full"
          data-testid="view-details-button"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
