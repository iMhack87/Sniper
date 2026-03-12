"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import useSWRInfinite from 'swr/infinite';
import { Loader2, RefreshCw, Search, ArrowUpDown, ArrowUp, ArrowDown, Filter, X } from 'lucide-react';
import TokenRow from './TokenRow';
import SnipeModal from './SnipeModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TokenTable() {
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{key: 'ageMinutes' | 'liquidityUsd' | 'fdv', direction: 'asc' | 'desc'}>({
    key: 'ageMinutes',
    direction: 'asc' // asc for age means lower minutes first (newest)
  });

  // Filtering state
  const [filters, setFilters] = useState({
    minLiq: '',
    maxLiq: '',
    minMcap: '',
    maxMcap: '',
    risks: { GREEN: true, YELLOW: true, RED: true }
  });

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.tokens.length) return null; // reached the end
    if (query) {
      if (pageIndex > 0) return null; // Search only has 1 page for now
      return `/api/tokens?q=${encodeURIComponent(query)}`;
    }
    return `/api/tokens?page=${pageIndex + 1}`;
  };

  const { data, error, size, setSize, isLoading, isValidating, mutate } = useSWRInfinite(getKey, fetcher, { 
    refreshInterval: 15000,
    revalidateOnFocus: true,
    persistSize: true,
  });

  const observerTarget = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoading && !query) {
          setSize(prevSize => prevSize + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    const currentTarget = observerTarget.current;
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [observerTarget, isLoading, query, setSize]);

  const [snipeToken, setSnipeToken] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput);
  };

  const clearSearch = () => {
    setSearchInput('');
    setQuery('');
  };

  const handleSort = (key: 'ageMinutes' | 'liquidityUsd' | 'fdv') => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="text-gray-600 opacity-50 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="text-primary-500" />
      : <ArrowDown size={14} className="text-primary-500" />;
  };

  const toggleRisk = (level: 'GREEN' | 'YELLOW' | 'RED') => {
    setFilters(prev => ({
      ...prev,
      risks: { ...prev.risks, [level]: !prev.risks[level] }
    }));
  };

  const clearFilters = () => {
    setFilters({ minLiq: '', maxLiq: '', minMcap: '', maxMcap: '', risks: { GREEN: true, YELLOW: true, RED: true } });
  };

  if (error) return <div className="p-8 text-center text-red-400 glass-card break-all">Failed to load tokens. Please check your network or API limits.</div>;

  const rawTokens = data ? data.flatMap(pageData => pageData.tokens || []) : [];
  
  // Apply filtering and sorting
  const filteredAndSortedTokens = useMemo(() => {
    return [...rawTokens].filter((t: any) => {
      // Risk filter
      if (!filters.risks[t.riskLevel as 'GREEN'|'YELLOW'|'RED']) return false;

      // Liquidity filter
      const liq = t.liquidityUsd || 0;
      if (filters.minLiq && liq < parseFloat(filters.minLiq)) return false;
      if (filters.maxLiq && liq > parseFloat(filters.maxLiq)) return false;

      // Market Cap filter
      const mcap = t.fdv || 0;
      if (filters.minMcap && mcap < parseFloat(filters.minMcap)) return false;
      if (filters.maxMcap && mcap > parseFloat(filters.maxMcap)) return false;

      return true;
    }).sort((a: any, b: any) => {
      const aVal = a[sortConfig.key] || 0;
      const bVal = b[sortConfig.key] || 0;
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rawTokens, filters, sortConfig]);

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-primary-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-base-800/40">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{query ? 'Search Results' : 'Latest Base Pairs'}</h2>
            {!query && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Feed
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <form onSubmit={handleSearch} className="relative w-full md:w-64">
              <input 
                type="text" 
                placeholder="Contract Addr or Sym..." 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-base-900 border border-primary-500/20 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors"
               />
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
               <button type="submit" className="hidden">Search</button>
            </form>
            
            {query && (
              <button 
                onClick={clearSearch}
                className="px-3 py-2 text-sm bg-base-800 hover:bg-base-700 rounded-lg border border-white/5 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            )}

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg border transition-colors shrink-0 flex items-center gap-2 ${showFilters ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' : 'bg-base-800 border-white/5 text-gray-400 hover:bg-base-700 hover:text-white'}`}
            >
              <Filter size={18} />
              <span className="text-sm hidden sm:inline">Advanced</span>
            </button>

            <button 
              onClick={() => mutate()} 
               className={`p-2 rounded-lg bg-base-800 border border-white/5 hover:bg-base-700 hover:text-primary-400 transition-colors shrink-0 ${isValidating ? 'animate-spin text-primary-500' : 'text-gray-400'}`}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Filters Panel Component */}
        {showFilters && (
          <div className="p-4 bg-base-900/50 border-b border-primary-500/10 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2 duration-200">
            {/* Liquidity Range */}
            <div className="space-y-2">
               <label className="text-xs text-gray-400 font-medium">Liquidity ($)</label>
               <div className="flex items-center gap-2">
                 <input 
                   type="number" 
                   placeholder="Min Liq" 
                   value={filters.minLiq}
                   onChange={e => setFilters(f => ({...f, minLiq: e.target.value}))}
                   className="w-full bg-base-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-primary-500 outline-none"
                 />
                 <span className="text-gray-500">-</span>
                 <input 
                   type="number" 
                   placeholder="Max Liq" 
                   value={filters.maxLiq}
                   onChange={e => setFilters(f => ({...f, maxLiq: e.target.value}))}
                   className="w-full bg-base-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-primary-500 outline-none"
                 />
               </div>
            </div>

            {/* MCap Range */}
            <div className="space-y-2">
               <label className="text-xs text-gray-400 font-medium">Market Cap ($)</label>
               <div className="flex items-center gap-2">
                 <input 
                   type="number" 
                   placeholder="Min MCap" 
                   value={filters.minMcap}
                   onChange={e => setFilters(f => ({...f, minMcap: e.target.value}))}
                   className="w-full bg-base-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-primary-500 outline-none"
                 />
                 <span className="text-gray-500">-</span>
                 <input 
                   type="number" 
                   placeholder="Max MCap" 
                   value={filters.maxMcap}
                   onChange={e => setFilters(f => ({...f, maxMcap: e.target.value}))}
                   className="w-full bg-base-800 border border-white/10 rounded-lg px-3 py-1.5 text-sm focus:border-primary-500 outline-none"
                 />
               </div>
            </div>

            {/* Risk Selection & Reset */}
            <div className="space-y-2 flex flex-col justify-between">
               <label className="text-xs text-gray-400 font-medium">Risk Tolerated</label>
               <div className="flex items-center gap-2">
                 <button onClick={() => toggleRisk('GREEN')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filters.risks.GREEN ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-base-800 text-gray-500 border-white/5'}`}>🟢 Faible</button>
                 <button onClick={() => toggleRisk('YELLOW')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filters.risks.YELLOW ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-base-800 text-gray-500 border-white/5'}`}>🟡 Moyen</button>
                 <button onClick={() => toggleRisk('RED')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filters.risks.RED ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-base-800 text-gray-500 border-white/5'}`}>🔴 Élevé</button>
               </div>
               
               <div className="flex justify-end mt-2">
                 <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
                   <X size={12}/> Réinitialiser Filtres
                 </button>
               </div>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="p-12 flex flex-col justify-center items-center text-primary-500 gap-4 mt-12">
              <Loader2 className="animate-spin" size={32} />
              <div className="text-sm font-medium animate-pulse text-gray-400">Fetching {query ? 'search results' : 'latest pairs'}...</div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-gray-500 bg-base-900/40 border-b border-white/5 select-none">
                  <th className="p-4 font-semibold">Token</th>
                  <th 
                    className="p-4 font-semibold cursor-pointer hover:bg-base-800/50 transition-colors group"
                    onClick={() => handleSort('liquidityUsd')}
                  >
                    <div className="flex items-center gap-1.5">Liquidity {renderSortIcon('liquidityUsd')}</div>
                  </th>
                  <th 
                    className="p-4 font-semibold cursor-pointer hover:bg-base-800/50 transition-colors group"
                    onClick={() => handleSort('fdv')}
                  >
                    <div className="flex items-center gap-1.5">Market Cap {renderSortIcon('fdv')}</div>
                  </th>
                  <th 
                    className="p-4 font-semibold cursor-pointer hover:bg-base-800/50 transition-colors group"
                    onClick={() => handleSort('ageMinutes')}
                  >
                    <div className="flex items-center gap-1.5">Age {renderSortIcon('ageMinutes')}</div>
                  </th>
                  <th className="p-4 font-semibold">Risk Level</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedTokens.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="p-16 text-center text-gray-500 font-medium">
                       {query ? 'No pairs found for this search.' : 'Aucun token récent trouvé avec ces filtres actifs.'}
                     </td>
                   </tr>
                ) : (
                  filteredAndSortedTokens.map((token: any, index: number) => (
                    <TokenRow 
                       key={`${token.address}-${token.ageMinutes}-${index}`}
                       token={token} 
                       onSnipe={() => setSnipeToken(token)} 
                    />
                  ))
                )}
              </tbody>
            </table>
          )}
          
          {!isLoading && !query && rawTokens.length > 0 && (
            <div ref={observerTarget} className="p-6 flex justify-center items-center text-primary-500/50">
              {isValidating ? <Loader2 className="animate-spin" size={20} /> : <span className="text-xs font-mono">Scroll for more...</span>}
            </div>
          )}
        </div>
      </div>

      {snipeToken && (
        <SnipeModal token={snipeToken} onClose={() => setSnipeToken(null)} />
      )}
    </>
  );
}
