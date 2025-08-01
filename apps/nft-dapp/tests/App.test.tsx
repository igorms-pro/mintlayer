import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WagmiProvider } from 'wagmi';
import { config } from '../src/config/wagmi';
import App from '../src/App';

// Mock RainbowKit to avoid provider issues in tests
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: {
    Custom: ({ children }: { children: React.ReactNode }) => <div data-testid="connect-button">{children}</div>,
  },
}));

describe('App', () => {
  it('renders the app container', () => {
    render(
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    );
    
    const container = screen.getByTestId('app-container');
    expect(container).toBeInTheDocument();
  });

  it('renders the header', () => {
    render(
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    );
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('applies correct styling classes to container', () => {
    render(
      <WagmiProvider config={config}>
        <App />
      </WagmiProvider>
    );
    
    const container = screen.getByTestId('app-container');
    expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
  });
}); 