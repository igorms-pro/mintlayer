# Task 1 - NFT dApp Implementation

## What I Built

A React dApp for viewing and minting NFTs on Base Sepolia testnet. Users can browse NFTs, view details, connect wallets, and mint NFTs (in demo mode).

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Testing**: Vitest + Playwright
- **Blockchain**: Base Sepolia testnet

## Key Features

- **NFT Gallery**: Grid layout showing all available NFTs
- **NFT Details**: Detailed view with attributes and social links
- **Wallet Integration**: Connect MetaMask and other wallets
- **Balance Display**: Show user's ETH balance
- **Minting Interface**: Demo NFT minting functionality
- **Responsive Design**: Works on mobile and desktop

## Implementation Details

### Project Structure
```
apps/nft-dapp/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom hooks (useNFTs, useWeb3, etc.)
│   ├── services/      # API calls
│   ├── types/         # TypeScript definitions
│   └── config/        # Wagmi and contract configs
├── tests/             # Unit tests
└── e2e/              # Playwright tests
```

### Key Components

- **NFTGallery**: Main grid view of all NFTs
- **NFTDetails**: Detailed view of individual NFTs
- **Header**: Navigation and wallet connection
- **KilnCard**: Featured NFT display
- **MoreCollection**: Related NFTs section

### Web3 Integration

Used Wagmi for wallet connection and contract interactions:
- Wallet connection (MetaMask, WalletConnect)
- Contract reads (NFT balance, metadata)
- Contract writes (minting functionality)

### API Integration

Connected to external API for NFT data:
- Fetch all NFTs
- Get individual NFT details
- Handle loading and error states

## Testing Strategy

- **Unit Tests**: 118 tests covering components, hooks, services
- **E2E Tests**: 6 Playwright tests for user flows
- **Component Tests**: Test individual React components
- **Hook Tests**: Test custom Web3 hooks
- **Service Tests**: Test API integration

## Challenges Faced

- **CI/CD Setup**: Getting the monorepo pipeline working properly
- **Dependencies**: Managing pnpm workspace and lockfile issues

## What I Learned

- Monorepos with pnpm can be tricky but powerful
- CI/CD needs proper lockfile management
- Testing Web3 interactions requires good mocking

## Files

- `apps/nft-dapp/src/` - Main application code
- `apps/nft-dapp/tests/` - Unit tests
- `apps/nft-dapp/e2e/` - End-to-end tests
- `apps/nft-dapp/package.json` - Dependencies and scripts

Pretty straightforward React app with Web3 integration! 