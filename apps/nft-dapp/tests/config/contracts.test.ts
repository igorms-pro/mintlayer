import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CONTRACTS, CONTRACT_CONFIG, CONTRACT_HELPERS } from '@/config/contracts';

// Mock environment config
vi.mock('@/config/env', () => ({
  ENV_CONFIG: {
    NFT_CONTRACT_ADDRESS: '0x1234567890123456789012345678901234567890',
  },
}));

describe('Contracts Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CONTRACTS', () => {
    it('exports NFT collection contract address', () => {
      expect(CONTRACTS.NFT_COLLECTION).toBe('0x1234567890123456789012345678901234567890');
      expect(typeof CONTRACTS.NFT_COLLECTION).toBe('string');
    });

    it('has correct type annotation', () => {
      // TypeScript should enforce this, but we can test the runtime behavior
      expect(CONTRACTS.NFT_COLLECTION).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('CONTRACT_CONFIG', () => {
    it('has correct gas settings', () => {
      expect(CONTRACT_CONFIG.GAS_LIMIT).toBe(100000);
      expect(CONTRACT_CONFIG.GAS_PRICE_BUFFER).toBe(1.1);
    });

    it('has correct transaction settings', () => {
      expect(CONTRACT_CONFIG.CONFIRMATION_BLOCKS).toBe(1);
      expect(CONTRACT_CONFIG.TIMEOUT).toBe(300000); // 5 minutes
    });

    it('has correct claim settings', () => {
      expect(CONTRACT_CONFIG.DEFAULT_CLAIM_QUANTITY).toBe(1);
      expect(CONTRACT_CONFIG.DEFAULT_CURRENCY).toBe('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE');
      expect(CONTRACT_CONFIG.DEFAULT_PRICE).toBe('0');
    });

    it('has configuration structure', () => {
      expect(CONTRACT_CONFIG).toHaveProperty('GAS_LIMIT');
      expect(CONTRACT_CONFIG).toHaveProperty('GAS_PRICE_BUFFER');
      expect(CONTRACT_CONFIG).toHaveProperty('CONFIRMATION_BLOCKS');
      expect(CONTRACT_CONFIG).toHaveProperty('TIMEOUT');
      expect(CONTRACT_CONFIG).toHaveProperty('DEFAULT_CLAIM_QUANTITY');
      expect(CONTRACT_CONFIG).toHaveProperty('DEFAULT_CURRENCY');
      expect(CONTRACT_CONFIG).toHaveProperty('DEFAULT_PRICE');
    });
  });

  describe('CONTRACT_HELPERS', () => {
    describe('formatTokenId', () => {
      it('formats string token ID to bigint', () => {
        const result = CONTRACT_HELPERS.formatTokenId('123');
        expect(result).toBe(BigInt(123));
        expect(typeof result).toBe('bigint');
      });

      it('handles zero token ID', () => {
        const result = CONTRACT_HELPERS.formatTokenId('0');
        expect(result).toBe(BigInt(0));
      });

      it('handles large token IDs', () => {
        const result = CONTRACT_HELPERS.formatTokenId('999999999999999999');
        expect(result).toBe(BigInt('999999999999999999'));
      });
    });

    describe('formatQuantity', () => {
      it('formats number quantity to bigint', () => {
        const result = CONTRACT_HELPERS.formatQuantity(5);
        expect(result).toBe(BigInt(5));
        expect(typeof result).toBe('bigint');
      });

      it('handles zero quantity', () => {
        const result = CONTRACT_HELPERS.formatQuantity(0);
        expect(result).toBe(BigInt(0));
      });

      it('handles large quantities', () => {
        const result = CONTRACT_HELPERS.formatQuantity(1000000);
        expect(result).toBe(BigInt(1000000));
      });
    });

    describe('formatAddress', () => {
      it('formats string address to 0x address type', () => {
        const address = '0x1234567890123456789012345678901234567890';
        const result = CONTRACT_HELPERS.formatAddress(address);
        expect(result).toBe(address);
        expect(typeof result).toBe('string');
      });

      it('handles different address formats', () => {
        const address = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        const result = CONTRACT_HELPERS.formatAddress(address);
        expect(result).toBe(address);
      });
    });

    describe('prepareClaimArgs', () => {
      it('prepares claim arguments with default values', () => {
        const args = CONTRACT_HELPERS.prepareClaimArgs('123');

        expect(args).toHaveLength(7);
        expect(args[0]).toBe('0x0000000000000000000000000000000000000000'); // receiver
        expect(args[1]).toBe(BigInt(123)); // tokenId
        expect(args[2]).toBe(BigInt(1)); // quantity
        expect(args[3]).toBe('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'); // currency
        expect(args[4]).toBe(BigInt(0)); // pricePerToken
        expect(args[5]).toEqual({
          proof: [],
          quantityLimitPerWallet: BigInt(0),
          pricePerToken: BigInt(0),
          currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        });
        expect(args[6]).toBe('0x'); // data
      });

      it('prepares claim arguments with custom receiver', () => {
        const receiver = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        const args = CONTRACT_HELPERS.prepareClaimArgs('123', 1, receiver);

        expect(args[0]).toBe(receiver);
      });

      it('prepares claim arguments with custom quantity', () => {
        const args = CONTRACT_HELPERS.prepareClaimArgs('123', 5);

        expect(args[2]).toBe(BigInt(5)); // quantity
      });

      it('returns array with correct structure', () => {
        const args = CONTRACT_HELPERS.prepareClaimArgs('123');
        
        expect(Array.isArray(args)).toBe(true);
        expect(args).toHaveLength(7);
      });
    });

    describe('prepareVerifyClaimArgs', () => {
      it('prepares verify claim arguments correctly', () => {
        const args = CONTRACT_HELPERS.prepareVerifyClaimArgs(
          1, // conditionId
          '0x1234567890123456789012345678901234567890', // claimer
          '123', // tokenId
          5, // quantity
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // currency
          '1000000000000000000' // pricePerToken (1 ETH in wei)
        );

        expect(args).toHaveLength(7);
        expect(args[0]).toBe(BigInt(1)); // conditionId
        expect(args[1]).toBe('0x1234567890123456789012345678901234567890'); // claimer
        expect(args[2]).toBe(BigInt(123)); // tokenId
        expect(args[3]).toBe(BigInt(5)); // quantity
        expect(args[4]).toBe('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'); // currency
        expect(args[5]).toBe(BigInt('1000000000000000000')); // pricePerToken
        expect(args[6]).toEqual({
          proof: [],
          quantityLimitPerWallet: BigInt(0),
          pricePerToken: BigInt('1000000000000000000'),
          currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        });
      });

      it('handles zero values correctly', () => {
        const args = CONTRACT_HELPERS.prepareVerifyClaimArgs(
          0, // conditionId
          '0x0000000000000000000000000000000000000000', // claimer
          '0', // tokenId
          0, // quantity
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // currency
          '0' // pricePerToken
        );

        expect(args[0]).toBe(BigInt(0)); // conditionId
        expect(args[1]).toBe('0x0000000000000000000000000000000000000000'); // claimer
        expect(args[2]).toBe(BigInt(0)); // tokenId
        expect(args[3]).toBe(BigInt(0)); // quantity
        expect(args[5]).toBe(BigInt(0)); // pricePerToken
      });

      it('handles large values correctly', () => {
        const args = CONTRACT_HELPERS.prepareVerifyClaimArgs(
          999999, // conditionId
          '0x1234567890123456789012345678901234567890', // claimer
          '999999999999999999', // tokenId
          999999, // quantity
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // currency
          '99999999999999999999999999999999999999999999999999999999999999999999999999999999' // pricePerToken
        );

        expect(args[0]).toBe(BigInt(999999));
        expect(args[2]).toBe(BigInt('999999999999999999'));
        expect(args[3]).toBe(BigInt(999999));
        expect(args[5]).toBe(BigInt('99999999999999999999999999999999999999999999999999999999999999999999999999999999'));
      });
    });
  });

  describe('ERC1155_ABI export', () => {
    it('exports ERC1155 ABI from abi module', async () => {
      // This tests that the re-export works correctly
      const { ERC1155_ABI } = await import('@/config/contracts');
      expect(ERC1155_ABI).toBeDefined();
      expect(Array.isArray(ERC1155_ABI)).toBe(true);
    });
  });

  describe('Type safety', () => {
    it('ensures contract address is properly typed', () => {
      // This is more of a TypeScript test, but we can verify runtime behavior
      const address = CONTRACTS.NFT_COLLECTION;
      expect(address.startsWith('0x')).toBe(true);
      expect(address.length).toBe(42); // 0x + 40 hex chars
    });

    it('ensures helper functions return correct types', () => {
      const tokenId = CONTRACT_HELPERS.formatTokenId('123');
      const quantity = CONTRACT_HELPERS.formatQuantity(5);
      const address = CONTRACT_HELPERS.formatAddress('0x1234567890123456789012345678901234567890');

      expect(typeof tokenId).toBe('bigint');
      expect(typeof quantity).toBe('bigint');
      expect(typeof address).toBe('string');
      expect(address.startsWith('0x')).toBe(true);
    });
  });
}); 