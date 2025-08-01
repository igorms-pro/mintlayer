import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/services/api';

// Mock fetch globally
global.fetch = vi.fn();

// Mock environment config
vi.mock('@/config/env', () => ({
  ENV_CONFIG: {
    API_BASE_URL: 'https://test-api.example.com',
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getNFTs', () => {
    it('fetches NFTs successfully', async () => {
      const mockNFTs = [
        {
          chainId: 84532,
          id: '1',
          metadata: {
            name: 'KILN #1',
            description: 'Test NFT',
            image: 'ipfs://QmTest',
            attributes: [],
          },
          tokenAddress: '0x123',
          tokenURI: 'ipfs://QmTest',
          type: 'ERC1155',
        },
      ];

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockNFTs,
      } as Response);

      const result = await api.getNFTs();

      expect(fetch).toHaveBeenCalledWith('https://test-api.example.com/nfts');
      expect(result).toEqual(mockNFTs);
    });

    it('throws error when response is not ok', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(api.getNFTs()).rejects.toThrow('Failed to fetch NFTs');
    });

    it('handles network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getNFTs()).rejects.toThrow('Network error');
    });
  });

  describe('getNFT', () => {
    it('fetches single NFT successfully', async () => {
      const mockNFT = {
        chainId: 84532,
        id: '1',
        metadata: {
          name: 'KILN #1',
          description: 'Test NFT',
          image: 'ipfs://QmTest',
          attributes: [],
        },
        tokenAddress: '0x123',
        tokenURI: 'ipfs://QmTest',
        type: 'ERC1155',
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockNFT,
      } as Response);

      const result = await api.getNFT('1');

      expect(fetch).toHaveBeenCalledWith('https://test-api.example.com/nfts/1');
      expect(result).toEqual(mockNFT);
    });

    it('throws error when NFT not found', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(api.getNFT('999')).rejects.toThrow('Failed to fetch NFT');
    });

    it('handles network errors for single NFT', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      await expect(api.getNFT('1')).rejects.toThrow('Network error');
    });

    it('constructs correct URL with NFT ID', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      } as Response);

      await api.getNFT('123');

      expect(fetch).toHaveBeenCalledWith('https://test-api.example.com/nfts/123');
    });
  });
}); 