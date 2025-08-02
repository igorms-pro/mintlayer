# Mintlayer

A monorepo containing an NFT dApp and ERC-4626 blockchain library.

**🌐 Live Demo: [https://mintlayer-nft-dapp.vercel.app/](https://mintlayer-nft-dapp.vercel.app/)**

## What's Inside

### 🎨 [NFT dApp](/apps/nft-dapp)
A React dApp for viewing and minting NFTs on Base Sepolia testnet.
- Browse NFT gallery
- Connect Web3 wallets
- Mint NFTs (demo mode)
- Live deployment on Vercel

### ⛓️ [Blockchain Library](/packages/blockchain)
An ERC-4626 deposit function library with 100% test coverage.
- Build deposit transactions
- Validate vault interactions
- Gas estimation
- Comprehensive testing

## Quick Start

```bash
# Install dependencies
pnpm install

# Start NFT dApp
pnpm dev

# Test blockchain library
cd packages/blockchain && bun install && bun test
```

## Project Structure

```
mintlayer/
├── apps/
│   └── nft-dapp/          # React NFT dApp
└── packages/
    └── blockchain/        # ERC-4626 library
└── docs/                  # Implementation notes
    ├── task1_notes.md     # NFT dApp notes
    └── task2_notes.md     # Blockchain library notes
```

## Development

- **NFT dApp**: See [apps/nft-dapp/README.md](/apps/nft-dapp/README.md)
- **Blockchain**: See [packages/blockchain/README.md](/packages/blockchain/README.md)
- **Implementation Notes**: See [docs/](/docs/)

## Scripts

```bash
pnpm dev          # Start NFT dApp development server
pnpm build        # Build NFT dApp for production
pnpm preview      # Preview NFT dApp production build
pnpm lint         # Run ESLint on NFT dApp
pnpm test         # Run NFT dApp tests
pnpm test:watch   # Run NFT dApp tests in watch mode
pnpm clean        # Clean all node_modules and dist folders
pnpm install:all  # Install all dependencies
```

That's it! Check out the individual package READMEs for detailed information.
