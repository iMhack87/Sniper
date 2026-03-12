import RiskBadge from './RiskBadge';
import { Copy, Activity, Zap } from 'lucide-react';

interface TokenRowProps {
  token: any;
  onSnipe: (token: any) => void;
}

export default function TokenRow({ token, onSnipe }: TokenRowProps) {
  const copyAddress = () => {
    navigator.clipboard.writeText(token.address);
    // Could add a toast here
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(0)}`;
  };

  return (
    <tr className="hover:bg-primary-500/5 transition-colors border-b border-white/5">
      <td className="p-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-base-800 flex items-center justify-center overflow-hidden border border-white/10 flex-shrink-0 animate-glow">
            {token.imageUrl ? (
              <img src={token.imageUrl} alt={token.symbol} className="w-full h-full object-cover" />
            ) : (
              <div className="text-xs font-bold text-primary-400">{token.symbol.substring(0,2)}</div>
            )}
          </div>
          <div>
            <div className="font-bold text-sm text-white flex items-center gap-2">
              {token.name} <span className="text-xs px-1.5 py-0.5 rounded bg-base-700 text-gray-300 font-mono">{token.symbol}</span>
            </div>
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 font-mono">
              {token.address.substring(0,6)}...{token.address.substring(38)}
              <button onClick={copyAddress} className="hover:text-primary-400 transition-colors p-1"><Copy size={12} /></button>
            </div>
          </div>
        </div>
      </td>
      
      <td className="p-4 py-3 text-sm">
        <div className="font-semibold">{formatCurrency(token.liquidityUsd)}</div>
        <div className="text-xs text-gray-500">Liq.</div>
      </td>

      <td className="p-4 py-3 text-sm">
        <div className="font-semibold">{formatCurrency(token.fdv)}</div>
        <div className="text-xs text-gray-500">MCap</div>
      </td>

      <td className="p-4 py-3 text-sm">
        <div className="font-medium text-gray-300">{token.ageMinutes}m ago</div>
      </td>

      <td className="p-4 py-3">
        <RiskBadge level={token.riskLevel} hints={token.riskHints} />
      </td>

      <td className="p-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
           <a 
             href={token.dexScreenerLink} 
             target="_blank" 
             rel="noopener noreferrer"
             className="p-2 rounded-lg bg-base-800 border border-white/10 hover:border-primary-500/30 hover:bg-base-700 text-gray-300 transition-all"
             title="Chart on DexScreener"
           >
             <Activity size={16} />
           </a>
           <button 
             onClick={() => onSnipe(token)}
             className="px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all
             bg-primary-600/20 text-primary-300 border border-primary-500/30 hover:bg-primary-600 hover:text-white"
           >
             <Zap size={16} /> Snipe
           </button>
        </div>
      </td>
    </tr>
  );
}
