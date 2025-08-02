# Task 2 - ERC-4626 Deposit Function

## What I Built

A TypeScript library that builds deposit transactions for ERC-4626 vaults. Takes wallet address, vault address, and amount, then returns a transaction you can send to the blockchain.

## The Problem

ERC-4626 vaults need several validations before allowing deposits:
- User must have enough tokens
- Vault must have approval to spend user's tokens  
- Amount must be within vault's limits
- Gas estimation for user experience

## Implementation Approach

### 7-Step Process

1. **Get Asset Address** - Query vault for underlying token
2. **Check Balance** - Verify user has sufficient tokens
3. **Check Allowance** - Ensure vault can spend user's tokens
4. **Check Max Deposit** - Validate against vault limits
5. **Build Transaction** - Encode deposit function call
6. **Estimate Gas** - Calculate transaction cost
7. **Validate & Return** - Ensure all fields are valid

### Why This Order?

Each step depends on the previous one:
- Need asset address to check balance
- Need balance before checking allowance
- Need allowance before checking max deposit
- Need all validations before building transaction

## Tech Stack

- **Runtime**: Bun
- **Web3**: Viem
- **Testing**: Bun Test Runner
- **TypeScript**: Full type safety

## Key Features

- **ERC-4626 Compliance**: Follows the specification exactly
- **Gas Estimation**: Accurate cost calculation
- **Error Handling**: Custom error types for different failures
- **Type Safety**: Full TypeScript support
- **Testing**: 100% coverage with unit and integration tests

## Error Handling

Created custom error classes:
- `NotEnoughBalanceError` - User doesn't have enough tokens
- `MissingAllowanceError` - Vault needs approval
- `AmountExceedsMaxDepositError` - Amount too large for vault

This helps developers handle specific error cases in their UI.

## Testing Strategy

### Unit Tests
- Mock all contract calls
- Test each validation step
- Test error conditions
- Test transaction building

### Integration Tests  
- Use real viem client with anvil
- Test with actual blockchain client
- Verify real-world scenarios

### Coverage
- 100% function coverage
- 100% line coverage
- All error paths tested
- Edge cases covered

## Challenges

### Validation Order
Getting the right sequence was tricky. Each check depends on the previous one, so the order matters.

### Gas Estimation
Making sure gas estimation works properly and doesn't fail. Used the same parameters as the actual transaction.

### Error Handling
Balancing comprehensive error handling with simple API. Wanted specific errors but not overwhelming complexity.

### Testing
Achieving 100% coverage while keeping tests readable. Had to test the validation error case that was easy to miss.

## What I Learned

- ERC-4626 is pretty straightforward once you understand the flow
- Gas estimation is crucial for user experience
- Error handling makes a big difference in usability
- Testing with real blockchain clients catches issues mocks miss
- TypeScript is essential for blockchain development

## Files

- `packages/blockchain/index.ts` - Main deposit function
- `packages/blockchain/index.test.ts` - Unit tests
- `packages/blockchain/anvil.test.ts` - Integration tests
- `packages/blockchain/README.md` - Documentation

## Future Improvements

Could add:
- Caching for asset addresses
- Batch contract calls for performance
- More vault functions (withdraw, preview)
- Retry logic for network failures

Pretty solid foundation for ERC-4626 interactions! 