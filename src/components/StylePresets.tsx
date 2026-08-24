import React from 'react';
import {
  Sparkles,
  Layers,
  Moon,
  Sun,
  Video,
  Check,
  Zap,
  ArrowDownRight,
  ArrowDownLeft,
} from 'lucide-react';
import { QRStylePreset } from '../types';

interface StylePresetsProps {
  currentPreset: QRStylePreset;
  isTransparentBg: boolean;
  onSelectPreset: (presetKey: string) => void;
  onApplyCapCut: (corner: 'bottom_right' | 'bottom_left') => void;
}

interface PresetCardInfo {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
  previewBg: string;
  previewQr: string;
  isTrans?: boolean;
}

const PRESETS: PresetCardInfo[] = [
  {
    id: 'premium',
    name: '1. Premium',
    badge: 'Elegante',
    description: 'Cartão branco limpo, QR preto, sombra suave e detalhes finos.',
    icon: <Sun className="w-4 h-4 text-amber-500" />,
    previewBg: 'bg-white',
    previewQr: 'bg-zinc-950',
  },
  {
    id: 'dark_premium',
    name: '2. Dark Premium',
    badge: 'Moderno',
    description: 'Fundo grafite escuro, QR branco e acabamento cinematográfico.',
    icon: <Moon className="w-4 h-4 text-indigo-400" />,
    previewBg: 'bg-zinc-900',
    previewQr: 'bg-white',
  },
  {
    id: 'youtube',
    name: '3. YouTube Brand',
    badge: 'Oficial',
    description: 'Paleta inspirada no YouTube com alto contraste e bordas vermelhas.',
    icon: <Zap className="w-4 h-4 text-red-500" />,
    previewBg: 'bg-zinc-100 border-red-500',
    previewQr: 'bg-zinc-950',
  },
  {
    id: 'transparent',
    name: '4. Transparente',
    badge: 'Para Vídeo',
    description: 'Fundo com canal Alpha 100% transparente. Perfeito para o CapCut.',
    icon: <Layers className="w-4 h-4 text-emerald-400" />,
    previewBg: 'bg-checkerboard-light',
    previewQr: 'bg-zinc-950',
    isTrans: true,
  },
  {
    id: 'minimalist',
    name: '5. Minimalista',
    badge: 'Essencial',
    description: 'Apenas o QR Code nítido e a chamada direta. Sem distrações.',
    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    previewBg: 'bg-zinc-200',
    previewQr: 'bg-zinc-950',
  },
];

export const StylePresets: React.FC<StylePresetsProps> = ({
  currentPreset,
  isTransparentBg,
  onSelectPreset,
  onApplyCapCut,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              ESTILO DA ARTE
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Escolha um design pré-configurado ou personalize
            </p>
          </div>
        </div>
      </div>

      {/* 5 Preset cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {PRESETS.map((p) => {
          const isActive = currentPreset === p.id && (!p.isTrans || isTransparentBg);
          return (
            <button
              key={p.id}
              id={`preset-card-${p.id}`}
              onClick={() => onSelectPreset(p.id)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all relative group ${
                isActive
                  ? 'border-2 border-red-600 bg-red-50/80 shadow-xs'
                  : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {/* Mini visual mockup badge */}
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center p-1 border border-slate-200 shadow-xs ${p.previewBg}`}
                >
                  <div className={`w-3.5 h-3.5 rounded-xs ${p.previewQr}`} />
                </div>
                {isActive && (
                  <span className="p-0.5 rounded-full bg-red-600 text-white shadow-xs">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <span className={`text-xs font-bold truncate ${isActive ? 'text-red-700' : 'text-slate-800'}`}>
                {p.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-2 mt-1">
                {p.description}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dedicated CapCut Presets Box */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              PRESETS DEDICADOS PARA CAPCUT & VÍDEOS
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 bg-red-100/70 border border-red-200 px-2.5 py-0.5 rounded-full">
            Fundo Alpha Transparente
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Gera uma composição compacta e de alto contraste em 2000×800px pronta para arrastar para a timeline do CapCut, Premiere ou DaVinci Resolve.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            id="capcut-bottom-right-btn"
            onClick={() => onApplyCapCut('bottom_right')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all active:scale-95"
          >
            <ArrowDownRight className="w-4 h-4 text-red-600" />
            <span>CANTO INFERIOR DIREITO</span>
          </button>

          <button
            id="capcut-bottom-left-btn"
            onClick={() => onApplyCapCut('bottom_left')}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all active:scale-95"
          >
            <ArrowDownLeft className="w-4 h-4 text-red-600" />
            <span>CANTO INFERIOR ESQUERDO</span>
          </button>
        </div>
      </div>
    </div>
  );
};
