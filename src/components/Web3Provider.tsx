"use client";

import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet, metaMask } from 'wagmi/connectors';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useState } from 'react';

const config = createConfig({
  chains: [base],
  connectors: [
    injected(), // Active toutes les extensions EIP-6963 installées (Zerion, Rabby, etc.)
    metaMask(), // Force l'affichage de MetaMask spécifiquement
    coinbaseWallet({ appName: 'Base Sniper Platform' }),
  ],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
