import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NFTDetails } from '@/components/nft/NFTDetails';
import * as useNFTsModule from '@/hooks/useNFTs';

// Mock the hooks
vi.mock('@/hooks/useNFTs', () => ({
  useNFT: vi.fn(),
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
const mockNFT = {
  chainId: 84532,
  id: '1',
  metadata: {
    name: 'KILN #1',
    description: 'A unique KILN NFT with amazing features.',
    image: 'ipfs://QmTestImage1',
    attributes: [
      { trait_type: 'HEADWEAR', value: 'Red & White Kiln Cap' },
      { trait_type: 'EYEWEAR', value: 'Blue Square Shades' },
    ],
  },
  tokenAddress: '0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf',
  tokenURI: 'ipfs://QmTestURI1',
  type: 'ERC1155',
};

describe('NFTDetails Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useNFTs for MoreCollection component
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [],
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  it('renders NFT details with NFT data', () => {
    vi.mocked(useNFTsModule.useNFT).mockReturnValue({
      nft: mockNFT,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTDetails />, { wrapper: createWrapper() });

    expect(screen.getByText('KILN #1')).toBeInTheDocument();
    expect(screen.getByText('A unique KILN NFT with amazing features.')).toBeInTheDocument();
    expect(screen.getByText('Back to Gallery')).toBeInTheDocument();
  });

  it('shows loading state when NFT is loading', () => {
    vi.mocked(useNFTsModule.useNFT).mockReturnValue({
      nft: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    render(<NFTDetails />, { wrapper: createWrapper() });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error state when NFT is not found', () => {
    vi.mocked(useNFTsModule.useNFT).mockReturnValue({
      nft: undefined,
      isLoading: false,
      isError: true,
      error: new Error('NFT not found'),
    });

    render(<NFTDetails />, { wrapper: createWrapper() });

    expect(screen.getByText('NFT Not Found')).toBeInTheDocument();
    expect(screen.getByText('The NFT you\'re looking for doesn\'t exist.')).toBeInTheDocument();
    expect(screen.getByText('Back to Gallery')).toBeInTheDocument();
  });

  it('shows error state when NFT is null', () => {
    vi.mocked(useNFTsModule.useNFT).mockReturnValue({
      nft: undefined,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTDetails />, { wrapper: createWrapper() });

    expect(screen.getByText('NFT Not Found')).toBeInTheDocument();
  });

  it('renders NFT left panel and details card', () => {
    vi.mocked(useNFTsModule.useNFT).mockReturnValue({
      nft: mockNFT,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTDetails />, { wrapper: createWrapper() });

    // Should render the grid layout
    const grid = screen.getByText('KILN #1').closest('div')?.parentElement?.parentElement?.parentElement;
    expect(grid).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2');
  });

  it('renders more collection section', () => {
    vi.mocked(useNFTsModule.useNFT).mockReturnValue({
      nft: mockNFT,
      isLoading: false,
      isError: false,
      error: null,
    });

    // Mock useNFTs to return some related NFTs so MoreCollection renders
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [
        { ...mockNFT, id: '2' },
        { ...mockNFT, id: '3' },
      ],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTDetails />, { wrapper: createWrapper() });

    // MoreCollection component should be rendered
    expect(screen.getByText('More from this collection')).toBeInTheDocument();
  });

  it('handles back to gallery navigation', () => {
    vi.mocked(useNFTsModule.useNFT).mockReturnValue({
      nft: mockNFT,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NFTDetails />, { wrapper: createWrapper() });

    const backButton = screen.getByText('Back to Gallery');
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveClass('flex', 'items-center');
  });
}); 