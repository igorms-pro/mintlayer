import type { NFT } from '@/types/nft';
import { APIError } from '@/types/errors';
import { ENV_CONFIG } from '@/config/env';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

export const api = {
  async getNFTs(): Promise<NFT[]> {
    const response = await fetch(`${API_BASE_URL}/nfts`);
    if (!response.ok) {
      throw new APIError(
        'Failed to fetch NFTs',
        response.status,
        response.statusText
      );
    }
    const data = await response.json() as NFT[];
    return data;
  },

  async getNFT(id: string): Promise<NFT> {
    const response = await fetch(`${API_BASE_URL}/nfts/${id}`);
    if (!response.ok) {
      throw new APIError(
        `Failed to fetch NFT ${id}`,
        response.status,
        response.statusText
      );
    }
    const data = await response.json() as NFT;
    return data;
  }
}; 