import type { PublicClient } from "viem";

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
   


    // 2. Check user's balance of the asset using client.readContract
    //    - ERC-20 spec: https://eips.ethereum.org/EIPS/eip-20#balanceof
   
    
    // 3. Check user's allowance for the vault using client.readContract
    //    - ERC-20 spec: https://eips.ethereum.org/EIPS/eip-20#allowance
   
    // 4. Check max deposit limit using client.readContract
    //    - ERC-4626 spec: https://eips.ethereum.org/EIPS/eip-4626#maxdeposit
   
    // 5. Build the deposit transaction data using encodeFunctionData
    //    - Viem docs: https://viem.sh/docs/contract/encodeFunctionData
   
    // 6. Estimate gas for the transaction using client.estimateContractGas
    //    - Viem docs: https://viem.sh/docs/contract/estimateContractGas
   
    // 7. Return the transaction object with all required fields
    //    - ERC-4626 spec: https://eips.ethereum.org/EIPS/eip-4626#deposit
    
    throw new Error("Not implemented yet");
}