import type { DriveItem } from './types';

export function formatBytes(bytes?: number): string {
  if (bytes === undefined || bytes === null || isNaN(bytes)) return '-';
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return '-';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function getFileCategory(mimeType: string, filename: string): DriveItem['iconType'] {
  if (mimeType === 'application/vnd.google-apps.folder' || mimeType === 'folder') {
    return 'folder';
  }
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    mimeType.includes('text/')
  ) {
    return 'document';
  }
  if (
    mimeType.includes('zip') ||
    mimeType.includes('tar') ||
    mimeType.includes('rar') ||
    mimeType.includes('7z') ||
    mimeType.includes('compressed')
  ) {
    return 'archive';
  }

  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['js', 'ts', 'jsx', 'tsx', 'json', 'py', 'go', 'rs', 'c', 'cpp', 'html', 'css', 'yml', 'yaml', 'toml', 'sh'].includes(ext)) {
    return 'code';
  }

  return 'file';
}
