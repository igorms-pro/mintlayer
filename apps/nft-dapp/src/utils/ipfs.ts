/**
 * IPFS Utility Functions
 */

/**
 * Formats IPFS URL to HTTP URL for display
 * @param ipfsUrl - The IPFS URL (e.g., "ipfs://Qm...")
 * @returns The HTTP URL for the IPFS content
 */
export const getImageUrl = (ipfsUrl: string): string => {
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return ipfsUrl;
}; 