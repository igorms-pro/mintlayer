import type { PublicClient } from "viem";
import { encodeFunctionData } from "viem";

export type DepositParams = {
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

export class NotEnoughBalanceError extends Error {
    constructor() {
        super("Not enough balance");
    }
}

export class MissingAllowanceError extends Error {
    constructor() {
        super("Not enough allowance");
    }
}

export class AmountExceedsMaxDepositError extends Error {
    constructor() {
        super("Amount exceeds max deposit");
    }
}

/**
 * Deposit an amount of an asset into a given vault.
 *
 * @throws {NotEnoughBalanceError} if the wallet does not have enough balance to deposit the amount
 * @throws {MissingAllowanceError} if the wallet does not have enough allowance to deposit the amount
 * @throws {AmountExceedsMaxDepositError} if the amount exceeds the max deposit
 */
export async function deposit(
    client: PublicClient,
    { wallet, vault, amount }: DepositParams,
): Promise<Transaction> {
    // TODO: Steps
    // 1. Get the asset address from the vault using client.readContract
    //    - ERC-4626 spec: https://eips.ethereum.org/EIPS/eip-4626#asset
    const assetAddress = await client.readContract({
        address: vault,
        abi: [{
            name: "asset",
            type: "function",
            inputs: [],
            outputs: [{ name: "assetTokenAddress", type: "address" }],
            stateMutability: "view",
        }],
        functionName: "asset",
    });
    
    // 2. Check user's balance of the asset using client.readContract
    //    - ERC-20 spec: https://eips.ethereum.org/EIPS/eip-20#balanceof
    const balance = await client.readContract({
        address: assetAddress,
        abi: [{
            name: "balanceOf",
            type: "function",
            inputs: [{ name: "owner", type: "address" }],
            outputs: [{ name: "balance", type: "uint256" }],
            stateMutability: "view",
        }],
        functionName: "balanceOf",
        args: [wallet],
    });
    
    if (balance < amount) {
        throw new NotEnoughBalanceError();
    }
    
    // 3. Check user's allowance for the vault using client.readContract
    //    - ERC-20 spec: https://eips.ethereum.org/EIPS/eip-20#allowance
    const allowance = await client.readContract({
        address: assetAddress,
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
        args: [wallet, vault],
    });
    
    if (allowance < amount) {
        throw new MissingAllowanceError();
    }
    
    // 4. Check max deposit limit using client.readContract
    //    - ERC-4626 spec: https://eips.ethereum.org/EIPS/eip-4626#maxdeposit
    const maxDeposit = await client.readContract({
        address: vault,
        abi: [{
            name: "maxDeposit",
            type: "function",
            inputs: [{ name: "receiver", type: "address" }],
            outputs: [{ name: "maxAssets", type: "uint256" }],
            stateMutability: "view",
        }],
        functionName: "maxDeposit",
        args: [wallet],
    });
    
    if (amount > maxDeposit) {
        throw new AmountExceedsMaxDepositError();
    }
    
    // 5. Build the deposit transaction data using encodeFunctionData
    //    - Viem docs: https://viem.sh/docs/contract/encodeFunctionData
    const data = encodeFunctionData({
        abi: [{
            name: "deposit",
            type: "function",
            inputs: [
                { name: "assets", type: "uint256" },
                { name: "receiver", type: "address" },
            ],
            outputs: [{ name: "shares", type: "uint256" }],
            stateMutability: "nonpayable",
        }],
        functionName: "deposit",
        args: [amount, wallet],
    });
    
    // 6. Estimate gas for the transaction using client.estimateContractGas
    //    - Viem docs: https://viem.sh/docs/contract/estimateContractGas
   
    // 7. Return the transaction object with all required fields
    //    - ERC-4626 spec: https://eips.ethereum.org/EIPS/eip-4626#deposit
    
    return {
        data,
        from: wallet,
        to: vault,
        value: 0n,
        gas: 0n,
    };
}