# ERC-4626 Deposit Function Library

A TypeScript library for building and validating ERC-4626 vault deposit transactions. This library provides a complete implementation of the ERC-4626 deposit specification with comprehensive error handling, gas estimation, and validation.

## Features

- **ERC-4626 Compliance**: Full implementation of the ERC-4626 deposit specification
- **Gas Estimation**: Automatic gas cost estimation for transactions
- **Comprehensive Validation**: Balance, allowance, and max deposit limit checking
- **Type Safety**: Full TypeScript support with proper type definitions
- **Error Handling**: Custom error types for different failure scenarios
- **Testing**: 100% test coverage with both unit and integration tests

## Testing

**Make sure you're in the `packages/blockchain` folder first!**

```bash
# Install dependencies
bun install

# Run all tests
bun test

# Run tests with coverage
bun test --coverage

# Run specific test file
bun test index.test.ts
```

## Usage

### Basic Usage

```typescript
import { deposit, DepositParams } from '@your-org/blockchain';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Create a viem client
const client = createPublicClient({
  chain: mainnet,
  transport: http()
});

// Define deposit parameters
const params: DepositParams = {
  wallet: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  vault: '0x5f18C75AbDAe578b483E5F43e12b3B0C0C0C0C0C',
  amount: 1000000000000000000n // 1 token (18 decimals)
};

// Build the deposit transaction
const transaction = await deposit(client, params);

// Send the transaction using your wallet client
const hash = await walletClient.sendTransaction(transaction);
console.log('Transaction hash:', hash);
```



## API Reference

### Types

#### `DepositParams`
```typescript
type DepositParams = {
  wallet: `0x${string}`;  // User's wallet address
  vault: `0x${string}`;   // ERC-4626 vault address
  amount: bigint;         // Amount to deposit (in token units)
};
```

#### `Transaction`
```typescript
type Transaction = {
  data: `0x${string}`;    // Encoded function call data
  from: `0x${string}`;    // Sender address
  to: `0x${string}`;      // Vault address
  value: bigint;          // ETH value (0 for ERC-4626 deposits)
  gas: bigint;            // Estimated gas cost
};
```

### Functions

#### `deposit(client, params)`

Builds a deposit transaction for an ERC-4626 vault.

**Parameters:**
- `client: PublicClient` - Viem public client
- `params: DepositParams` - Deposit parameters

**Returns:** `Promise<Transaction>` - Transaction object ready to be sent

**Throws:**
- `NotEnoughBalanceError` - When user has insufficient token balance
- `MissingAllowanceError` - When vault lacks approval to spend tokens
- `AmountExceedsMaxDepositError` - When amount exceeds vault limits

### Error Classes

#### `NotEnoughBalanceError`
Thrown when the user doesn't have enough tokens to deposit.

#### `MissingAllowanceError`
Thrown when the vault doesn't have approval to spend the user's tokens.

#### `AmountExceedsMaxDepositError`
Thrown when the deposit amount exceeds the vault's maximum deposit limit.

## Testing

### Run Tests
```bash
# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run specific test file
bun test index.test.ts
```

### Test Coverage
- **100% Function Coverage** - All functions tested
- **100% Line Coverage** - All code paths covered
- **Unit Tests** - Mock-based testing for isolated functionality
- **Integration Tests** - Optional anvil-based testing (requires anvil installation)

### Test Structure
```
tests/
├── index.test.ts     # Unit tests with mocks (runs without anvil)
└── anvil.test.ts     # Integration tests with anvil (optional)
```

## How It Works

The deposit function follows the ERC-4626 specification and performs these steps:

1. **Asset Retrieval**: Gets the underlying asset address from the vault
2. **Balance Check**: Verifies user has sufficient token balance
3. **Allowance Check**: Ensures vault has approval to spend tokens
4. **Max Deposit Check**: Validates against vault's deposit limits
5. **Transaction Building**: Encodes the deposit function call
6. **Gas Estimation**: Estimates transaction gas cost
7. **Validation**: Ensures all transaction fields are valid

## Requirements

- **Node.js** 18+ or **Bun** 1.0+
- **TypeScript** 5.0+
- **Viem** 2.0+

**Optional:**
- **Anvil** - For integration testing (install with `curl -L https://foundry.paradigm.xyz | bash`)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure 100% test coverage
6. Submit a pull request

## License

MIT License - see LICENSE file for details

## Related Links

- [ERC-4626 Specification](https://eips.ethereum.org/EIPS/eip-4626)
- [Viem Documentation](https://viem.sh/)
