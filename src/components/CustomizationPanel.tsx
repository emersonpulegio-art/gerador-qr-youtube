import React, { useState } from 'react';
import {
  Sliders,
  Type,
  Palette,
  Layout,
  Youtube,
  Maximize,
  AlertTriangle,
  CheckCircle2,
  Wand2,
  Layers,
  RotateCcw,
  Check,
} from 'lucide-react';
import { QRConfig, ExportResolution } from '../types';
import { PRESET_MESSAGES } from '../utils/presets';
import { checkScannability } from '../utils/contrast';

interface CustomizationPanelProps {
  config: QRConfig;
  onChangeConfig: (updates: Partial<QRConfig>) => void;
  exportResolution: ExportResolution;
  onChangeExportResolution: (res: ExportResolution) => void;
  customWidth: number;
  customHeight: number;
  onChangeCustomDimensions: (w: number, h: number) => void;
  onResetDefault?: () => void;
}

type TabType = 'message' | 'colors' | 'layout' | 'logo' | 'export';

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  config,
  onChangeConfig,
  exportResolution,
  onChangeExportResolution,
  customWidth,
  customHeight,
  onChangeCustomDimensions,
  onResetDefault,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('message');
  const [resetSuccess, setResetSuccess] = useState(false);

  const scannability = checkScannability(
    config.qrColor,
    config.hasCardContainer ? config.cardBgColor : config.bgColor,
    config.textColor,
    config.isTransparentBg && !config.hasCardContainer
  );

  const handleResetClick = () => {
    if (onResetDefault) {
      onResetDefault();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2000);
    }
  };

  const handleAutoFixContrast = () => {
    if (config.isTransparentBg) {
      onChangeConfig({
        qrColor: '#FFFFFF',
        textColor: '#FFFFFF',
        subTextColor: '#D4D4D8',
      });
    } else {
      onChangeConfig({
        qrColor: '#000000',
        bgColor: '#FFFFFF',
        cardBgColor: '#FFFFFF',
        textColor: '#000000',
        subTextColor: '#52525B',
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              PERSONALIZAÇÃO AVANÇADA
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Ajuste cada detalhe visual e de exportação
            </p>
          </div>
        </div>

        {/* Restore Defaults Button */}
        {onResetDefault && (
          <button
            type="button"
            id="btn-restore-defaults"
            onClick={handleResetClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 shadow-2xs self-start sm:self-auto ${
              resetSuccess
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-50 hover:bg-red-50 border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600'
            }`}
            title="Restaura todas as cores, tamanhos, fontes e estilos para a configuração padrão original"
          >
            {resetSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Padrão Restaurado!</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar Padrão</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('message')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'message'
              ? 'border-2 border-red-600 bg-red-50 text-red-600 shadow-xs'
              : 'border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Mensagem</span>
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'colors'
              ? 'border-2 border-red-600 bg-red-50 text-red-600 shadow-xs'
              : 'border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Cores & Fundo</span>
          {!scannability.isSafe && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'layout'
              ? 'border-2 border-red-600 bg-red-50 text-red-600 shadow-xs'
              : 'border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Layout & Bordas</span>
        </button>

        <button
          onClick={() => setActiveTab('logo')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'logo'
              ? 'border-2 border-red-600 bg-red-50 text-red-600 shadow-xs'
              : 'border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Youtube className="w-3.5 h-3.5" />
          <span>Ícone YouTube</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeTab === 'export'
              ? 'border-2 border-red-600 bg-red-50 text-red-600 shadow-xs'
              : 'border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
          }`}
        >
          <Maximize className="w-3.5 h-3.5" />
          <span>Resolução</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="pt-2">
        {/* TAB 1: MENSAGEM */}
        {activeTab === 'message' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Mensagem principal exibida
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_MESSAGES.map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    onClick={() => onChangeConfig({ message: msg })}
                    className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      config.message === msg
                        ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {msg}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    onChangeConfig({
                      message: 'PERSONALIZADA',
                      customMessage: config.customMessage || 'INSCREVA-SE!',
                    })
                  }
                  className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    config.message === 'PERSONALIZADA'
                      ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Mensagem personalizada...
                </button>
              </div>
            </div>

            {config.message === 'PERSONALIZADA' && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Digite seu texto personalizado (máx. 35 caracteres)
                </label>
                <input
                  type="text"
                  maxLength={35}
                  value={config.customMessage}
                  onChange={(e) => onChangeConfig({ customMessage: e.target.value })}
                  placeholder="Ex: SE INSCREVE AÍ!"
                  className="w-full bg-slate-50 text-slate-900 text-xs font-medium rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
              </div>
            )}

            {/* Submessage (channel handle) */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800">
                  Exibir identificador / @arroba do canal
                </span>
                <input
                  type="checkbox"
                  checked={config.showSubMessage}
                  onChange={(e) => onChangeConfig({ showSubMessage: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-red-600 focus:ring-red-500 accent-red-600"
                />
              </label>
              {config.showSubMessage && (
                <input
                  type="text"
                  maxLength={40}
                  value={config.subMessage}
                  onChange={(e) => onChangeConfig({ subMessage: e.target.value })}
                  placeholder="Ex: @seucanal ou youtube.com/@seucanal"
                  className="w-full bg-white text-slate-900 text-xs font-medium rounded-lg px-3 py-2 border border-slate-200 focus:outline-none focus:border-red-500"
                />
              )}
            </div>

            {/* Typography scale slider */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-500">Tamanho da mensagem</span>
                <span className="text-slate-800 font-mono font-bold">{config.textSize}px</span>
              </div>
              <input
                type="range"
                min={14}
                max={36}
                value={config.textSize}
                onChange={(e) => onChangeConfig({ textSize: Number(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: CORES & FUNDO */}
        {activeTab === 'colors' && (
          <div className="space-y-4">
            {/* Scannability Notice */}
            <div
              className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                scannability.isSafe
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {scannability.isSafe ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">
                    {scannability.isSafe
                      ? `Leitura Nítida & Rápida (Contraste ${scannability.ratio}:1)`
                      : 'Aviso de Legibilidade do QR Code'}
                  </span>
                  <p className="text-[11px] font-medium opacity-90 mt-0.5">
                    {scannability.warningMessage ||
                      'As cores selecionadas garantem leitura veloz por qualquer câmera de smartphone.'}
                  </p>
                </div>
              </div>
              {!scannability.isSafe && (
                <button
                  type="button"
                  onClick={handleAutoFixContrast}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-bold shadow-xs hover:bg-amber-700 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Ajustar</span>
                </button>
              )}
            </div>

            {/* Transparent background Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Fundo Transparente (Canal Alpha)
                    </span>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Ideal para sobreposição direta em vídeos no CapCut
                    </p>
                  </div>
                </div>
                <input
                  id="checkbox-transparent-bg"
                  type="checkbox"
                  checked={config.isTransparentBg}
                  onChange={(e) =>
                    onChangeConfig({
                      isTransparentBg: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-slate-300 bg-white text-red-600 focus:ring-red-500 accent-red-600"
                />
              </label>
            </div>

            {/* Color Pickers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* QR Code Color */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cor do QR Code
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.qrColor}
                    onChange={(e) => onChangeConfig({ qrColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={config.qrColor}
                    onChange={(e) => onChangeConfig({ qrColor: e.target.value })}
                    className="w-full bg-white text-slate-800 text-xs font-mono font-medium rounded-lg px-2.5 py-1.5 border border-slate-200"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {['#000000', '#FFFFFF', '#FF0000', '#0F172A'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => onChangeConfig({ qrColor: hex })}
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cor do Texto
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.textColor}
                    onChange={(e) => onChangeConfig({ textColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={config.textColor}
                    onChange={(e) => onChangeConfig({ textColor: e.target.value })}
                    className="w-full bg-white text-slate-800 text-xs font-mono font-medium rounded-lg px-2.5 py-1.5 border border-slate-200"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {['#000000', '#FFFFFF', '#FF0000', '#0F172A'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() => onChangeConfig({ textColor: hex })}
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              {/* Background Color (if not transparent) */}
              <div
                className={`space-y-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 ${
                  config.isTransparentBg ? 'opacity-40 pointer-events-none' : ''
                }`}
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Cor do Fundo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    disabled={config.isTransparentBg}
                    value={config.bgColor.startsWith('#') ? config.bgColor : '#FFFFFF'}
                    onChange={(e) =>
                      onChangeConfig({
                        bgColor: e.target.value,
                        cardBgColor: e.target.value,
                      })
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    disabled={config.isTransparentBg}
                    value={config.bgColor}
                    onChange={(e) =>
                      onChangeConfig({
                        bgColor: e.target.value,
                        cardBgColor: e.target.value,
                      })
                    }
                    className="w-full bg-white text-slate-800 text-xs font-mono font-medium rounded-lg px-2.5 py-1.5 border border-slate-200"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {['#FFFFFF', '#09090B', '#18181B', '#F8FAFC'].map((hex) => (
                    <button
                      key={hex}
                      onClick={() =>
                        onChangeConfig({
                          bgColor: hex,
                          cardBgColor: hex,
                        })
                      }
                      className="w-5 h-5 rounded-full border border-slate-300 shadow-xs"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LAYOUT & BORDAS */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Layout Orientation */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Formato da Composição
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'square', label: 'Quadrado (1:1)', desc: 'Centralizado' },
                  { id: 'horizontal_right', label: 'Banner Direita', desc: 'Canto do Vídeo' },
                  { id: 'horizontal_left', label: 'Banner Esquerda', desc: 'Invertido' },
                  { id: 'compact_badge', label: 'Mini Badge', desc: 'Ultra Compacto' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onChangeConfig({ layout: item.id as any })}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      config.layout === item.id
                        ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold">{item.label}</span>
                    <span className="block text-[10px] text-slate-500 font-medium">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* QR Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-500">Tamanho do QR Code</span>
                  <span className="text-slate-800 font-mono font-bold">{config.qrSizeRatio}%</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={85}
                  value={config.qrSizeRatio}
                  onChange={(e) =>
                    onChangeConfig({ qrSizeRatio: Number(e.target.value) })
                  }
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Corner Radius */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-500">Arredondamento dos Cantos</span>
                  <span className="text-slate-800 font-mono font-bold">{config.borderRadius}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={config.borderRadius}
                  onChange={(e) =>
                    onChangeConfig({ borderRadius: Number(e.target.value) })
                  }
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Border Width */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-500">Espessura da Borda</span>
                  <span className="text-slate-800 font-mono font-bold">{config.borderWidth}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={8}
                  value={config.borderWidth}
                  onChange={(e) =>
                    onChangeConfig({ borderWidth: Number(e.target.value) })
                  }
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>

              {/* Padding */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-500">Margem / Espaçamento</span>
                  <span className="text-slate-800 font-mono font-bold">{config.padding}px</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={64}
                  value={config.padding}
                  onChange={(e) =>
                    onChangeConfig({ padding: Number(e.target.value) })
                  }
                  className="w-full accent-red-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Shadow Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  Sombra Suave (Drop Shadow)
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  Destaca a arte quando sobreposta em vídeos claros
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.hasShadow}
                onChange={(e) => onChangeConfig({ hasShadow: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 bg-white text-red-600 focus:ring-red-500 accent-red-600"
              />
            </div>
          </div>
        )}

        {/* TAB 4: ÍCONE YOUTUBE */}
        {activeTab === 'logo' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">
                  Mostrar Ícone Oficial do YouTube
                </span>
                <p className="text-[11px] text-slate-500 font-medium">
                  Adiciona o botão icônico play para reforçar o destino
                </p>
              </div>
              <input
                type="checkbox"
                checked={config.showYoutubeIcon}
                onChange={(e) => onChangeConfig({ showYoutubeIcon: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 bg-white text-red-600 focus:ring-red-500 accent-red-600"
              />
            </div>

            {config.showYoutubeIcon && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Position */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Posicionamento do Ícone
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'beside_text', label: 'Ao lado da Mensagem (Recomendado)' },
                      { id: 'center_qr', label: 'No Centro do QR Code' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        onClick={() => onChangeConfig({ iconPosition: pos.id as any })}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          config.iconPosition === pos.id
                            ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Estilo Visual do Ícone
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'classic_red', label: 'Vermelho YouTube Clássico' },
                      { id: 'monochrome', label: 'Monocromático (Adapta ao tema)' },
                      { id: 'white', label: 'Branco com Play Vermelho' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => onChangeConfig({ iconStyle: st.id as any })}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          config.iconStyle === st.id
                            ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                            : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: RESOLUÇÃO DE EXPORTAÇÃO */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Dimensões do Arquivo PNG Final
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {[
                  {
                    id: '1000',
                    name: 'Pequeno (1000 × 1000 px)',
                    desc: 'Compacto para posts rápidos e stories',
                  },
                  {
                    id: '2000',
                    name: 'Alto (2000 × 2000 px)',
                    desc: 'Resolução nítida para vídeos 1080p e 4K',
                  },
                  {
                    id: '3000',
                    name: 'Ultra (3000 × 3000 px)',
                    desc: 'Qualidade máxima de impressão e banners',
                  },
                  {
                    id: 'video_banner',
                    name: 'PNG para Vídeo (2000 × 800 px)',
                    desc: 'Otimizado para cantos de vídeo 16:9',
                  },
                  {
                    id: 'custom',
                    name: 'Personalizado',
                    desc: 'Definir largura e altura exatas',
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onChangeExportResolution(opt.id as ExportResolution)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      exportResolution === opt.id
                        ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-800">
                      {opt.name}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {exportResolution === 'custom' && (
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500">
                    Largura (px)
                  </label>
                  <input
                    type="number"
                    min={400}
                    max={6000}
                    value={customWidth}
                    onChange={(e) =>
                      onChangeCustomDimensions(Number(e.target.value), customHeight)
                    }
                    className="w-full bg-white text-slate-800 text-xs font-mono font-medium rounded-lg px-3 py-2 border border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-500">
                    Altura (px)
                  </label>
                  <input
                    type="number"
                    min={300}
                    max={6000}
                    value={customHeight}
                    onChange={(e) =>
                      onChangeCustomDimensions(customWidth, Number(e.target.value))
                    }
                    className="w-full bg-white text-slate-800 text-xs font-mono font-medium rounded-lg px-3 py-2 border border-slate-200"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
