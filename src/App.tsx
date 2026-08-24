/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChannelInput } from './components/ChannelInput';
import { StylePresets } from './components/StylePresets';
import { CustomizationPanel } from './components/CustomizationPanel';
import { PreviewCanvas } from './components/PreviewCanvas';
import { HistoryDrawer } from './components/HistoryDrawer';
import { GuideModal } from './components/GuideModal';
import { QRConfig, ExportResolution, HistoryItem } from './types';
import { DEFAULT_CONFIG, STYLE_PRESETS } from './utils/presets';
import { parseYouTubeUrl } from './utils/youtube';
import { ShieldCheck, Video, Sparkles, Heart } from 'lucide-react';

const STORAGE_KEY_CONFIG = 'qr_yt_current_config';
const STORAGE_KEY_HISTORY = 'qr_yt_history_items';

export default function App() {
  // Application State
  const [config, setConfig] = useState<QRConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CONFIG;
  });

  const [exportResolution, setExportResolution] = useState<ExportResolution>('2000');
  const [customWidth, setCustomWidth] = useState<number>(2000);
  const [customHeight, setCustomHeight] = useState<number>(2000);

  // History & Modal States
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Parsed URL state
  const parsedUrl = parseYouTubeUrl(config.rawUrl, config.addSubscribeParam);

  // Keep target URL in sync when rawUrl or addSubscribeParam changes
  useEffect(() => {
    if (parsedUrl.isValid) {
      setConfig((prev) => ({
        ...prev,
        targetUrl: parsedUrl.subscribeUrl,
        channelName: parsedUrl.channelName,
        subMessage: prev.subMessage === 'youtube.com/@seucanal' ? parsedUrl.formattedUrl.replace('https://www.', '') : prev.subMessage,
      }));
    }
  }, [config.rawUrl, config.addSubscribeParam]);

  // Persist current config locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // Ignore
    }
  }, [config]);

  // Persist history items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(historyItems));
    } catch {
      // Ignore
    }
  }, [historyItems]);

  // Handlers
  const handleUrlChange = (newUrl: string) => {
    const parsed = parseYouTubeUrl(newUrl, config.addSubscribeParam);
    setConfig((prev) => ({
      ...prev,
      rawUrl: newUrl,
      targetUrl: parsed.isValid ? parsed.subscribeUrl : newUrl,
      channelName: parsed.channelName || prev.channelName,
      subMessage: parsed.isValid ? parsed.formattedUrl.replace('https://www.', '') : prev.subMessage,
    }));
  };

  const handleToggleSubscribeParam = (enabled: boolean) => {
    const parsed = parseYouTubeUrl(config.rawUrl, enabled);
    setConfig((prev) => ({
      ...prev,
      addSubscribeParam: enabled,
      targetUrl: parsed.isValid ? parsed.subscribeUrl : prev.targetUrl,
    }));
  };

  const handleSelectPreset = (presetKey: string) => {
    const presetOverrides = STYLE_PRESETS[presetKey];
    if (presetOverrides) {
      setConfig((prev) => ({
        ...prev,
        ...presetOverrides,
      }));
    }
  };

  const handleApplyCapCut = (corner: 'bottom_right' | 'bottom_left') => {
    const isRight = corner === 'bottom_right';
    const presetOverrides = isRight ? STYLE_PRESETS.capcut_right : STYLE_PRESETS.capcut_left;
    setConfig((prev) => ({
      ...prev,
      ...presetOverrides,
      isTransparentBg: true,
      hasCardContainer: true,
    }));
    setExportResolution('video_banner');
  };

  const handleSaveToHistory = (thumbnailDataUrl: string) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
      channelName: config.channelName || 'Canal do YouTube',
      rawUrl: config.rawUrl,
      targetUrl: config.targetUrl,
      message: config.message === 'PERSONALIZADA' ? config.customMessage : config.message,
      thumbnailDataUrl,
      config,
    };

    setHistoryItems((prev) => [newItem, ...prev.slice(0, 19)]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
  };

  const handleLoadHistoryItem = (savedConfig: QRConfig) => {
    setConfig(savedConfig);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onApplyCapCutPreset={handleApplyCapCut}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workspace Layout: 2 Columns on Desktop (md:grid-cols-12) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Creator Controls & Settings (lg:col-span-7) */}
          <section className="lg:col-span-7 space-y-6">
            {/* 1. Canal Input */}
            <ChannelInput
              rawUrl={config.rawUrl}
              onChangeUrl={handleUrlChange}
              parsedUrl={parsedUrl}
              addSubscribeParam={config.addSubscribeParam}
              onToggleSubscribeParam={handleToggleSubscribeParam}
              onGenerate={() => {}}
            />

            {/* 2. Professional Style Presets */}
            <StylePresets
              currentPreset={config.preset}
              isTransparentBg={config.isTransparentBg}
              onSelectPreset={handleSelectPreset}
              onApplyCapCut={handleApplyCapCut}
            />

            {/* 3. Advanced Customization Panel */}
            <CustomizationPanel
              config={config}
              onChangeConfig={(updates) => setConfig((prev) => ({ ...prev, ...updates }))}
              exportResolution={exportResolution}
              onChangeExportResolution={setExportResolution}
              customWidth={customWidth}
              customHeight={customHeight}
              onChangeCustomDimensions={(w, h) => {
                setCustomWidth(w);
                setCustomHeight(h);
              }}
            />
          </section>

          {/* Right Column: Sticky Live Preview & High-Res Export (lg:col-span-5) */}
          <section className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            <PreviewCanvas
              config={config}
              exportResolution={exportResolution}
              customWidth={customWidth}
              customHeight={customHeight}
              onSaveToHistory={handleSaveToHistory}
            />

            {/* Quick helper card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3 text-xs text-slate-600">
              <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100 shrink-0 mt-0.5">
                <Video className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block">
                  Dica Pro para o CapCut
                </span>
                <p className="leading-relaxed text-[11px] text-slate-500 font-medium">
                  Exporte com <strong className="text-slate-700 font-bold">Fundo Transparente</strong> e importe como camada no CapCut. O arquivo PNG de alta resolução mantém a nitidez perfeita mesmo quando reduzido no canto do vídeo.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">QR YOUTUBE</span>
            <span>•</span>
            <span className="text-slate-500">Seu canal. Um QR Code. Mais inscritos.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Compatível com YouTube & CapCut
            </span>
            <span>•</span>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-slate-900 underline underline-offset-2 font-medium"
            >
              Diretrizes de Inscrição
            </button>
          </div>
        </div>
      </footer>

      {/* Modals and Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={historyItems}
        onLoadItem={handleLoadHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
