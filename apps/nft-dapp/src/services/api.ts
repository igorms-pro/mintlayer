import type { NFT } from '../types/nft';

const API_BASE_URL = 'https://mint-api-production-7d50.up.railway.app';

export const api = {
  async getNFTs(): Promise<NFT[]> {
    const response = await fetch(`${API_BASE_URL}/nfts`);
    if (!response.ok) {
      throw new Error('Failed to fetch NFTs');
    }
    return response.json();
  },

  async getNFT(id: string): Promise<NFT> {
    const response = await fetch(`${API_BASE_URL}/nfts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch NFT');
    }
    return response.json();
  }
}; 