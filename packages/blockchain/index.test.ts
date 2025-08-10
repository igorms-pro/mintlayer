import { describe, test, expect, mock } from "bun:test";
import { deposit } from "./index";
import { erc4626Abi, erc20Abi } from "viem";

// ABI constants for testing (same as in index.ts)
const ASSET_ABI = [
    {
        name: "asset",
        type: "function",
        inputs: [],
        outputs: [{ name: "assetTokenAddress", type: "address" }],
        stateMutability: "view",
    },
] as const;

const DEPOSIT_ABI = [
    {
        name: "deposit",
        type: "function",
        inputs: [
            { name: "assets", type: "uint256" },
            { name: "receiver", type: "address" },
        ],
        outputs: [{ name: "shares", type: "uint256" }],
        stateMutability: "nonpayable",
    },
] as const;

describe("deposit function - complete implementation", () => {
    test("should get asset address and validate deposit conditions", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
                }
                if (params.functionName === "balanceOf") {
                    return 2000000n; // sufficient balance
                }
                if (params.functionName === "allowance") {
                    return 2000000n; // sufficient allowance
                }
                if (params.functionName === "maxDeposit") {
                    return 2000000n; // sufficient max deposit
                }
                return 0n;
            }),
            estimateContractGas: mock(async () => 21000n),
        };

        const transaction = await deposit(mockClient as any, {
            wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            vault: "0x0987654321098765432109876543210987654321",
            amount: 1000000n,
        });

        expect(transaction).toBeDefined();
        expect(transaction.data).toMatch(/^0x[a-fA-F0-9]+$/);
        expect(transaction.from).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
        expect(transaction.to).toBe("0x0987654321098765432109876543210987654321");
        expect(transaction.value).toBe(0n);
        expect(transaction.gas).toBe(21000n);

        // Verify that readContract was called for asset
        expect(mockClient.readContract).toHaveBeenCalledWith({
            address: "0x0987654321098765432109876543210987654321",
            abi: ASSET_ABI,
            functionName: "asset",
        });
        
        // Verify that readContract was called for balance
        expect(mockClient.readContract).toHaveBeenCalledWith({
            address: "0x1234567890123456789012345678901234567890",
            abi: erc20Abi,
            functionName: "balanceOf",
            args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
        });
        
        // Verify that readContract was called for allowance
        expect(mockClient.readContract).toHaveBeenCalledWith({
            address: "0x1234567890123456789012345678901234567890",
            abi: erc20Abi,
            functionName: "allowance",
            args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x0987654321098765432109876543210987654321"],
        });
        
        // Verify that readContract was called for maxDeposit
        expect(mockClient.readContract).toHaveBeenCalledWith({
            address: "0x0987654321098765432109876543210987654321",
            abi: erc4626Abi,
            functionName: "maxDeposit",
            args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
        });
        
        // Verify that estimateContractGas was called correctly
        expect(mockClient.estimateContractGas).toHaveBeenCalledWith({
            address: "0x0987654321098765432109876543210987654321",
            abi: DEPOSIT_ABI,
            functionName: "deposit",
            args: [1000000n, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
            account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        });
    });
    
    test("should throw NotEnoughBalanceError when balance is insufficient", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
                }
                if (params.functionName === "balanceOf") {
                    return 500000n; // Less than deposit amount
                }
                return 0n;
            }),
            estimateContractGas: mock(async () => 21000n),
        };

        await expect(
            deposit(mockClient as any, {
                wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                vault: "0x0987654321098765432109876543210987654321",
                amount: 1000000n,
            })
        ).rejects.toThrow("Not enough balance");
    });
    
    test("should throw MissingAllowanceError when allowance is insufficient", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
                }
                if (params.functionName === "balanceOf") {
                    return 2000000n; 
                }
                if (params.functionName === "allowance") {
                    return 500000n; // less than deposit amount
                }
                return 0n;
            }),
            estimateContractGas: mock(async () => 21000n),
        };

        await expect(
            deposit(mockClient as any, {
                wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                vault: "0x0987654321098765432109876543210987654321",
                amount: 1000000n,
            })
        ).rejects.toThrow("Not enough allowance");
    });
    
    test("should throw AmountExceedsMaxDepositError when amount exceeds max deposit", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
                }
                if (params.functionName === "balanceOf") {
                    return 2000000n;
                }
                if (params.functionName === "allowance") {
                    return 2000000n;
                }
                if (params.functionName === "maxDeposit") {
                    return 500000n;
                }
                return 0n;
            }),
            estimateContractGas: mock(async () => 21000n),
        };

        await expect(
            deposit(mockClient as any, {
                wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                vault: "0x0987654321098765432109876543210987654321",
                amount: 1000000n,
            })
        ).rejects.toThrow("Amount exceeds max deposit");
    });
    
    test("should estimate gas correctly for deposit transaction", async () => {
        const mockGasEstimate = 150000n;
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
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
            }),
            estimateContractGas: mock(async () => mockGasEstimate),
        };

        const transaction = await deposit(mockClient as any, {
            wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            vault: "0x0987654321098765432109876543210987654321",
            amount: 1000000n,
        });

        expect(transaction.gas).toBe(mockGasEstimate);
        expect(mockClient.estimateContractGas).toHaveBeenCalledTimes(1);
    });
    
    test("should validate transaction data before returning", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
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
            }),
            estimateContractGas: mock(async () => 150000n),
        };

        const transaction = await deposit(mockClient as any, {
            wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            vault: "0x0987654321098765432109876543210987654321",
            amount: 1000000n,
        });

        // Verify all required transaction fields are present and valid
        expect(transaction.data).toBeDefined();
        expect(transaction.data).toMatch(/^0x[a-fA-F0-9]+$/);
        expect(transaction.from).toBe("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
        expect(transaction.to).toBe("0x0987654321098765432109876543210987654321");
        expect(transaction.value).toBe(0n);
        expect(transaction.gas).toBe(150000n);
    });
    
    test("should throw error for invalid transaction data", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
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
            }),
            estimateContractGas: mock(async () => undefined), // This will trigger the validation error
        };

        await expect(
            deposit(mockClient as any, {
                wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                vault: "0x0987654321098765432109876543210987654321",
                amount: 1000000n,
            })
        ).rejects.toThrow("Invalid transaction data");
    });
}); 