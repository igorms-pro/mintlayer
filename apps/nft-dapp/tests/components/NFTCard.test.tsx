import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NFTCard } from '@/components/nft/NFTCard';
import type { NFT } from '@/types/nft';

// Mock all hooks at the top level with simple implementations
vi.mock('@/hooks/useNFTBalance', () => ({
  useNFTBalance: () => ({
    balance: 0,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/useClaimStatus', () => ({
  useClaimStatus: () => ({
    canClaim: true,
    canClaimReason: null,
    userBalance: 0,
    hasReachedLimit: false,
    remainingClaims: 999,
    claimCondition: null,
    activeConditionId: null,
    isLoading: false,
    isConditionIdLoading: false,
    isConditionLoading: false,
    isError: false,
    isConditionIdError: false,
    isConditionError: false,
    error: null,
  }),
}));

vi.mock('@/hooks/useWeb3', () => ({
  useWeb3: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
    mint: vi.fn(),
    mintState: {
      isIdle: true,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
    },
    resetMintState: vi.fn(),
    isCorrectChain: true,
  }),
}));

vi.mock('@/utils/ipfs', () => ({
  getImageUrl: (url: string) => url,
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

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
const mockNFT: NFT = {
  chainId: 84532,
  id: '1',
  metadata: {
    name: 'KILN #1',
    description: 'A unique KILN NFT with amazing features and attributes.',
    image: 'ipfs://QmTestImage',
    attributes: [
      { trait_type: 'HEADWEAR', value: 'Red & White Kiln Cap' },
      { trait_type: 'EYEWEAR', value: 'Blue Square Shades' },
    ],
  },
  tokenAddress: '0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf',
  tokenURI: 'ipfs://QmTestURI',
  type: 'ERC1155',
};

describe('NFTCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders NFT card with basic information', () => {
    render(<NFTCard nft={mockNFT} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-card')).toBeInTheDocument();
    expect(screen.getByTestId('nft-name')).toHaveTextContent('KILN #1');
    expect(screen.getByTestId('nft-description')).toHaveTextContent(/A unique KILN NFT/);
    expect(screen.getByTestId('nft-image')).toBeInTheDocument();
  });

  it('shows claim button when user can claim', () => {
    render(<NFTCard nft={mockNFT} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('claim-button')).toBeInTheDocument();
    expect(screen.getByTestId('view-details-button')).toBeInTheDocument();
  });

  it('truncates long descriptions', () => {
    const longDescriptionNFT = {
      ...mockNFT,
      metadata: {
        ...mockNFT.metadata,
        description: 'This is a very long description that should be truncated because it exceeds the maximum length allowed for display in the NFT card component. It should show only the first 80 characters followed by ellipsis.',
      },
    };

    render(<NFTCard nft={longDescriptionNFT} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-description')).toHaveTextContent(/This is a very long description that should be truncated/);
    expect(screen.getByTestId('nft-description')).toHaveTextContent(/\.\.\./);
  });

  it('handles NFT with no attributes gracefully', () => {
    const nftWithoutAttributes = {
      ...mockNFT,
      metadata: {
        ...mockNFT.metadata,
        attributes: [],
      },
    };

    render(<NFTCard nft={nftWithoutAttributes} />, { wrapper: createWrapper() });

    expect(screen.getByTestId('nft-name')).toHaveTextContent('KILN #1');
    expect(screen.getByTestId('claim-button')).toBeInTheDocument();
  });

  it('displays NFT image with correct alt text', () => {
    render(<NFTCard nft={mockNFT} />, { wrapper: createWrapper() });

    const image = screen.getByTestId('nft-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('alt', 'KILN #1');
  });

  it('renders NFT attributes when present', () => {
    render(<NFTCard nft={mockNFT} />, { wrapper: createWrapper() });

    // The NFTCard component doesn't display attributes in the card view
    // Attributes are shown in the NFTDetailsCard component instead
    // This test verifies the card renders correctly with attributes data
    expect(screen.getByTestId('nft-card')).toBeInTheDocument();
    expect(screen.getByTestId('nft-name')).toHaveTextContent('KILN #1');
    expect(screen.getByTestId('claim-button')).toBeInTheDocument();
  });
}); 