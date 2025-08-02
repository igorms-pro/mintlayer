# ERC-4626 Deposit Function

Implementation of a deposit function for ERC-4626-compliant vaults.

## Setup

```bash
bun install
```

## Usage

```typescript
import { deposit } from './index';

const transaction = await deposit(client, {
  wallet: '0x1234...',
  vault: '0x5678...',
  amount: 1000000000000000000n
});
```

## Testing

```bash
bun test
```

## TODO

- [ ] Implement deposit function
- [ ] Add comprehensive tests
- [ ] Add error handling
