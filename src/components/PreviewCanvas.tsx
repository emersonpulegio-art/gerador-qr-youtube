import React, { useRef, useEffect, useState, useTransition } from 'react';
import {
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  MonitorPlay,
  Layers,
  Sparkles,
  Upload,
  Copy,
  Check,
  FileCode,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QRConfig, ExportResolution } from '../types';
import {
  renderQRToCanvas,
  exportHighResPNG,
  generateSVG,
} from '../utils/qrRenderer';
import { checkScannability } from '../utils/contrast';
import { sanitizeFilename } from '../utils/youtube';

interface PreviewCanvasProps {
  config: QRConfig;
  exportResolution: ExportResolution;
  customWidth: number;
  customHeight: number;
  onSaveToHistory: (thumbnailDataUrl: string) => void;
}

type SimulatorBg = 'checkerboard' | 'gaming' | 'vlog' | 'tech' | 'podcast' | 'custom';

const VIDEO_SIMULATOR_BACKGROUNDS: Record<
  SimulatorBg,
  { label: string; url?: string; style?: string }
> = {
  checkerboard: { label: 'Transparente (Alpha)', style: 'bg-checkerboard' },
  gaming: {
    label: 'Vídeo Gameplay',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  },
  vlog: {
    label: 'Vlog / Exterior',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  tech: {
    label: 'Tech / Setup',
    url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  },
  podcast: {
    label: 'Podcast Studio',
    url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
  },
  custom: { label: 'Upload de Frame' },
};

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  config,
  exportResolution,
  customWidth,
  customHeight,
  onSaveToHistory,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const [simulatorBg, setSimulatorBg] = useState<SimulatorBg>('checkerboard');
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  // Compute final export dimensions based on resolution setting & layout
  const getExportDimensions = () => {
    if (exportResolution === '1000') return { width: 1000, height: 1000 };
    if (exportResolution === '2000') return { width: 2000, height: 2000 };
    if (exportResolution === '3000') return { width: 3000, height: 3000 };
    if (exportResolution === 'video_banner') return { width: 2000, height: 800 };
    if (exportResolution === 'custom') {
      return {
        width: Math.max(300, customWidth || 1000),
        height: Math.max(300, customHeight || 1000),
      };
    }
    // Default based on layout
    if (config.layout === 'horizontal_right' || config.layout === 'horizontal_left') {
      return { width: 2000, height: 800 };
    }
    return { width: 2000, height: 2000 };
  };

  const dimensions = getExportDimensions();

  // Scannability check
  const scannability = checkScannability(
    config.qrColor,
    config.hasCardContainer ? config.cardBgColor : config.bgColor,
    config.textColor,
    config.isTransparentBg && !config.hasCardContainer
  );

  // Render preview canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMounted = true;
    startTransition(() => {
      // For preview display, render at standard crisp 1000px base or proportional aspect
      const aspect = dimensions.width / dimensions.height;
      const previewWidth = 1000;
      const previewHeight = Math.round(1000 / aspect);

      renderQRToCanvas(canvas, config, {
        width: previewWidth,
        height: previewHeight,
      }).then(() => {
        if (isMounted) {
          // Trigger thumbnail capture after delay
        }
      });
    });

    return () => {
      isMounted = false;
    };
  }, [config, exportResolution, customWidth, customHeight]);

  // Handle Download PNG
  const handleDownloadPNG = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const channelSlug = sanitizeFilename(config.channelName || 'canal');
      const filename = `qr-youtube-${channelSlug}.png`;

      await exportHighResPNG(config, dimensions.width, dimensions.height, filename);

      // Save to history thumbnail
      if (canvasRef.current) {
        const thumb = canvasRef.current.toDataURL('image/png');
        onSaveToHistory(thumb);
      }

      setExportSuccess(true);
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 },
      });

      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Download SVG
  const handleDownloadSVG = async () => {
    try {
      const svgString = await generateSVG(config, dimensions.width, dimensions.height);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const channelSlug = sanitizeFilename(config.channelName || 'canal');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-youtube-${channelSlug}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      console.error('SVG Export error:', err);
    }
  };

  // Handle Copy Image to Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        // Clipboard Item
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      });
    } catch {
      // Fallback
    }
  };

  // Handle custom background image upload
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCustomBgUrl(event.target.result);
        setSimulatorBg('custom');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col h-full">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-red-600 border border-red-100">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              PRÉVIA EM TEMPO REAL
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {dimensions.width} × {dimensions.height} px
              {config.isTransparentBg ? ' • Canal Alpha Transparente' : ''}
            </p>
          </div>
        </div>

        {/* Readability Pill */}
        <div className="flex items-center gap-2">
          {scannability.isSafe ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Leitura 100% Garantida
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Contraste Baixo
            </span>
          )}
        </div>
      </div>

      {/* Simulator Background Chooser */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="text-slate-500 font-bold flex items-center gap-1.5">
          <MonitorPlay className="w-3.5 h-3.5 text-red-600" />
          Simular Fundo do Vídeo:
        </span>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {(['checkerboard', 'gaming', 'vlog', 'tech', 'podcast'] as SimulatorBg[]).map(
            (bg) => (
              <button
                key={bg}
                onClick={() => setSimulatorBg(bg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  simulatorBg === bg
                    ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                    : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {VIDEO_SIMULATOR_BACKGROUNDS[bg].label}
              </button>
            )
          )}

          {/* Upload user frame */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1 transition-all ${
              simulatorBg === 'custom'
                ? 'border-2 border-red-600 bg-red-50 text-red-700 shadow-xs'
                : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-600'
            }`}
            title="Carregar captura de tela ou frame do seu próprio vídeo"
          >
            <Upload className="w-3 h-3" />
            <span>Meu Vídeo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleCustomBgUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Canvas Display Container (Simulated Stage) */}
      <div className="relative flex-1 min-h-[320px] sm:min-h-[420px] rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-4 sm:p-8 select-none bg-slate-50">
        {/* Background Layer */}
        {simulatorBg === 'checkerboard' && (
          <div className="absolute inset-0 bg-checkerboard" />
        )}
        {simulatorBg !== 'checkerboard' && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `url('${
                simulatorBg === 'custom' && customBgUrl
                  ? customBgUrl
                  : VIDEO_SIMULATOR_BACKGROUNDS[simulatorBg]?.url || ''
              }')`,
            }}
          >
            {/* Cinematic overlay filter */}
            <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
          </div>
        )}

        {/* The Live Rendered Canvas */}
        <div
          className={`relative z-10 max-w-full max-h-full flex items-center justify-center transition-all duration-200 ${
            simulatorBg !== 'checkerboard' && config.layout.startsWith('horizontal')
              ? config.layout === 'horizontal_right'
                ? 'translate-y-12 sm:translate-y-20 translate-x-4 sm:translate-x-12'
                : 'translate-y-12 sm:translate-y-20 -translate-x-4 sm:-translate-x-12'
              : ''
          }`}
        >
          <canvas
            ref={canvasRef}
            id="qr-preview-canvas"
            className="max-h-[340px] sm:max-h-[420px] w-auto h-auto max-w-full rounded-xl object-contain drop-shadow-xl transition-transform"
          />
        </div>

        {/* Video position guide indicator in video mode */}
        {simulatorBg !== 'checkerboard' && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-medium text-white/90 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 pointer-events-none">
            <span>Simulador de Vídeo 16:9 (CapCut / Premiere)</span>
            <span className="font-bold">{config.isTransparentBg ? 'Fundo Transparente Ativo' : 'Com Cartão'}</span>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {/* Main High-Impact Download Button */}
        <button
          id="btn-download-png"
          onClick={handleDownloadPNG}
          disabled={isExporting}
          className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all active:scale-[0.98] ${
            exportSuccess
              ? 'bg-emerald-600 hover:bg-emerald-700 ring-2 ring-emerald-400'
              : isExporting
              ? 'bg-slate-400 cursor-wait'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>GERANDO ARQUIVO EM ALTA RESOLUÇÃO...</span>
            </>
          ) : exportSuccess ? (
            <>
              <Check className="w-5 h-5 text-white" />
              <span>QR CODE PRONTO! DOWNLOAD INICIADO</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>
                BAIXAR PNG ({dimensions.width} × {dimensions.height} px)
              </span>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            </>
          )}
        </button>

        {/* Secondary Pro Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="btn-copy-image"
            onClick={handleCopyImage}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 shadow-xs transition-all active:scale-95"
            title="Copia a imagem para colar no Photoshop, Figma ou CapCut Web"
          >
            {copiedImage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Imagem Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>COPIAR IMAGEM</span>
              </>
            )}
          </button>

          <button
            id="btn-download-svg"
            onClick={handleDownloadSVG}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 shadow-xs transition-all active:scale-95"
            title="Baixar em formato vetorial SVG infinito"
          >
            <FileCode className="w-3.5 h-3.5 text-slate-500" />
            <span>BAIXAR VETOR SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
