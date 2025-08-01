import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useNFTBalance } from '@/hooks/useNFTBalance';
import { useClaimStatus } from '@/hooks/useClaimStatus';
import { useWeb3 } from '@/hooks/useWeb3';
import type { NFT } from '@/types/nft';
import { getImageUrl } from '@/utils/ipfs';

export interface NFTCardProps {
  nft: NFT;
  onClaim?: (nft: NFT) => void;
}

/**
 * NFT Card Component
 */

export const NFTCard: React.FC<NFTCardProps> = ({ nft, onClaim }) => {
  const navigate = useNavigate();

  // Hooks for NFT data
  const { balance, isLoading: balanceLoading, isError: balanceError } = useNFTBalance(nft.id);
  const { canClaim, canClaimReason } = useClaimStatus(nft.id);
  const { mint, mintState } = useWeb3();

  // Handle claim button click
  const handleClaim = async () => {
    if (canClaim && !mintState.isPending) {
      try {
        await mint(nft);
        onClaim?.(nft);
      } catch (error) {
        console.error('Failed to claim NFT:', error);
      }
    }
  };

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
        <div className="space-y-3">
          <Button
            onClick={handleClaim}
            variant="primary"
            size="md"
            loading={mintState.isPending}
            disabled={!canClaim || mintState.isPending}
            className="w-full"
            data-testid="claim-button"
          >
            {mintState.isPending ? 'Claiming...' : 'Claim NFT'}
          </Button>
          <Button
            onClick={() => navigate(`/nft/${nft.id}`)}
            variant="outline"
            size="md"
            className="w-full"
            data-testid="view-details-button"
          >
            View Details
          </Button>
        </div>

        {!canClaim && canClaimReason && (
          <p className="mt-2 text-xs text-gray-500 text-center" data-testid="claim-error-message">
            {canClaimReason}
          </p>
        )}


      </div>
      {mintState.isSuccess && (
        <div className="absolute inset-0 bg-green-50 border-2 border-green-500 flex items-center justify-center" data-testid="claim-success-overlay">
          <div className="text-center">
            <div className="text-green-600 text-2xl mb-2">✓</div>
            <p className="text-green-800 font-medium">Claimed Successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
};
