export type QRStylePreset = 'premium' | 'dark_premium' | 'youtube' | 'transparent' | 'minimalist' | 'capcut_custom';

export type LayoutOrientation = 'square' | 'horizontal_right' | 'horizontal_left' | 'compact_badge';

export type ExportResolution = '1000' | '2000' | '3000' | 'video_banner' | 'custom';

export interface QRConfig {
  // Target
  rawUrl: string;
  targetUrl: string;
  channelName: string;
  addSubscribeParam: boolean;

  // Visual text
  message: string;
  customMessage: string;
  subMessage: string; // e.g., channel handle or secondary call to action
  showSubMessage: boolean;
  textSize: number; // 14 to 48 (relative scale)
  fontFamily: 'Outfit' | 'Plus Jakarta Sans' | 'Impact' | 'System';
  textWeight: 'normal' | 'semibold' | 'bold' | 'black';

  // Preset
  preset: QRStylePreset;
  layout: LayoutOrientation;

  // Colors
  qrColor: string;
  bgColor: string;
  textColor: string;
  subTextColor: string;
  accentColor: string;
  isTransparentBg: boolean;
  cardBgColor: string;
  hasCardContainer: boolean;

  // Dimensions & Sizing
  qrSizeRatio: number; // 30 to 80%
  borderRadius: number; // 0 to 48
  borderWidth: number; // 0 to 12
  borderColor: string;
  padding: number; // 16 to 80
  hasShadow: boolean;
  shadowIntensity: number; // 0 to 100

  // YouTube Logo / Icon
  showYoutubeIcon: boolean;
  iconPosition: 'center_qr' | 'beside_text' | 'header_badge';
  iconStyle: 'classic_red' | 'monochrome' | 'white';

  // Error Correction
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';

  // Video corner preset
  cornerPreset: 'bottom_right' | 'bottom_left' | 'none';
}

export interface HistoryItem {
  id: string;
  createdAt: number;
  channelName: string;
  rawUrl: string;
  targetUrl: string;
  message: string;
  thumbnailDataUrl: string;
  config: QRConfig;
}

export interface ContrastStatus {
  ratio: number;
  isSafe: boolean;
  warningMessage?: string;
  qrBgContrast: number;
  textBgContrast: number;
}
