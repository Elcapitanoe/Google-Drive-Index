import type { FileCategory } from './types';

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

export function formatBytes(bytes?: number): string {
  if (
    bytes === undefined ||
    bytes === null ||
    Number.isNaN(bytes) ||
    bytes < 0
  ) {
    return '-';
  }
  if (bytes === 0) return '0 B';

  const k = 1024;
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    BYTE_UNITS.length - 1
  );
  const value = bytes / Math.pow(k, i);
  const formatted =
    value >= 100 || i === 0 ? value.toFixed(0) : value.toFixed(1);

  return `${formatted} ${BYTE_UNITS[i]}`;
}

export function formatDate(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return '-';
  }
}

export function formatDateTime(isoString: string): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch {
    return '-';
  }
}

const EXTENSION_CATEGORIES: Record<string, FileCategory> = {
  // Documents
  pdf: 'pdf',
  doc: 'document',
  docx: 'document',
  txt: 'document',
  rtf: 'document',
  odt: 'document',
  pages: 'document',

  // Spreadsheets
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  csv: 'spreadsheet',
  tsv: 'spreadsheet',
  ods: 'spreadsheet',
  numbers: 'spreadsheet',

  // Presentations
  ppt: 'presentation',
  pptx: 'presentation',
  odp: 'presentation',
  key: 'presentation',

  // Archives
  zip: 'archive',
  tar: 'archive',
  gz: 'archive',
  tgz: 'archive',
  bz2: 'archive',
  xz: 'archive',
  rar: 'archive',
  '7z': 'archive',
  iso: 'archive',

  // Images
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  svg: 'image',
  webp: 'image',
  avif: 'image',
  ico: 'image',
  bmp: 'image',
  tiff: 'image',

  // Audio
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  aac: 'audio',
  ogg: 'audio',
  m4a: 'audio',

  // Video
  mp4: 'video',
  mkv: 'video',
  mov: 'video',
  avi: 'video',
  webm: 'video',
  wmv: 'video',

  // Code & Markup
  js: 'code',
  mjs: 'code',
  cjs: 'code',
  ts: 'code',
  tsx: 'code',
  jsx: 'code',
  json: 'code',
  py: 'code',
  go: 'code',
  rs: 'code',
  java: 'code',
  kt: 'code',
  swift: 'code',
  c: 'code',
  cpp: 'code',
  h: 'code',
  hpp: 'code',
  cs: 'code',
  php: 'code',
  rb: 'code',
  sh: 'code',
  bash: 'code',
  zsh: 'code',
  sql: 'code',
  html: 'code',
  htm: 'code',
  css: 'code',
  scss: 'code',
  sass: 'code',
  less: 'code',
  yml: 'code',
  yaml: 'code',
  toml: 'code',
  md: 'code',
  mdx: 'code',
  xml: 'code',
};

export function getFileCategory(
  mimeType: string,
  filename: string
): FileCategory {
  if (
    mimeType === 'application/vnd.google-apps.folder' ||
    mimeType === 'folder'
  ) {
    return 'folder';
  }

  if (mimeType.includes('pdf')) return 'pdf';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';

  if (
    mimeType.includes('spreadsheet') ||
    mimeType.includes('excel') ||
    mimeType === 'application/vnd.google-apps.spreadsheet'
  ) {
    return 'spreadsheet';
  }

  if (
    mimeType.includes('presentation') ||
    mimeType.includes('powerpoint') ||
    mimeType === 'application/vnd.google-apps.presentation'
  ) {
    return 'presentation';
  }

  if (
    mimeType.includes('word') ||
    mimeType.includes('document') ||
    mimeType === 'application/vnd.google-apps.document'
  ) {
    return 'document';
  }

  if (
    mimeType.includes('zip') ||
    mimeType.includes('tar') ||
    mimeType.includes('compressed') ||
    mimeType.includes('archive')
  ) {
    return 'archive';
  }

  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext && EXTENSION_CATEGORIES[ext]) {
    return EXTENSION_CATEGORIES[ext];
  }

  return 'file';
}
