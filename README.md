# NFT Minting dApp

A React/TypeScript dApp for viewing and minting ERC1155 NFTs on Base Sepolia testnet.

## Features

- 🖼️ **NFT Gallery**: Browse all available NFTs with beautiful grid layout
- 🔍 **NFT Details**: View detailed information about each NFT including attributes
- 👛 **Wallet Integration**: Connect MetaMask or other Web3 wallets
- 💰 **Balance Display**: View your Base Sepolia ETH balance
- 🪙 **NFT Minting**: Mint ERC1155 NFTs (demo implementation)
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Modern Tech Stack**: React 19, TypeScript, Vite, Tailwind CSS

## Tech Stack

### Frontend (apps/nft-dapp)
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Web3**: Wagmi + Viem
- **Data Fetching**: TanStack Query
- **Blockchain**: Base Sepolia testnet

### Blockchain (packages/blockchain)
- **Runtime**: Bun
- **Web3**: Viem
- **Testing**: Bun Test Runner
- **Blockchain**: Base Sepolia testnet + Anvil compatibility

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MetaMask or another Web3 wallet extension

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mintlayer
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Wallet Setup

1. Install MetaMask or another Web3 wallet extension
2. Add Base Sepolia testnet to your wallet:
   - Network Name: Base Sepolia
   - RPC URL: https://sepolia.base.org
   - Chain ID: 84532
   - Currency Symbol: ETH
3. Get some test ETH from the [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)

## API Endpoints

The dApp connects to the following API:
- **Base URL**: https://mint-api-production-7d50.up.railway.app
- **GET /nfts**: List all available NFTs
- **GET /nfts/:id**: Get details of a specific NFT

## Project Structure

```
mintlayer/
├── apps/
│   └── nft-dapp/       # Your Vite + React + Wagmi + Tailwind
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── services/       # API services
│       │   ├── types/          # TypeScript type definitions
│       │   ├── config/         # Configuration files
│       │   └── App.tsx         # Main application component
│       ├── package.json        # Frontend dependencies
│       ├── tsconfig.json       # TypeScript config
│       └── vite.config.ts      # Vite configuration
├── packages/
│   └── blockchain/     # Bun + Viem + Anvil test suite
│       ├── deposit.ts          # Blockchain integration
│       ├── deposit.test.ts     # Test files
│       ├── package.json        # Blockchain dependencies
│       ├── tsconfig.json       # TypeScript config
│       └── README.md           # Package documentation
├── tsconfig.base.json          # Shared base TypeScript config
├── tsconfig.json               # Root TypeScript references
├── package.json                # Root workspace configuration
└── README.md                   # This file
```

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your Web3 wallet
2. **Browse NFTs**: View all available NFTs in the gallery
3. **View Details**: Click on any NFT to see detailed information
4. **Mint NFT**: Click "Mint NFT" to mint the selected NFT (demo mode)

## Development

### Available Scripts

#### Root Level (Monorepo)
- `pnpm dev` - Start NFT dApp development server
- `pnpm build` - Build NFT dApp for production
- `pnpm preview` - Preview NFT dApp production build
- `pnpm lint` - Run ESLint on NFT dApp
- `pnpm test` - Run blockchain tests
- `pnpm test:watch` - Run blockchain tests in watch mode
- `pnpm clean` - Clean all node_modules and dist folders
- `pnpm install:all` - Install all dependencies

#### NFT dApp (apps/nft-dapp)
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

#### Blockchain (packages/blockchain)
- `bun test` - Run all tests
- `bun test --watch` - Run tests in watch mode
- `bun run deposit` - Run deposit script
- `bun run build` - Type check the code

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id
```

### Customization

- **Styling**: Modify Tailwind classes in components
- **API**: Update API endpoints in `src/services/api.ts`
- **Web3**: Configure chains and connectors in `src/config/wagmi.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the repository or contact the development team.
# test
