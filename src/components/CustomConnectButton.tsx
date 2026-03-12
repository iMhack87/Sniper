"use client";

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function CustomConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isConnected && address) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-base-800 hover:bg-base-700 border border-white/10 px-4 py-2 rounded-xl transition-colors font-mono text-sm shadow-sm"
        >
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          {address.slice(0, 6)}...{address.slice(-4)}
          <ChevronDown size={14} className="text-gray-400" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-base-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors font-medium border-t border-white/5"
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-lg shadow-primary-500/20 active:scale-95"
      >
        <Wallet size={16} />
        Connect Wallet
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-base-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Sélectionnez un Wallet
          </div>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => {
                connect({ connector });
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-3 text-sm text-gray-200 hover:text-white hover:bg-white/5 rounded-lg flex items-center justify-between transition-colors font-medium group"
            >
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform opacity-0 group-hover:opacity-100"></div>
                {connector.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
