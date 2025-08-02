import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { deposit } from './index';

async function testStep1() {
    const client = createPublicClient({
        chain: mainnet,
        transport: http()
    });

    try {
        // Test with a real vault address (Yearn USDC vault)
        const result = await deposit(client, {
            wallet: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
            vault: '0x5f18C75AbDAe578b483E5F43e12b3B0C0C0C0C0C', // Mock
            amount: 1000000n
        });
        console.log('Result:', result);
    } catch (error) {
        console.log('Expected error:', error.message);
    }
}

testStep1(); 