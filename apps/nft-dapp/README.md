# NFT Minting dApp

A React dApp for viewing and minting NFTs on Base Sepolia testnet.

**🌐 Live Demo: [https://mintlayer-nft-dapp.vercel.app/](https://mintlayer-nft-dapp.vercel.app/)**

## Quick Start

```bash
cd apps/nft-dapp
pnpm install
pnpm dev
```

## What It Does

- Browse NFTs in a gallery
- View detailed NFT information
- Connect Web3 wallets
- Mint NFTs (demo mode)

## Environment

Create `.env` file from .`.env_sample`:

```env
VITE_REOWN_PROJECT_ID=your_project_id
VITE_API_BASE_URL=https://mint-api-production-7d50.up.railway.app
VITE_NFT_CONTRACT_ADDRESS=0x0d26A64e833f84663b3aaDc311c352b3bb81e9Cf
VITE_ENV=development
```

## Scripts

```bash
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm test             # Run tests
pnpm playwright:test  # Run e2e tests
```

## Wallet Setup

1. Install MetaMask
2. Add Base Sepolia testnet:
   - RPC: https://sepolia.base.org
   - Chain ID: 84532
3. Get test ETH from [faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

That's it!
