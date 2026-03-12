import { useState } from 'react';
import RiskBadge from './RiskBadge';
import { Copy, Activity, Zap, Check, ChevronDown, ChevronUp, Globe, Twitter, MessageCircle } from 'lucide-react';

interface TokenRowProps {
  token: any;
  onSnipe: (token: any) => void;
}

export default function TokenRow({ token, onSnipe }: TokenRowProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const copyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val.toFixed(0)}`;
  };

  const formatAge = (createdAt: number) => {
    const diffSeconds = Math.floor((Date.now() - createdAt) / 1000);
    if (diffSeconds < 60) return `${diffSeconds}s`;
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;
    
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks}w`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}mo`;
  };

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} className={`hover:bg-primary-500/5 transition-colors border-b border-white/5 cursor-pointer ${expanded ? 'bg-primary-500/5' : ''}`}>
        <td className="p-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`text-gray-500 transition-transform ${expanded ? 'rotate-180 text-primary-400' : ''}`}>
               <ChevronDown size={16} />
            </div>
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
                <button onClick={copyAddress} className="hover:text-primary-400 transition-colors p-1" title="Copy Address">
                  {copied ? <Check size={14} className="text-green-400" /> : <Copy size={12} />}
                </button>
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
        <div className="flex items-center gap-1.5 group relative">
          <span className="font-medium text-gray-300">{formatAge(token.createdAt)}</span>
          <div className="text-gray-500 hover:text-primary-400 cursor-help transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block whitespace-nowrap px-3 py-1.5 bg-base-800 border border-white/10 rounded-lg shadow-xl text-xs z-20 text-gray-300">
             Exact: {new Date(token.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}
          </div>
        </div>
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
             onClick={(e) => e.stopPropagation()}
             className="p-2 rounded-lg bg-base-800 border border-white/10 hover:border-primary-500/30 hover:bg-base-700 text-gray-300 transition-all"
             title="Chart on DexScreener"
           >
               <Activity size={16} />
             </a>
             <button 
               onClick={(e) => { e.stopPropagation(); onSnipe(token); }}
               className="px-4 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition-all
               bg-primary-600/20 text-primary-300 border border-primary-500/30 hover:bg-primary-600 hover:text-white"
             >
               <Zap size={16} /> Snipe
             </button>
          </div>
        </td>
      </tr>

      {/* Expanded Details Row */}
      {expanded && (
        <tr className="bg-primary-500/5 animate-in slide-in-from-top-1">
           <td colSpan={6} className="px-14 py-4 border-b border-primary-500/10">
              <div className="flex items-center gap-6">
                 {/* Socials & Web */}
                 <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Links:</span>
                    
                    {token.websites?.length > 0 ? (
                       token.websites.map((web: any, i: number) => (
                         <a key={i} href={web.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-primary-300 hover:text-white bg-primary-500/10 px-2.5 py-1 rounded-md border border-primary-500/20 transition-colors">
                           <Globe size={12} /> {web.label || 'Website'}
                         </a>
                       ))
                    ) : null}

                    {token.socials?.length > 0 ? (
                       token.socials.map((soc: any, i: number) => {
                         const isTwitter = soc.type.toLowerCase().includes('twitter') || soc.type.toLowerCase().includes('x');
                         const isTelegram = soc.type.toLowerCase().includes('telegram') || soc.type.toLowerCase().includes('tg');
                         return (
                           <a key={i} href={soc.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="flex items-center gap-1.5 text-xs text-primary-300 hover:text-white bg-primary-500/10 px-2.5 py-1 rounded-md border border-primary-500/20 transition-colors">
                             {isTwitter && <Twitter size={12} />}
                             {isTelegram && <MessageCircle size={12} />}
                             {!isTwitter && !isTelegram && <Globe size={12} />}
                             {soc.type.charAt(0).toUpperCase() + soc.type.slice(1)}
                           </a>
                         );
                       })
                    ) : null}

                    {(!token.websites?.length && !token.socials?.length) && <span className="text-xs text-gray-600">No Web or Socials provided by DEX</span>}
                 </div>
              </div>
           </td>
        </tr>
      )}
    </>
  );
}
