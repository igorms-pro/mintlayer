import { describe, test, expect, mock } from "bun:test";
import { createPublicClient, http } from "viem";
import { anvil } from "viem/chains";
import { deposit } from "./index";

describe("deposit function - step 1", () => {
    test("should get asset address from vault", async () => {
        const mockClient = {
            readContract: mock(async (params: any) => {
                if (params.functionName === "asset") {
                    return "0x1234567890123456789012345678901234567890";
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
            expect(error.message).toContain("only step 1 done");
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
    });
}); 