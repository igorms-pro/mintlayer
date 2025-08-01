import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MoreCollection } from '@/components/nft/MoreCollection';
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
  {
    chainId: 84532,
    id: '3',
    metadata: {
      name: 'KILN #3',
      description: 'Third amazing KILN NFT.',
      image: 'ipfs://QmTestImage3',
      attributes: [],
    },
    tokenAddress: '0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf',
    tokenURI: 'ipfs://QmTestURI3',
    type: 'ERC1155',
  },
];

describe('MoreCollection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders more collection section with related NFTs', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    });

    render(<MoreCollection currentNFTId="1" />, { wrapper: createWrapper() });

    expect(screen.getByText('More from this collection')).toBeInTheDocument();
    expect(screen.getByText('KILN #2')).toBeInTheDocument();
    expect(screen.getByText('KILN #3')).toBeInTheDocument();
    // Should not show current NFT
    expect(screen.queryByText('KILN #1')).not.toBeInTheDocument();
  });

  it('shows loading state when NFTs are loading', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [],
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    });

    render(<MoreCollection currentNFTId="1" />, { wrapper: createWrapper() });

    expect(screen.getByText('More from this collection')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('returns null when no related NFTs available', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: [mockNFTs[0]], // Only current NFT
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    });

    const { container } = render(<MoreCollection currentNFTId="1" />, { wrapper: createWrapper() });

    // Should not render anything when no related NFTs
    expect(container.firstChild).toBeNull();
  });

  it('respects maxItems prop', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    });

    render(<MoreCollection currentNFTId="1" maxItems={1} />, { wrapper: createWrapper() });

    expect(screen.getByText('KILN #2')).toBeInTheDocument();
    expect(screen.queryByText('KILN #3')).not.toBeInTheDocument();
  });

  it('handles NFT click navigation', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    });

    render(<MoreCollection currentNFTId="1" />, { wrapper: createWrapper() });

    const nftCard = screen.getByText('KILN #2').closest('div')?.parentElement;
    expect(nftCard).toHaveClass('cursor-pointer');
  });

  it('displays NFT images with correct alt text', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    });

    render(<MoreCollection currentNFTId="1" />, { wrapper: createWrapper() });

    expect(screen.getByAltText('KILN #2')).toBeInTheDocument();
    expect(screen.getByAltText('KILN #3')).toBeInTheDocument();
  });

  it('shows price information for each NFT', () => {
    vi.mocked(useNFTsModule.useNFTs).mockReturnValue({
      nfts: mockNFTs,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    });

    render(<MoreCollection currentNFTId="1" />, { wrapper: createWrapper() });

    const priceElements = screen.getAllByText('0.0 ETH');
    expect(priceElements).toHaveLength(2); // Should show price for 2 related NFTs
  });
}); 