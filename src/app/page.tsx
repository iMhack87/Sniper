import TokenTable from '@/components/TokenTable';
import { Crosshair, Trophy } from 'lucide-react';
import CustomConnectButton from '@/components/CustomConnectButton';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-900/20 to-transparent pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="flex items-center justify-between w-full md:w-auto">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg shadow-primary-500/20 border border-primary-400/20 group-hover:scale-105 transition-transform">
                  <Crosshair className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 leading-tight">
                    Base Sniper
                  </h1>
                  <div className="text-[10px] md:text-sm text-primary-400 font-medium tracking-wide">BASE NETWORK EDITION</div>
                </div>
              </Link>

              {/* Mobile Connect Wallet */}
              <div className="md:hidden">
                 <CustomConnectButton textClassName="hidden" />
              </div>
            </div>
            
            {/* Nav separator */}
            <div className="h-8 w-px bg-white/10 hidden md:block"></div>
            
            {/* Navbar */}
            <nav className="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
              <Link href="/" className="text-sm font-medium text-white hover:text-primary-400 transition-colors whitespace-nowrap">Explorer</Link>
              <Link href="/leaderboard" className="text-sm font-medium text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1 whitespace-nowrap">Leaderboard <Trophy size={14} /></Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
             <CustomConnectButton />
          </div>
        </header>

        {/* How it works Section */}
        <div className="glass shadow-lg rounded-2xl p-6 border border-white/5 relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-primary-400">⚡</span> Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-200">1. Détection Active</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Notre algorithme scanne la blockchain Base en temps réel pour détecter les nouveaux tokens prometteurs avant tout le monde.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-200">2. Analyse de Sécurité</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Chaque contrat est audité automatiquement (Honeypot, Taxes, Liquidité) avec GoPlus Labs pour vous protéger des arnaques.
              </p>
            </div>
            <div className="space-y-2 relative">
              <div className="absolute -left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/0 via-primary-500/50 to-primary-500/0 hidden md:block"></div>
              <h3 className="text-sm font-semibold text-primary-300">3. Achat 100% Décentralisé</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong>Purement Non-Custodial.</strong> L'application n'a jamais accès à vos fonds ni à vos clés. Vous signez vos Snipes directement via votre propre Web3 Wallet.
              </p>
            </div>
          </div>
        </div>

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

      {/* Discreet Footer */}
      <footer className="mt-20 pb-6 text-center animate-in fade-in duration-1000">
        <p className="text-xs text-gray-500 font-mono flex items-center justify-center gap-1 opacity-70 hover:opacity-100 transition-opacity">
          Developed with <span className="text-red-500/80">♥</span> by <a href="https://www.zefcomputers.com" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-400 hover:text-white transition-colors">ZEF Computers</a>
        </p>
      </footer>
    </main>
  );
}
