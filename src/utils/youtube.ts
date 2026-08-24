/**
 * Utility functions for YouTube URL parsing, validation and formatting
 */

export interface ParsedYouTubeUrl {
  isValid: boolean;
  isVideo: boolean;
  channelName: string;
  formattedUrl: string;
  subscribeUrl: string;
  errorMessage?: string;
  warningMessage?: string;
}

export function parseYouTubeUrl(input: string, addSubConfirmation = false): ParsedYouTubeUrl {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      isVideo: false,
      channelName: '',
      formattedUrl: '',
      subscribeUrl: '',
      errorMessage: 'Cole o link do seu canal do YouTube.',
    };
  }

  let urlStr = trimmed;
  // Handle handle shortcuts like @canal or youtube.com/@canal
  if (urlStr.startsWith('@')) {
    urlStr = `https://www.youtube.com/${urlStr}`;
  } else if (!/^https?:\/\//i.test(urlStr)) {
    urlStr = `https://${urlStr}`;
  }

  try {
    const url = new URL(urlStr);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    const isYouTubeHost =
      host === 'youtube.com' ||
      host === 'm.youtube.com' ||
      host === 'youtu.be' ||
      host.endsWith('.youtube.com');

    if (!isYouTubeHost) {
      return {
        isValid: false,
        isVideo: false,
        channelName: '',
        formattedUrl: urlStr,
        subscribeUrl: urlStr,
        errorMessage: 'Digite uma URL válida do YouTube (ex: youtube.com/@seucanal).',
      };
    }

    // Check if it is a video URL
    const pathname = url.pathname;
    const isVideo =
      host === 'youtu.be' ||
      pathname.startsWith('/watch') ||
      pathname.startsWith('/shorts/') ||
      pathname.startsWith('/live/') ||
      pathname.startsWith('/embed/');

    let channelName = 'Canal do YouTube';
    let cleanUrl = urlStr;

    // Extract handle or channel identifier
    if (pathname.includes('/@')) {
      const match = pathname.match(/@([a-zA-Z0-9_.-]+)/);
      if (match) {
        channelName = `@${match[1]}`;
        cleanUrl = `https://www.youtube.com/@${match[1]}`;
      }
    } else if (pathname.startsWith('/channel/')) {
      const parts = pathname.split('/');
      if (parts[2]) {
        channelName = `Canal ${parts[2].substring(0, 8)}...`;
        cleanUrl = `https://www.youtube.com/channel/${parts[2]}`;
      }
    } else if (pathname.startsWith('/c/') || pathname.startsWith('/user/')) {
      const parts = pathname.split('/');
      if (parts[2]) {
        channelName = parts[2];
        cleanUrl = `https://www.youtube.com/${parts[1]}/${parts[2]}`;
      }
    } else if (isVideo) {
      channelName = 'Vídeo do YouTube';
    }

    // Construct subscription link parameter if requested and not already present
    let subscribeUrl = cleanUrl;
    if (addSubConfirmation && !isVideo) {
      const subUrl = new URL(cleanUrl);
      subUrl.searchParams.set('sub_confirmation', '1');
      subscribeUrl = subUrl.toString();
    }

    return {
      isValid: true,
      isVideo,
      channelName,
      formattedUrl: cleanUrl,
      subscribeUrl: addSubConfirmation ? subscribeUrl : cleanUrl,
      warningMessage: isVideo
        ? 'Este link direciona para um vídeo, não para a página principal do canal. Deseja continuar?'
        : undefined,
    };
  } catch {
    return {
      isValid: false,
      isVideo: false,
      channelName: '',
      formattedUrl: urlStr,
      subscribeUrl: urlStr,
      errorMessage: 'Digite uma URL válida do YouTube.',
    };
  }
}

export function sanitizeFilename(name: string): string {
  const clean = name
    .toLowerCase()
    .replace(/^@/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return clean || 'meu-canal';
}
