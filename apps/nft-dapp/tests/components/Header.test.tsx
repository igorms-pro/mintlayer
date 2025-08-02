import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock RainbowKit ConnectButton with hoisted function
const mockConnectButton = vi.hoisted(() => vi.fn());

vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: mockConnectButton,
  },
}));

import { Header } from '@/components/layout/Header';

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    mockConnectButton.mockImplementation(({ children }: { children: (props: unknown) => React.ReactNode }) => {
      const mockProps = {
        account: {
          address: '0x1234567890123456789012345678901234567890',
          displayName: '0x1234...7890',
          displayBalance: '0.1 ETH',
        },
        chain: {
          id: 84532,
          name: 'Base Sepolia',
          hasIcon: true,
          iconUrl: '/base-sepolia-icon.svg',
          iconBackground: '#0052ff',
          unsupported: false,
        },
        openAccountModal: vi.fn(),
        openChainModal: vi.fn(),
        openConnectModal: vi.fn(),
        authenticationStatus: 'authenticated',
        mounted: true,
      };

      return <div data-testid="connect-button">{children(mockProps)}</div>;
    });
  });

  it('renders header with Kiln logo', () => {
    render(<Header />);

    const logo = screen.getByAltText('Kiln');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/kiln-logo.svg');
    expect(logo).toHaveClass('h-6', 'w-[69px]', 'sm:h-8', 'sm:w-[92.3px]');
  });

  it('renders connect button component', () => {
    render(<Header />);

    expect(screen.getByTestId('connect-button')).toBeInTheDocument();
  });

  it('renders connected state with chain and account buttons', () => {
    render(<Header />);

    // Should show chain name and account info
    expect(screen.getByText('Base Sepolia')).toBeInTheDocument();
    expect(screen.getByText('0x1234...7890 (0.1 ETH)')).toBeInTheDocument();
  });

  it('renders chain icon when available', () => {
    render(<Header />);

    const chainIcon = screen.getByAltText('Base Sepolia');
    expect(chainIcon).toBeInTheDocument();
    expect(chainIcon).toHaveAttribute('src', '/base-sepolia-icon.svg');
    expect(chainIcon).toHaveClass('h-4', 'w-4');
  });

  it('has proper header styling', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass(
      'sticky',
      'top-0',
      'z-10',
      'w-full',
      'border-b',
      'border-gray-200',
      'bg-white/95',
      'backdrop-blur'
    );
  });

  it('has responsive layout structure', () => {
    render(<Header />);

    const container = screen.getByRole('banner').querySelector('div');
    expect(container).toHaveClass('px-4', 'sm:px-8', 'py-4');
    
    const flexContainer = container?.querySelector('div');
    expect(flexContainer).toHaveClass('flex', 'h-8', 'items-center', 'justify-between');
  });

  it('renders connect button with correct props', () => {
    render(<Header />);

    expect(mockConnectButton).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.any(Function),
      }),
      undefined
    );
  });
}); 