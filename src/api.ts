import type { DriveItem } from './types';
import { getFileCategory } from './utils';

export interface DriveConfig {
  apiKey: string;
  rootFolderId: string;
}

interface GoogleDriveApiFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  webContentLink?: string;
  webViewLink?: string;
}

interface GoogleDriveApiResponse {
  files?: GoogleDriveApiFile[];
  nextPageToken?: string;
  error?: {
    code: number;
    message: string;
  };
}

const STORAGE_KEY = 'gdrive_index_config';
const CACHE_TTL_MS = 60 * 1000; // 1 minute in-memory cache

interface CacheEntry {
  items: DriveItem[];
  timestamp: number;
}

const folderCache = new Map<string, CacheEntry>();

export function clearFolderCache(folderId?: string): void {
  if (folderId) {
    folderCache.delete(folderId);
  } else {
    folderCache.clear();
  }
}

export function getStoredConfig(): DriveConfig {
  const envKey = import.meta.env.VITE_GDRIVE_API_KEY?.trim() || '';
  const envRoot = import.meta.env.VITE_GDRIVE_ROOT_ID?.trim() || 'root';

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        apiKey:
          typeof parsed.apiKey === 'string' ? parsed.apiKey.trim() : envKey,
        rootFolderId:
          typeof parsed.rootFolderId === 'string' && parsed.rootFolderId.trim()
            ? parsed.rootFolderId.trim()
            : envRoot,
      };
    }
  } catch {
    // Fall back to environment configuration on storage error
  }

  return {
    apiKey: envKey,
    rootFolderId: envRoot,
  };
}

export function saveStoredConfig(config: DriveConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  clearFolderCache();
}

