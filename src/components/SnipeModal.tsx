import { useState } from 'react';
import { X, Settings2, Zap, AlertTriangle } from 'lucide-react';

interface SnipeModalProps {
  token: any;
  onClose: () => void;
}

export default function SnipeModal({ token, onClose }: SnipeModalProps) {
  const [amount, setAmount] = useState('0.05');
  const [slippage, setSlippage] = useState('15');
  const [priority, setPriority] = useState('high');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [hash, setHash] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSnipe = async () => {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/snipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress: token.address,
          ethAmount: amount,
          slippage,
          gasPriority: priority
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Snipe failed');
      
      setStatus('success');
      setHash(data.hash);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-900/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-primary-500/10 flex justify-between items-center bg-base-800/50">
          <h3 className="font-semibold flex items-center gap-2">
            <Zap className="text-primary-500" size={18} />
            Snipe {token.symbol}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          <div className="bg-base-900/50 p-3 rounded-lg border border-white/5 flex gap-3 info-box">
             <div className="h-10 w-10 rounded-full bg-base-800 flex items-center justify-center overflow-hidden flex-shrink-0">
               {token.imageUrl ? <img src={token.imageUrl} alt={token.symbol} className="w-full h-full object-cover" /> : <div className="text-xs font-bold">{token.symbol.substring(0,2)}</div>}
             </div>
             <div>
               <div className="font-semibold text-sm">{token.name}</div>
               <div className="text-xs text-gray-400 font-mono break-all">{token.address}</div>
             </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 mb-1 flex justify-between">
                <span>Amount (ETH)</span>
                <span>Max: 0.1 ETH</span>
              </label>
              <input 
                type="number" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-base-900 border border-primary-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                step="0.01" min="0.01" max="0.1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Slippage (%)</label>
                <input 
                  type="number" 
                  value={slippage} 
                  onChange={e => setSlippage(e.target.value)}
                  className="w-full bg-base-900 border border-primary-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Gas Priority</label>
                <select 
                  value={priority} 
                  onChange={e => setPriority(e.target.value)}
                  className="w-full bg-base-900 border border-primary-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors appearance-none"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High (Fast)</option>
                  <option value="extreme">Extreme</option>
                </select>
              </div>
            </div>
          </div>

          {status === 'error' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-2 items-start text-red-500 text-xs">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex flex-col gap-1 text-green-500 text-xs text-center">
              <p className="font-semibold">Transaction Sent!</p>
              <p className="break-all font-mono opacity-80">{hash}</p>
            </div>
          )}

          <div className="pt-2">
            <button 
              onClick={handleSnipe}
              disabled={status === 'loading' || status === 'success'}
              className="w-full py-3 rounded-lg font-semibold flex flex-row justify-center items-center gap-2 transition-all duration-300 disabled:opacity-50
              bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-500/25"
            >
              {status === 'loading' ? (
                <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : status === 'success' ? 'Deployed' : (
                <>
                  <Zap size={18} /> Execute Snipe
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
