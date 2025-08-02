import React from 'react';
import type { NFT } from '@/types/nft';
import { KilnCard } from './index';
import { getImageUrl } from '@/utils/ipfs';

export interface NFTLeftPanelProps {
  nft: NFT;
}

/**
 * NFT Left Panel Component - Only shows image on mobile, image + Kiln card on desktop
 */
export const NFTLeftPanel: React.FC<NFTLeftPanelProps> = ({ nft }) => {

  return (
    <div className="space-y-1 sm:space-y-6">
      <div className="w-full">
        <div className="aspect-square overflow-hidden bg-gray-100 rounded-none">
          <img
            src={getImageUrl(nft.metadata.image)}
            alt={nft.metadata.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <div className="hidden lg:block">
        <KilnCard />
      </div>
    </div>
  );
}; 