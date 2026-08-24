import React, { useState } from 'react';
import {
  Link2,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  QrCode,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { ParsedYouTubeUrl } from '../utils/youtube';

interface ChannelInputProps {
  rawUrl: string;
  onChangeUrl: (val: string) => void;
  parsedUrl: ParsedYouTubeUrl;
  addSubscribeParam: boolean;
  onToggleSubscribeParam: (enabled: boolean) => void;
  onGenerate: () => void;
}

const EXAMPLE_HANDLES = [
  { label: '@Podpah', url: 'https://www.youtube.com/@podpah' },
  { label: '@MrBeast', url: 'https://www.youtube.com/@MrBeast' },
  { label: '@AluraOnline', url: 'https://www.youtube.com/@Alura' },
  { label: '@FlowPodcast', url: 'https://www.youtube.com/@flowpodcast' },
];

export const ChannelInput: React.FC<ChannelInputProps> = ({
  rawUrl,
  onChangeUrl,
  parsedUrl,
  addSubscribeParam,
  onToggleSubscribeParam,
  onGenerate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!parsedUrl.formattedUrl) return;
    try {
      await navigator.clipboard.writeText(parsedUrl.subscribeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleTest = () => {
    if (!parsedUrl.subscribeUrl) return;
    window.open(parsedUrl.subscribeUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SEU CANAL
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Cole o link do canal para gerar o QR Code
            </p>
          </div>
        </div>

        {parsedUrl.isValid && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Canal Identificado
          </span>
        )}
      </div>

      {/* Main input */}
      <div className="space-y-2">
        <label
          htmlFor="youtube-url-input"
          className="block text-xs font-bold uppercase tracking-wider text-slate-400"
        >
          Link ou @arroba do Canal
        </label>
        <div className="relative">
          <input
            id="youtube-url-input"
            type="text"
            value={rawUrl}
            onChange={(e) => onChangeUrl(e.target.value)}
            placeholder="https://www.youtube.com/@seucanal"
            className={`w-full bg-slate-50 text-slate-900 text-sm font-medium rounded-xl px-4 py-3.5 border transition-all focus:outline-none focus:ring-2 ${
              parsedUrl.isValid
                ? 'border-slate-300 focus:border-red-500 focus:ring-red-500/20'
                : rawUrl.trim()
                ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/20'
                : 'border-slate-200 focus:border-red-500 focus:ring-red-500/20'
            }`}
          />
          {rawUrl && (
            <button
              onClick={() => onChangeUrl('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-200 transition-colors"
              title="Limpar campo"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Exemplos:</span>
        {EXAMPLE_HANDLES.map((item) => (
          <button
            key={item.label}
            onClick={() => onChangeUrl(item.url)}
            className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Warnings & Validation Feedback */}
      {parsedUrl.warningMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span className="font-medium">{parsedUrl.warningMessage}</span>
        </div>
      )}

      {parsedUrl.errorMessage && rawUrl.trim().length > 0 && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span className="font-medium">{parsedUrl.errorMessage}</span>
        </div>
      )}

      {/* Subscription parameter toggle */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            id="checkbox-sub-param"
            type="checkbox"
            checked={addSubscribeParam}
            onChange={(e) => onToggleSubscribeParam(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 bg-white text-red-600 focus:ring-red-500 accent-red-600"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-800">
              Solicitar confirmação de inscrição (?sub_confirmation=1)
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
              Ao abrir no navegador web desktop, exibe o diálogo nativo do YouTube convidando o visitante a se inscrever.
            </p>
          </div>
        </label>
      </div>

      {/* Main Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        <button
          id="btn-generate-qr"
          onClick={onGenerate}
          className="sm:col-span-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-lg shadow-slate-200 active:scale-95 transition-all"
        >
          <QrCode className="w-4 h-4" />
          <span>GERAR QR CODE</span>
        </button>

        <button
          id="btn-test-qr"
          onClick={handleTest}
          disabled={!parsedUrl.isValid}
          className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
          title="Abre a URL em nova aba para confirmar o funcionamento"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>TESTAR QR CODE</span>
        </button>

        <button
          id="btn-copy-link"
          onClick={handleCopy}
          disabled={!parsedUrl.isValid}
          className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Link copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>COPIAR LINK</span>
            </>
          )}
        </button>
      </div>

      {/* Destination URL Indicator */}
      {parsedUrl.isValid && (
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Destino:</span>
            <span className="text-slate-800 font-mono font-medium truncate max-w-[240px] sm:max-w-md">
              {parsedUrl.subscribeUrl}
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
            {parsedUrl.channelName}
          </span>
        </div>
      )}
    </div>
  );
};
