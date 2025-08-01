import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NFTGallery } from '@/components/nft/NFTGallery';
import * as useNFTsModule from '@/hooks/useNFTs';

// Mock the hooks
vi.mock('@/hooks/useNFTs', () => ({
  useNFTs: vi.fn(),
}));

// Helper to create a wrapper with providers
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Mock NFT data
const mockNFTs = [
  {
    chainId: 84532,
    id: '1',
    metadata: {
      name: 'KILN #1',
      description: 'A unique KILN NFT with amazing features.',
      image: 'ipfs://QmTestImage1',
      attributes: [
        { trait_type: 'HEADWEAR', value: 'Red & White Kiln Cap' },
      ],
    },
    tokenAddress: '0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf',
    tokenURI: 'ipfs://QmTestURI1',
    type: 'ERC1155',
  },
  {
    chainId: 84532,
    id: '2',
    metadata: {
      name: 'KILN #2',
      description: 'Another amazing KILN NFT.',
      image: 'ipfs://QmTestImage2',
      attributes: [
        { trait_type: 'EYEWEAR', value: 'Blue Square Shades' },
      ],
    },
    tokenAddress: '0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf',
    tokenURI: 'ipfs://QmTestURI2',
    type: 'ERC1155',
  },
];

describe('NFTGallery Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders gallery with title and subtitle', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('gallery-title')).toHaveTextContent('KILN NFT Collection (2)');
    expect(screen.getByTestId('gallery-subtitle')).toHaveTextContent('Discover and claim your unique KILN NFTs');
  });

  it('renders NFT grid with cards', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-grid')).toBeInTheDocument();
    expect(screen.getAllByTestId('nft-card')).toHaveLength(2);
    expect(screen.getByText('KILN #1')).toBeInTheDocument();
    expect(screen.getByText('KILN #2')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [],
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<NFTGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-gallery')).toBeInTheDocument();
    expect(screen.getByTestId('gallery-title')).toHaveTextContent('KILN NFT Collection');
    // Should show loader
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [],
      isLoading: false,
      isError: true,
      error: new Error('Failed to load NFTs'),
    });

    render(<NFTGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-gallery')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Failed to load NFTs' })).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('shows empty state when no NFTs', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-gallery')).toBeInTheDocument();
    expect(screen.getByText('No NFTs Available')).toBeInTheDocument();
    expect(screen.getByText(/There are currently no NFTs in this collection/)).toBeInTheDocument();
  });

  it('displays correct NFT count in title', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId('gallery-title')).toHaveTextContent('KILN NFT Collection (2)');
  });

  it('handles single NFT correctly', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [mockNFTs[0]],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTGallery />, { wrapper: createWrapper() });

    expect(screen.getByTestId('gallery-title')).toHaveTextContent('KILN NFT Collection (1)');
    expect(screen.getAllByTestId('nft-card')).toHaveLength(1);
  });
}); 