"use client";

import { useState } from 'react';
import useSWR from 'swr';
import { Loader2, RefreshCw } from 'lucide-react';
import TokenRow from './TokenRow';
import SnipeModal from './SnipeModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TokenTable() {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/tokens', fetcher, { 
    refreshInterval: 15000,
    revalidateOnFocus: true,
  });

  const [snipeToken, setSnipeToken] = useState<any>(null);

  if (error) return <div className="p-8 text-center text-red-400 glass-card">Failed to load tokens. Please check your network or API limits.</div>;

  const tokens = data?.tokens || [];

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-primary-500/10 flex justify-between items-center bg-base-800/40">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Live Base Pairs</h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Scanning
            </div>
          </div>
          <button 
            onClick={() => mutate()} 
             className={`p-2 rounded-lg bg-base-800 border border-white/5 hover:bg-base-700 hover:text-primary-400 transition-colors ${isValidating ? 'animate-spin text-primary-500' : 'text-gray-400'}`}
          >
            <RefreshCw size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading && !tokens.length ? (
            <div className="p-12 flex justify-center items-center text-primary-500">
              <Loader2 className="animate-spin" size={32} />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-gray-500 bg-base-900/40 border-b border-white/5">
                  <th className="p-4 font-semibold">Token</th>
                  <th className="p-4 font-semibold">Liquidity</th>
                  <th className="p-4 font-semibold">Market Cap</th>
                  <th className="p-4 font-semibold">Age</th>
                  <th className="p-4 font-semibold">Risk Level</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">
                       Waiting for new pairs on Base chain...
                     </td>
                   </tr>
                ) : (
                  tokens.map((token: any) => (
                    <TokenRow 
                      key={token.address} 
                      token={token} 
                      onSnipe={() => setSnipeToken(token)} 
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {snipeToken && (
        <SnipeModal token={snipeToken} onClose={() => setSnipeToken(null)} />
      )}
    </>
  );
}
