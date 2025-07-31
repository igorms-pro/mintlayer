import { createConfig, http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
}); 