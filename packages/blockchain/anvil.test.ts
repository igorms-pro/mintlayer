import { describe, test, expect, beforeAll } from "bun:test";
import { createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { anvil } from "viem/chains";
import { deposit, NotEnoughBalanceError, MissingAllowanceError } from "./index";



describe("deposit function - anvil integration tests", () => {
    let publicClient: any;
    let testAccount: any;
    let tokenAddress: `0x${string}`;
    let vaultAddress: `0x${string}`;

    beforeAll(async () => {
        // Create client for anvil
        publicClient = createPublicClient({
            chain: anvil,
            transport: http("http://localhost:8545"),
        });

        // Use the first account from anvil
        testAccount = privateKeyToAccount("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

        // mock addresses 
        tokenAddress = "0x1234567890123456789012345678901234567890";
        vaultAddress = "0x0987654321098765432109876543210987654321";
    });

    test("should handle insufficient balance error with real client", async () => {
        
        const mockClient = {
            ...publicClient,
            readContract: async (params: any) => {
                if (params.functionName === "asset") {
                    return tokenAddress;
                }
                if (params.functionName === "balanceOf") {
                    return 500000n; // less than deposit amount
                }
                return 0n;
            },
        } as any;

        await expect(
            deposit(mockClient, {
                wallet: testAccount.address,
                vault: vaultAddress,
                amount: 1000000n,
            })
        ).rejects.toThrow(NotEnoughBalanceError);
    });

    test("should handle missing allowance error with real client", async () => {
        const mockClient = {
            ...publicClient,
            readContract: async (params: any) => {
                if (params.functionName === "asset") {
                    return tokenAddress;
                }
                if (params.functionName === "balanceOf") {
                    return 2000000n; // sufficient balance
                }
                if (params.functionName === "allowance") {
                    return 500000n;
                }
                return 0n;
            },
        } as any;

        await expect(
            deposit(mockClient, {
                wallet: testAccount.address,
                vault: vaultAddress,
                amount: 1000000n,
            })
        ).rejects.toThrow(MissingAllowanceError);
    });

    test("should create valid transaction with real client", async () => {
        const mockClient = {
            ...publicClient,
            readContract: async (params: any) => {
                if (params.functionName === "asset") {
                    return tokenAddress;
                }
                if (params.functionName === "balanceOf") {
                    return 2000000n;
                }
                if (params.functionName === "allowance") {
                    return 2000000n;
                }
                if (params.functionName === "maxDeposit") {
                    return 2000000n;
                }
                return 0n;
            },
            estimateContractGas: async () => 150000n,
        } as any;

        const transaction = await deposit(mockClient, {
            wallet: testAccount.address,
            vault: vaultAddress,
            amount: 1000000n,
        });

        expect(transaction).toBeDefined();
        expect(transaction.data).toMatch(/^0x[a-fA-F0-9]+$/);
        expect(transaction.from).toBe(testAccount.address);
        expect(transaction.to).toBe(vaultAddress);
        expect(transaction.value).toBe(0n);
        expect(transaction.gas).toBe(150000n);
    });
}); 