export interface NFT {
  chainId: number;
  id: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
  };
  tokenAddress: string;
  tokenURI: string;
  type: string;
}

export interface NFTGalleryProps {
  nfts: NFT[];
  onNFTSelect: (nft: NFT) => void;
}

export interface NFTDetailsProps {
  nft: NFT;
  onBack: () => void;
  onMint: (nft: NFT) => void;
  isMinting: boolean;
}

export interface WalletStatusProps {
  address: string | undefined;
  balance: string | undefined;
  isConnected: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
} 