export async function fetchFolderContents(
  folderId: string,
  config: DriveConfig,
  signal?: AbortSignal,
  bypassCache = false
): Promise<DriveItem[]> {
  const cacheKey = `${config.apiKey}:${folderId}`;

  if (!bypassCache) {
    const cached = folderCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.items;
    }
  }

  if (!config.apiKey) {
    const demoItems = getFallbackDemoItems(folderId);
    folderCache.set(cacheKey, { items: demoItems, timestamp: Date.now() });
    return demoItems;
  }

  const query = `'${folderId}' in parents and trashed = false`;
  const fields =
    'files(id, name, mimeType, size, modifiedTime, webContentLink, webViewLink)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=${encodeURIComponent(fields)}&orderBy=folder,name&key=${encodeURIComponent(
    config.apiKey
  )}&pageSize=1000`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    const errorData = (await res
      .json()
      .catch(() => ({}))) as GoogleDriveApiResponse;
    const message =
      errorData.error?.message ||
      `Google Drive API error (${res.status}: ${res.statusText})`;
    throw new Error(message);
  }

  const data = (await res.json()) as GoogleDriveApiResponse;
  const rawFiles = data.files || [];

  const items: DriveItem[] = rawFiles.map(file => {
    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
    const directDownload =
      file.webContentLink ||
      `https://drive.google.com/uc?id=${file.id}&export=download`;

    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size ? parseInt(file.size, 10) : undefined,
      modifiedTime: file.modifiedTime || new Date().toISOString(),
      isFolder,
      downloadUrl: isFolder ? undefined : directDownload,
      webViewLink:
        file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`,
      iconType: getFileCategory(file.mimeType, file.name),
    };
  });

  folderCache.set(cacheKey, { items, timestamp: Date.now() });
  return items;
}

function createDemoDataUrl(title: string, contents: string): string {
  return `data:text/plain;charset=utf-8,${encodeURIComponent(`${title}\n\n${contents}`)}`;
}

function getFallbackDemoItems(folderId: string): DriveItem[] {
  if (folderId === 'demo-docs') {
    return [
      {
        id: 'doc-1',
        name: 'Technical Architecture Specification.pdf',
        mimeType: 'application/pdf',
        size: 2457600,
        modifiedTime: '2026-02-15T08:30:00Z',
        isFolder: false,
        downloadUrl: createDemoDataUrl(
          'Technical Architecture Specification',
          'Mock specification binary placeholder for Google Drive Index.'
        ),
        webViewLink: 'https://drive.google.com',
        iconType: 'pdf',
      },
      {
        id: 'doc-2',
        name: 'Production Deployment Runbook.docx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 524288,
        modifiedTime: '2026-02-18T14:12:00Z',
        isFolder: false,
        downloadUrl: createDemoDataUrl(
          'Production Deployment Runbook',
          'Deployment procedures and disaster recovery guide.'
        ),
        webViewLink: 'https://drive.google.com',
        iconType: 'document',
      },
      {
        id: 'doc-3',
        name: 'Infrastructure Budget 2026.xlsx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 1048576,
        modifiedTime: '2026-02-21T09:45:00Z',
        isFolder: false,
        downloadUrl: createDemoDataUrl(
          'Infrastructure Budget 2026',
          'Quarterly server and bandwidth budget allocation spreadsheet.'
        ),
        webViewLink: 'https://drive.google.com',
        iconType: 'spreadsheet',
      },
    ];
  }

  if (folderId === 'demo-media') {
    return [
      {
        id: 'img-1',
        name: 'infrastructure-topology.png',
        mimeType: 'image/png',
        size: 1843200,
        modifiedTime: '2026-02-10T11:20:00Z',
        isFolder: false,
        downloadUrl: createDemoDataUrl(
          'infrastructure-topology.png',
          'Architecture topology PNG asset.'
        ),
        webViewLink: 'https://drive.google.com',
        iconType: 'image',
      },
      {
        id: 'vid-1',
        name: 'system-demo-walkthrough.mp4',
        mimeType: 'video/mp4',
        size: 54525952,
        modifiedTime: '2026-01-28T19:40:00Z',
        isFolder: false,
        downloadUrl: createDemoDataUrl(
          'system-demo-walkthrough.mp4',
          'Video walkthrough demonstration recording.'
        ),
        webViewLink: 'https://drive.google.com',
        iconType: 'video',
      },
    ];
  }

  return [
    {
      id: 'demo-docs',
      name: 'Engineering Documents',
      mimeType: 'application/vnd.google-apps.folder',
      modifiedTime: '2026-02-20T10:00:00Z',
      isFolder: true,
      iconType: 'folder',
    },
    {
      id: 'demo-media',
      name: 'Media & Assets',
      mimeType: 'application/vnd.google-apps.folder',
      modifiedTime: '2026-02-18T12:00:00Z',
      isFolder: true,
      iconType: 'folder',
    },
    {
      id: 'demo-archive',
      name: 'dataset-snapshots-2026.tar.gz',
      mimeType: 'application/gzip',
      size: 142606336,
      modifiedTime: '2026-02-24T16:45:00Z',
      isFolder: false,
      downloadUrl: createDemoDataUrl(
        'dataset-snapshots-2026.tar.gz',
        'Gzip compressed dataset archive archive placeholder.'
      ),
      webViewLink: 'https://drive.google.com',
      iconType: 'archive',
    },
    {
      id: 'demo-config',
      name: 'gateway-configuration.json',
      mimeType: 'application/json',
      size: 12480,
      modifiedTime: '2026-02-26T09:15:00Z',
      isFolder: false,
      downloadUrl: createDemoDataUrl(
        'gateway-configuration.json',
        '{\n  "gateway": "gdrive-index",\n  "version": "2.1.0",\n  "cache": true\n}'
      ),
      webViewLink: 'https://drive.google.com',
      iconType: 'code',
    },
    {
      id: 'demo-report',
      name: 'Quarterly Infrastructure Audit.pdf',
      mimeType: 'application/pdf',
      size: 4194304,
      modifiedTime: '2026-02-27T18:00:00Z',
      isFolder: false,
      downloadUrl: createDemoDataUrl(
        'Quarterly Infrastructure Audit.pdf',
        'Infrastructure audit report PDF mock file.'
      ),
      webViewLink: 'https://drive.google.com',
      iconType: 'pdf',
    },
  ];
}
