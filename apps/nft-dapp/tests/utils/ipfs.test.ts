import { describe, it, expect } from 'vitest';
import { getImageUrl } from '@/utils/ipfs';

describe('IPFS Utils', () => {
  describe('getImageUrl', () => {
    it('converts IPFS URL to HTTP URL', () => {
      const ipfsUrl = 'ipfs://QmTestHash123';
      const result = getImageUrl(ipfsUrl);
      
      expect(result).toBe('https://ipfs.io/ipfs/QmTestHash123');
    });

    it('returns original URL if not IPFS URL', () => {
      const httpUrl = 'https://example.com/image.jpg';
      const result = getImageUrl(httpUrl);
      
      expect(result).toBe(httpUrl);
    });

    it('handles empty string', () => {
      const emptyUrl = '';
      const result = getImageUrl(emptyUrl);
      
      expect(result).toBe(emptyUrl);
    });

    it('handles URLs that start with ipfs:// but have additional content', () => {
      const ipfsUrl = 'ipfs://QmTestHash123/some/path';
      const result = getImageUrl(ipfsUrl);
      
      expect(result).toBe('https://ipfs.io/ipfs/QmTestHash123/some/path');
    });

    it('handles URLs that contain ipfs:// but don\'t start with it', () => {
      const url = 'https://example.com/ipfs://QmTestHash123';
      const result = getImageUrl(url);
      
      expect(result).toBe(url);
    });
  });
}); 