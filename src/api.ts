import type { DriveItem } from './types';
import { getFileCategory } from './utils';

export interface DriveConfig {
  apiKey?: string;
  rootFolderId?: string;
  clientId?: string;
}

const STORAGE_KEY = 'gdrive_index_config';

export function getStoredConfig(): DriveConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    void e;
  }
  return {
    apiKey: (import.meta as any).env?.VITE_GDRIVE_API_KEY || '',
    rootFolderId: (import.meta as any).env?.VITE_GDRIVE_ROOT_ID || 'root',
  };
}

export function saveStoredConfig(config: DriveConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export async function fetchFolderContents(
  folderId: string,
  config: DriveConfig
): Promise<DriveItem[]> {
  if (!config.apiKey) {
    return getFallbackDemoItems(folderId);
  }

  const query = `'${folderId}' in parents and trashed = false`;
  const fields = 'files(id, name, mimeType, size, modifiedTime, webContentLink, iconLink)';
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=${encodeURIComponent(fields)}&orderBy=folder,name&key=${encodeURIComponent(
    config.apiKey
  )}&pageSize=1000`;

  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Drive API error: ${res.statusText}`);
  }

  const data = await res.json();
  const rawFiles: any[] = data.files || [];

  return rawFiles.map((file) => {
    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
    return {
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      size: file.size ? parseInt(file.size, 10) : undefined,
      modifiedTime: file.modifiedTime || new Date().toISOString(),
      isFolder,
      downloadUrl: file.webContentLink || `https://drive.google.com/uc?id=${file.id}&export=download`,
      iconType: getFileCategory(file.mimeType, file.name),
    };
  });
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
        downloadUrl: '#',
        iconType: 'document',
      },
      {
        id: 'doc-2',
        name: 'Production Deployment Runbook.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 524288,
        modifiedTime: '2026-02-18T14:12:00Z',
        isFolder: false,
        downloadUrl: '#',
        iconType: 'document',
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
        downloadUrl: '#',
        iconType: 'image',
      },
      {
        id: 'vid-1',
        name: 'system-demo-walkthrough.mp4',
        mimeType: 'video/mp4',
        size: 54525952,
        modifiedTime: '2026-01-28T19:40:00Z',
        isFolder: false,
        downloadUrl: '#',
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
      downloadUrl: '#',
      iconType: 'archive',
    },
    {
      id: 'demo-config',
      name: 'gateway-configuration.json',
      mimeType: 'application/json',
      size: 12480,
      modifiedTime: '2026-02-26T09:15:00Z',
      isFolder: false,
      downloadUrl: '#',
      iconType: 'code',
    },
    {
      id: 'demo-report',
      name: 'Quarterly Infrastructure Audit.pdf',
      mimeType: 'application/pdf',
      size: 4194304,
      modifiedTime: '2026-02-27T18:00:00Z',
      isFolder: false,
      downloadUrl: '#',
      iconType: 'document',
    },
  ];
}
