import TokenTable from '@/components/TokenTable';
import { Crosshair } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-500/20 border border-primary-400/20 group-hover:scale-105 transition-transform">
                <Crosshair className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  Base Sniper
                </h1>
                <div className="text-sm text-primary-400 font-medium tracking-wide">BASE NETWORK EDITION</div>
              </div>
            </Link>
            
            {/* Nav separator */}
            <div className="h-8 w-px bg-white/10 hidden md:block"></div>
            
            {/* Navbar */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/" className="text-sm font-medium text-white hover:text-primary-400 transition-colors">Explorer</Link>
              <Link href="/leaderboard" className="text-sm font-medium text-gray-400 hover:text-primary-400 transition-colors">Leaderboard 🏆</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
             <ConnectButton />
          </div>
        </header>

        {/* Dashboard Stats (Placeholder for future) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all"></div>
            <div className="text-gray-400 text-sm mb-1 font-medium">Network</div>
            <div className="text-xl font-bold flex items-center gap-2">
              Base Chain <span className="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-full border border-primary-500/30">ID: 8453</span>
            </div>
          </div>
          <div className="glass-card p-5 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
            <div className="text-gray-400 text-sm mb-1 font-medium">Scanned Tokens (24h)</div>
            <div className="text-xl font-bold">142</div>
          </div>
          <div className="glass-card p-5 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
            <div className="text-gray-400 text-sm mb-1 font-medium">Auto-Snipe Mode</div>
            <div className="text-xl font-bold text-gray-500 flex items-center gap-2">
              Disabled
            </div>
          </div>
        </div>

        {/* Main Table Area */}
        <TokenTable />

      </div>
    </main>
  );
}
