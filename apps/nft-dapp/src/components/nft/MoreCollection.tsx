import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNFTs } from '@/hooks/useNFTs';
import { Loader } from '@/components/ui';
import { getImageUrl } from '@/utils/ipfs';

export interface MoreCollectionProps {
  currentNFTId: string;
  maxItems?: number;
}

/**
 * More Collection Component
 * Displays related NFTs from the same collection
 */
export const MoreCollection: React.FC<MoreCollectionProps> = ({
  currentNFTId,
  maxItems = 4,
}) => {
  const navigate = useNavigate();
  const { nfts, isLoading } = useNFTs();

  // Filter out current NFT and limit to maxItems
  const relatedNFTs =
    nfts?.filter((nft) => nft.id !== currentNFTId).slice(0, maxItems) || [];

  // Handle NFT click
  const handleNFTClick = (nftId: string) => {
    navigate(`/nft/${nftId}`);
  };

  if (isLoading) {
    return (
      <div className="mt-12">
        <h2 className="text-lg font-semibold text-black-secondary mb-6">
          More from this collection
        </h2>
        <Loader size="md" className="py-8" />
      </div>
    );
  }

  if (!relatedNFTs || relatedNFTs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 lg:mt-18">
      <h2 className="text-xl font-semibold text-black-secondary mb-6">
        More from this collection
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {relatedNFTs.map((nft) => (
          <div
            key={nft.id}
            onClick={() => handleNFTClick(nft.id)}
            className="cursor-pointer group transition-transform duration-200 hover:scale-105"
            data-testid="related-nft"
          >
            <div className="aspect-square overflow-hidden bg-gray-100 rounded mb-2">
              <img
                src={getImageUrl(nft.metadata.image)}
                alt={nft.metadata.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-black-secondary truncate">
                {nft.metadata.name}
              </h3>
              <p className="text-sm text-grey-primary">0.0 ETH</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
