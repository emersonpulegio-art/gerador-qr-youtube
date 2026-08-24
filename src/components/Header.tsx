import React from 'react';
import { Youtube, Sparkles, History, HelpCircle, Video } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onApplyCapCutPreset: (corner: 'bottom_right' | 'bottom_left') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenGuide,
  onApplyCapCutPreset,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-200 text-white">
            <Youtube className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-800 font-display">
                QR YOUTUBE
              </h1>
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-100">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Seu canal. Um QR Code. Mais inscritos.
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto justify-end">
          <button
            id="header-preset-capcut-btn"
            onClick={() => onApplyCapCutPreset('bottom_right')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold border border-red-200 shadow-xs transition-all active:scale-95"
            title="Aplica configuração transparente otimizada para cantos de vídeo"
          >
            <Video className="w-3.5 h-3.5 text-red-600" />
            <span>Preset CapCut</span>
            <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
          </button>

          <button
            id="header-history-btn"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors active:scale-95"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>Meus QR Codes</span>
          </button>

          <button
            id="header-guide-btn"
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Como Funciona</span>
          </button>
        </div>
      </div>
    </header>
  );
};
