# ERC-4626 Deposit Function

Builds deposit transactions for ERC-4626 vaults.

## Features

- ERC-4626 compliance
- Gas estimation
- Balance & allowance validation
- TypeScript support
- 100% test coverage

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





## API

```typescript
// Main function
deposit(client: PublicClient, params: DepositParams): Promise<Transaction>

// Types
type DepositParams = {
  wallet: `0x${string}`;
  vault: `0x${string}`;
  amount: bigint;
};

type Transaction = {
  data: `0x${string}`;
  from: `0x${string}`;
  to: `0x${string}`;
  value: bigint;
  gas: bigint;
};

// Errors
NotEnoughBalanceError
MissingAllowanceError  
AmountExceedsMaxDepositError
```

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
