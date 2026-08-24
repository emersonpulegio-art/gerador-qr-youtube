import { ContrastStatus } from '../types';

/**
 * Calculates relative luminance for a given hex or rgb color
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 4.5; // fallback safe

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function checkScannability(
  qrColor: string,
  bgColor: string,
  textColor: string,
  isTransparent: boolean
): ContrastStatus {
  // If background is transparent, we assume it's placed over diverse video backgrounds
  // We check if QR code is at least high contrast against either pure black or pure white
  const effectiveBg = isTransparent ? '#000000' : bgColor;
  const qrBgContrast = isTransparent ? 7.0 : calculateContrastRatio(qrColor, effectiveBg);
  const textBgContrast = isTransparent ? 7.0 : calculateContrastRatio(textColor, effectiveBg);

  let isSafe = true;
  let warningMessage: string | undefined;

  if (!isTransparent && qrBgContrast < 3.0) {
    isSafe = false;
    warningMessage =
      'O contraste entre o QR Code e o fundo está muito baixo (< 3:1). Celulares podem ter dificuldade para escanear. Escolha cores mais contrastantes.';
  } else if (!isTransparent && qrBgContrast < 4.5) {
    isSafe = true;
    warningMessage =
      'Contraste moderado. Para máxima velocidade de leitura em vídeos em movimento, prefira preto sobre branco ou branco sobre preto.';
  }

  return {
    ratio: Number(qrBgContrast.toFixed(2)),
    isSafe,
    warningMessage,
    qrBgContrast: Number(qrBgContrast.toFixed(2)),
    textBgContrast: Number(textBgContrast.toFixed(2)),
  };
}
