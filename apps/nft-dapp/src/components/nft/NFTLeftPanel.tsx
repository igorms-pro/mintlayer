import React from 'react';
import type { NFT } from '@/types/nft';
import { KilnCard } from './KilnCard';

export interface NFTLeftPanelProps {
  nft: NFT;
}

/**
 * NFT Left Panel Component
 */
export const NFTLeftPanel: React.FC<NFTLeftPanelProps> = ({ nft }) => {
  // Format IPFS image URL
  const getImageUrl = (ipfsUrl: string) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }
    return ipfsUrl;
  };

  return (
    <div className="space-y-6">
      {/* NFT Image */}
      <div className="aspect-square overflow-hidden bg-gray-100 rounded-none">
        <img
          src={getImageUrl(nft.metadata.image)}
          alt={nft.metadata.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Kiln Card */}
      <KilnCard />
    </div>
  );
}; 