export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime: string;
  isFolder: boolean;
  downloadUrl?: string;
  iconType: 'folder' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'file';
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export type ViewMode = 'grid' | 'table';
export type SortField = 'name' | 'size' | 'modifiedTime';
export type SortOrder = 'asc' | 'desc';
