import { describe, test, expect, mock } from "bun:test";
import { createPublicClient, http } from "viem";
import { anvil } from "viem/chains";
import { deposit } from "./index";

describe("deposit function - steps 1-4", () => {
    test("should get asset address and validate deposit conditions", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
                }
                if (params.functionName === "balanceOf") {
                    return 2000000n; // Sufficient balance
                }
                if (params.functionName === "allowance") {
                    return 2000000n; // Sufficient allowance
                }
                if (params.functionName === "maxDeposit") {
                    return 2000000n; // Sufficient max deposit
                }
                return 0n;
            }),
            estimateContractGas: mock(async () => 21000n),
        };

        try {
            await deposit(mockClient as any, {
                wallet: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
                vault: "0x0987654321098765432109876543210987654321",
                amount: 1000000n,
            });
        } catch (error: any) {
            expect(error.message).toContain("only steps 1-4 done");
        }

        // Verify that readContract was called for asset
        expect(mockClient.readContract).toHaveBeenCalledWith({
            address: "0x0987654321098765432109876543210987654321",
            abi: [{
                name: "asset",
                type: "function",
                inputs: [],
                outputs: [{ name: "assetTokenAddress", type: "address" }],
                stateMutability: "view",
            }],
            functionName: "asset",
        });
        
        // Verify that readContract was called for balance
        expect(mockClient.readContract).toHaveBeenCalledWith({
            address: "0x1234567890123456789012345678901234567890",
            abi: [{
                name: "balanceOf",
                type: "function",
                inputs: [{ name: "owner", type: "address" }],
                outputs: [{ name: "balance", type: "uint256" }],
                stateMutability: "view",
            }],
            functionName: "balanceOf",
            args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"],
        });
        
        // Verify that readContract was called for allowance
        expect(mockClient.readContract).toHaveBeenCalledWith({
            address: "0x1234567890123456789012345678901234567890",
            abi: [{
                name: "allowance",
                type: "function",
                inputs: [
                    { name: "owner", type: "address" },
                    { name: "spender", type: "address" },
                ],
                outputs: [{ name: "remaining", type: "uint256" }],
                stateMutability: "view",
            }],
            functionName: "allowance",
            args: ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x0987654321098765432109876543210987654321"],
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
                    return 2000000n; // Sufficient balance
                }
                if (params.functionName === "allowance") {
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
        ).rejects.toThrow("Not enough allowance");
    });
    
    test("should throw AmountExceedsMaxDepositError when amount exceeds max deposit", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
                }
                if (params.functionName === "balanceOf") {
                    return 2000000n; // Sufficient balance
                }
                if (params.functionName === "allowance") {
                    return 2000000n; // Sufficient allowance
                }
                if (params.functionName === "maxDeposit") {
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
        ).rejects.toThrow("Amount exceeds max deposit");
    });
}); 