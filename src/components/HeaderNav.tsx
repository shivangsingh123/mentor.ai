import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Key, ShieldAlert } from 'lucide-react';

interface HeaderNavProps {
  customKey: string;
  onKeyChange: (newKey: string) => void;
}

export default function HeaderNav({ customKey, onKeyChange }: HeaderNavProps) {
  const [showKeyField, setShowKeyField] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Left: Brand logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <Terminal className="h-5.5 w-5.5 text-white" />
            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-sans text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                MENTOR<span className="text-indigo-400">.AI</span>
              </span>
              <span className="rounded bg-indigo-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Elite AI Coding Consultant</p>
          </div>
        </div>

        {/* Right: Key Config and Environment badges */}
        <div className="flex items-center space-x-3">
          {/* Key configuration toggle */}
          <div className="relative flex items-center space-x-2">
            {showKeyField ? (
              <div className="flex items-center space-x-1.5 rounded-lg bg-slate-900 border border-white/10 px-2.5 py-1">
                <Key className="h-3.5 w-3.5 text-slate-400" />
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => onKeyChange(e.target.value)}
                  placeholder="Paste your Gemini key..."
                  className="w-44 bg-transparent font-mono text-[11px] text-white outline-none placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKeyField(false)}
                  className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 ml-1.5"
                >
                  Hide
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowKeyField(true)}
                className="flex items-center space-x-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition px-3 py-1.5 text-xs text-slate-300"
              >
                <Key className="h-3.5 w-3.5 text-indigo-400" />
                <span>
                  {customKey ? 'Custom Key Active' : 'Configure Personal Key'}
                </span>
              </button>
            )}

            {/* Sandbox notification info */}
            {!customKey && (
              <div className="hidden md:flex items-center space-x-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-xs text-indigo-300">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                <span>AI Studio Sandbox Key Active</span>
              </div>
            )}
          </div>

          {/* Connected state beacon */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-medium text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            <span>GEMINI-3.5-FLASH ACTIVE</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
