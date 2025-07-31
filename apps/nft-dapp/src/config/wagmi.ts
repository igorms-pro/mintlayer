import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';
import { ENV_CONFIG } from './env';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: ENV_CONFIG.REOWN_PROJECT_ID,
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
}); 