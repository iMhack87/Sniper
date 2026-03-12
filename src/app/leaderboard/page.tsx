"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Crosshair, TrendingUp, Medal, Activity } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface UserData {
  walletAddress: string;
  totalVolume: number;
  score: number;
  joinedAt: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) setLeaderboard(data.leaderboard);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatAddress = (addr: string) => `${addr.substring(0,6)}...${addr.substring(38)}`;

  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none -z-10" />
      
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/20 group-hover:scale-105 transition-transform">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Hall of Fame
                </h1>
                <div className="text-sm text-indigo-400 font-medium tracking-wide">TOP SNIPERS</div>
              </div>
            </Link>
            
            <div className="h-8 w-px bg-white/10 hidden md:block"></div>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-gray-400 hover:text-primary-400 transition-colors">Explorer</Link>
              <Link href="/leaderboard" className="text-sm font-medium text-white transition-colors">Leaderboard 🏆</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
             <ConnectButton />
          </div>
        </header>

        {/* Podium Area */}
        <div className="pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-8 h-64">
            {/* Rank 2 */}
            {leaderboard[1] && (
              <div className="flex flex-col items-center w-full md:w-48 animate-in fade-in slide-in-from-bottom flex-shrink-0">
                <div className="bg-gray-400/20 text-gray-300 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-gray-400/30 flex items-center gap-1">
                  <Medal size={14} /> 2nd Place
                </div>
                <div className="h-28 w-full bg-gradient-to-t from-gray-500/20 to-gray-500/5 border-t-2 border-l-2 border-r-2 border-gray-500/30 rounded-t-xl flex flex-col items-center justify-start p-4 backdrop-blur-sm">
                  <div className="font-mono font-bold text-lg text-white truncate w-full text-center">{formatAddress(leaderboard[1].walletAddress)}</div>
                  <div className="text-gray-400 text-sm mt-1">{leaderboard[1].score} Snipes</div>
                  <div className="text-indigo-300 text-xs font-semibold mt-auto">{leaderboard[1].totalVolume.toFixed(2)} Vol</div>
                </div>
              </div>
            )}

            {/* Rank 1 */}
            {leaderboard[0] && (
              <div className="flex flex-col items-center w-full md:w-56 animate-in fade-in slide-in-from-bottom flex-shrink-0 z-10" style={{ animationDelay: '100ms' }}>
                <div className="bg-yellow-500/20 text-yellow-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 border border-yellow-500/30 flex items-center gap-1 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                  <Trophy size={16} /> 1st Place
                </div>
                <div className="h-40 w-full bg-gradient-to-t from-yellow-500/20 to-yellow-500/5 border-t-2 border-l-2 border-r-2 border-yellow-500/30 rounded-t-xl flex flex-col items-center justify-start p-5 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay"></div>
                  <div className="font-mono font-bold text-xl text-white truncate w-full text-center">{formatAddress(leaderboard[0].walletAddress)}</div>
                  <div className="text-yellow-100 text-sm mt-2">{leaderboard[0].score} Snipes</div>
                  <div className="text-yellow-400 text-sm font-bold mt-auto pb-2">{leaderboard[0].totalVolume.toFixed(2)} Volume</div>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {leaderboard[2] && (
              <div className="flex flex-col items-center w-full md:w-48 animate-in fade-in slide-in-from-bottom flex-shrink-0" style={{ animationDelay: '200ms' }}>
                <div className="bg-amber-700/20 text-amber-500 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-amber-700/30 flex items-center gap-1">
                  <Medal size={14} /> 3rd Place
                </div>
                <div className="h-24 w-full bg-gradient-to-t from-amber-700/20 to-amber-700/5 border-t-2 border-l-2 border-r-2 border-amber-700/30 rounded-t-xl flex flex-col items-center justify-start p-4 backdrop-blur-sm">
                  <div className="font-mono font-bold text-lg text-white truncate w-full text-center">{formatAddress(leaderboard[2].walletAddress)}</div>
                  <div className="text-gray-400 text-sm mt-1">{leaderboard[2].score} Snipes</div>
                  <div className="text-indigo-300 text-xs font-semibold mt-auto">{leaderboard[2].totalVolume.toFixed(2)} Vol</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Table */}
        <div className="glass shadow-xl rounded-2xl overflow-hidden animate-in fade-in duration-500 border border-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-base-800/80 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  <th className="p-4 py-4 w-16 text-center">Rank</th>
                  <th className="p-4 py-4">Wallet Address</th>
                  <th className="p-4 py-4 text-right">Successful Snipes</th>
                  <th className="p-4 py-4 text-right">Total Volume</th>
                  <th className="p-4 py-4 text-right pr-6">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Activity className="animate-spin text-indigo-500" size={24} />
                        Chargement des légendes...
                      </div>
                    </td>
                  </tr>
                ) : leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                      Aucun snipe enregistré pour le moment. Soyez le premier !
                    </td>
                  </tr>
                ) : (
                  leaderboard.slice(3).map((user, index) => (
                    <tr key={user.walletAddress} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 py-4 text-center text-gray-500 font-mono text-sm">#{index + 4}</td>
                      <td className="p-4 py-4 flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-base-800 border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                           {user.walletAddress.substring(2,4)}
                        </div>
                        <span className="font-mono text-gray-200 group-hover:text-white transition-colors">{user.walletAddress}</span>
                      </td>
                      <td className="p-4 py-4 text-right font-medium text-indigo-200">{user.score}</td>
                      <td className="p-4 py-4 text-right font-bold text-white">{user.totalVolume.toFixed(3)}</td>
                      <td className="p-4 py-4 text-right pr-6 text-sm text-gray-500">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
