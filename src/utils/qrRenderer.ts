import QRCode from 'qrcode';
import { QRConfig } from '../types';

/**
 * Draws a rounded rectangle path on canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Draws an authentic, sharp YouTube icon badge
 */
export function drawYouTubeIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  style: 'classic_red' | 'monochrome' | 'white' = 'classic_red',
  monochromeColor = '#FFFFFF'
) {
  ctx.save();
  const width = size * 1.42;
  const height = size;
  const cornerRadius = height * 0.28;

  let badgeColor = '#FF0000';
  let triangleColor = '#FFFFFF';

  if (style === 'monochrome') {
    badgeColor = monochromeColor;
    triangleColor = monochromeColor === '#FFFFFF' || monochromeColor === '#ffffff' ? '#000000' : '#FFFFFF';
  } else if (style === 'white') {
    badgeColor = '#FFFFFF';
    triangleColor = '#FF0000';
  }

  // Draw pill/button
  ctx.fillStyle = badgeColor;
  drawRoundedRect(ctx, x - width / 2, y - height / 2, width, height, cornerRadius);
  ctx.fill();

  // Draw Play Triangle
  ctx.fillStyle = triangleColor;
  ctx.beginPath();
  const triWidth = width * 0.35;
  const triHeight = height * 0.45;
  const triLeft = x - triWidth * 0.38;
  const triTop = y - triHeight / 2;
  const triBottom = y + triHeight / 2;
  const triRight = x + triWidth * 0.62;

  ctx.moveTo(triLeft, triTop);
  ctx.lineTo(triRight, y);
  ctx.lineTo(triLeft, triBottom);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export interface RenderDimensions {
  width: number;
  height: number;
}

/**
 * Generates the QR Code matrix and renders the full artwork onto an HTML5 canvas.
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  config: QRConfig,
  dimensions: RenderDimensions
): Promise<void> {
  const { width, height } = dimensions;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear canvas completely for true Alpha channel transparency
  ctx.clearRect(0, 0, width, height);

  const scale = width / 1000; // baseline normalized to 1000px

  // Generate QR Matrix
  const qrData = config.targetUrl || 'https://www.youtube.com';
  const qrMatrix = QRCode.create(qrData, {
    errorCorrectionLevel: config.errorCorrectionLevel || 'H',
  });

  const moduleCount = qrMatrix.modules.size;

  // 1. Draw outer background if not transparent
  if (!config.isTransparentBg) {
    ctx.fillStyle = config.bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Draw card container if enabled
  const padding = config.padding * scale;
  const cardX = padding;
  const cardY = padding;
  const cardW = width - padding * 2;
  const cardH = height - padding * 2;
  const cardRadius = config.borderRadius * scale;

  if (config.hasCardContainer) {
    ctx.save();
    if (config.hasShadow) {
      const shadowBlur = 32 * scale * (config.shadowIntensity / 100);
      ctx.shadowColor = `rgba(0, 0, 0, ${0.45 * (config.shadowIntensity / 100)})`;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetY = 12 * scale * (config.shadowIntensity / 100);
    }

    ctx.fillStyle = config.cardBgColor;
    drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
    ctx.fill();

    // Border
    if (config.borderWidth > 0) {
      ctx.shadowColor = 'transparent';
      ctx.lineWidth = config.borderWidth * scale;
      ctx.strokeStyle = config.borderColor;
      drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Determine Layout Structure
  const activeMessage = config.message === 'PERSONALIZADA' ? config.customMessage : config.message;
  const layout = config.layout;

  if (layout === 'square') {
    // SQUARE STACKED LAYOUT
    const contentAreaW = cardW - 32 * scale;
    const contentAreaH = cardH - 32 * scale;

    const qrSize = Math.min(contentAreaW * (config.qrSizeRatio / 100), contentAreaH * 0.62);
    const qrX = cardX + (cardW - qrSize) / 2;
    const qrY = cardY + 28 * scale;

    // Draw QR Code Modules
    await drawQRModules(ctx, qrMatrix, qrX, qrY, qrSize, config.qrColor);

    // Optional Center Logo
    if (config.showYoutubeIcon && config.iconPosition === 'center_qr') {
      const logoSize = qrSize * 0.22;
      const logoX = qrX + qrSize / 2;
      const logoY = qrY + qrSize / 2;

      // Draw safety white/bg cutout behind center logo
      ctx.save();
      ctx.fillStyle = config.hasCardContainer ? config.cardBgColor : (config.isTransparentBg ? '#FFFFFF' : config.bgColor);
      drawRoundedRect(ctx, logoX - (logoSize * 1.5) / 2 - 4 * scale, logoY - (logoSize) / 2 - 4 * scale, logoSize * 1.5 + 8 * scale, logoSize + 8 * scale, 6 * scale);
      ctx.fill();
      ctx.restore();

      drawYouTubeIcon(ctx, logoX, logoY, logoSize, config.iconStyle, config.qrColor);
    }

    // Draw Message & Submessage
    const textCenterY = qrY + qrSize + (cardH - (qrY - cardY + qrSize)) / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontName = config.fontFamily === 'Outfit' ? 'Outfit' : 'Plus Jakarta Sans';
    const fontWeight = config.textWeight === 'black' ? '900' : config.textWeight === 'bold' ? '700' : '600';
    const fontSize = config.textSize * scale * 1.25;

    ctx.font = `${fontWeight} ${fontSize}px "${fontName}", sans-serif`;
    ctx.fillStyle = config.textColor;

    let currentY = textCenterY - (config.showSubMessage ? 12 * scale : 0);

    // Draw Top/Beside Icon if configured
    if (config.showYoutubeIcon && config.iconPosition === 'beside_text') {
      const iconSize = fontSize * 0.85;
      const textMetrics = ctx.measureText(activeMessage);
      const totalWidth = textMetrics.width + iconSize * 1.6 + 12 * scale;
      const startX = cardX + cardW / 2 - totalWidth / 2;

      drawYouTubeIcon(ctx, startX + (iconSize * 1.42) / 2, currentY, iconSize, config.iconStyle, config.textColor);
      ctx.textAlign = 'left';
      ctx.fillText(activeMessage, startX + iconSize * 1.6 + 12 * scale, currentY);
    } else {
      ctx.fillText(activeMessage, cardX + cardW / 2, currentY);
    }

    // Submessage (Channel handle or callout)
    if (config.showSubMessage && config.subMessage) {
      const subFontSize = fontSize * 0.58;
      ctx.font = `600 ${subFontSize}px "${fontName}", sans-serif`;
      ctx.fillStyle = config.subTextColor;
      ctx.textAlign = 'center';
      ctx.fillText(config.subMessage, cardX + cardW / 2, currentY + fontSize * 0.85 + 6 * scale);
    }
    ctx.restore();

  } else if (layout === 'horizontal_right' || layout === 'horizontal_left') {
    // HORIZONTAL VIDEO BANNER LAYOUT (Lower-third style)
    const isRight = layout === 'horizontal_right';
    const contentH = cardH - 24 * scale;
    const qrSize = contentH * 0.88;

    const qrX = isRight
      ? cardX + 24 * scale
      : cardX + cardW - qrSize - 24 * scale;
    const qrY = cardY + (cardH - qrSize) / 2;

    // Draw QR Code Modules
    await drawQRModules(ctx, qrMatrix, qrX, qrY, qrSize, config.qrColor);

    // Center Logo if configured
    if (config.showYoutubeIcon && config.iconPosition === 'center_qr') {
      const logoSize = qrSize * 0.22;
      const logoX = qrX + qrSize / 2;
      const logoY = qrY + qrSize / 2;

      ctx.save();
      ctx.fillStyle = config.hasCardContainer ? config.cardBgColor : (config.isTransparentBg ? '#FFFFFF' : config.bgColor);
      drawRoundedRect(ctx, logoX - (logoSize * 1.5) / 2 - 4 * scale, logoY - (logoSize) / 2 - 4 * scale, logoSize * 1.5 + 8 * scale, logoSize + 8 * scale, 6 * scale);
      ctx.fill();
      ctx.restore();

      drawYouTubeIcon(ctx, logoX, logoY, logoSize, config.iconStyle, config.qrColor);
    }

    // Text & CTA section
    const textAreaX = isRight
      ? qrX + qrSize + 32 * scale
      : cardX + 28 * scale;
    const textAreaW = cardW - qrSize - 80 * scale;
    const textCenterY = cardY + cardH / 2;

    ctx.save();
    ctx.textAlign = isRight ? 'left' : 'right';
    ctx.textBaseline = 'middle';

    const fontName = config.fontFamily === 'Outfit' ? 'Outfit' : 'Plus Jakarta Sans';
    const fontWeight = config.textWeight === 'black' ? '900' : config.textWeight === 'bold' ? '700' : '600';
    const fontSize = config.textSize * scale * 1.35;

    ctx.font = `${fontWeight} ${fontSize}px "${fontName}", sans-serif`;
    ctx.fillStyle = config.textColor;

    const textAnchorX = isRight ? textAreaX : textAreaX + textAreaW;
    let mainTextY = textCenterY - (config.showSubMessage ? 14 * scale : 0);

    if (config.showYoutubeIcon && (config.iconPosition === 'beside_text' || config.iconPosition === 'header_badge')) {
      const iconSize = fontSize * 0.9;
      if (isRight) {
        drawYouTubeIcon(ctx, textAnchorX + (iconSize * 1.42) / 2, mainTextY, iconSize, config.iconStyle, config.textColor);
        ctx.fillText(activeMessage, textAnchorX + iconSize * 1.6 + 10 * scale, mainTextY);
      } else {
        const textMetrics = ctx.measureText(activeMessage);
        drawYouTubeIcon(ctx, textAnchorX - textMetrics.width - (iconSize * 1.42) / 2 - 12 * scale, mainTextY, iconSize, config.iconStyle, config.textColor);
        ctx.fillText(activeMessage, textAnchorX, mainTextY);
      }
    } else {
      ctx.fillText(activeMessage, textAnchorX, mainTextY);
    }

    // Submessage
    if (config.showSubMessage && config.subMessage) {
      const subFontSize = fontSize * 0.55;
      ctx.font = `600 ${subFontSize}px "${fontName}", sans-serif`;
      ctx.fillStyle = config.subTextColor;
      ctx.fillText(config.subMessage, textAnchorX, mainTextY + fontSize * 0.85 + 4 * scale);
    }
    ctx.restore();

  } else if (layout === 'compact_badge') {
    // COMPACT CORNER BADGE
    const qrSize = Math.min(cardW, cardH) * 0.72;
    const qrX = cardX + (cardW - qrSize) / 2;
    const qrY = cardY + 16 * scale;

    await drawQRModules(ctx, qrMatrix, qrX, qrY, qrSize, config.qrColor);

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontName = 'Outfit';
    const fontSize = config.textSize * scale * 0.95;
    ctx.font = `800 ${fontSize}px "${fontName}", sans-serif`;
    ctx.fillStyle = config.textColor;
    ctx.fillText(activeMessage, cardX + cardW / 2, qrY + qrSize + (cardH - (qrY - cardY + qrSize)) / 2);
    ctx.restore();
  }
}

/**
 * Helper to render individual high-precision QR modules
 */
async function drawQRModules(
  ctx: CanvasRenderingContext2D,
  qrMatrix: any,
  x: number,
  y: number,
  size: number,
  color: string
) {
  const moduleCount = qrMatrix.modules.size;
  const cellSize = size / moduleCount;

  ctx.save();
  ctx.fillStyle = color;

  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (qrMatrix.modules.get(row, col)) {
        // High density square pixel fill with slight sub-pixel rounding to eliminate gap artifacts
        const px = Math.floor(x + col * cellSize);
        const py = Math.floor(y + row * cellSize);
        const pw = Math.ceil(cellSize);
        const ph = Math.ceil(cellSize);
        ctx.fillRect(px, py, pw, ph);
      }
    }
  }
  ctx.restore();
}

/**
 * Exports canvas to high-resolution Blob and triggers user download
 */
export async function exportHighResPNG(
  config: QRConfig,
  targetWidth: number,
  targetHeight: number,
  filename: string
): Promise<void> {
  const offscreenCanvas = document.createElement('canvas');
  await renderQRToCanvas(offscreenCanvas, config, {
    width: targetWidth,
    height: targetHeight,
  });

  return new Promise((resolve) => {
    offscreenCanvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve();
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve();
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Generates an SVG string representation of the QR code
 */
export async function generateSVG(config: QRConfig, width = 1000, height = 1000): Promise<string> {
  const qrData = config.targetUrl || 'https://www.youtube.com';
  const qrSvg = await QRCode.toString(qrData, {
    type: 'svg',
    errorCorrectionLevel: config.errorCorrectionLevel || 'H',
    color: {
      dark: config.qrColor,
      light: config.isTransparentBg ? '#00000000' : config.bgColor,
    },
    margin: 1,
  });
  return qrSvg;
}
