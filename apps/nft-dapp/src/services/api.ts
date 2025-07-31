import type { NFT } from '../types/nft';
import { ENV_CONFIG } from '../config/env';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

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