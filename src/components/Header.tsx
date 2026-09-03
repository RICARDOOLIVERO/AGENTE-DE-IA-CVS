import React from 'react';
import { Bot, Sparkles, FileSearch, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  hasResults?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, hasResults }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
                TalentAI
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 font-medium border border-indigo-500/30">
                  Headhunter Pro
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Analizador de CV & Recomendador Inteligente de Puestos en Informática e IA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Motor Gemini 3.8 Flash Activo
          </div>

          {hasResults && onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <FileSearch className="w-3.5 h-3.5" />
              Analizar otro CV
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
