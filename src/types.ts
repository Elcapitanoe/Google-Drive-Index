export type FileCategory =
  | 'folder'
  | 'document'
  | 'spreadsheet'
  | 'presentation'
  | 'pdf'
  | 'image'
  | 'video'
  | 'audio'
  | 'archive'
  | 'code'
  | 'file';

export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  size?: number;
  modifiedTime: string;
  isFolder: boolean;
  downloadUrl?: string;
  webViewLink?: string;
  iconType: FileCategory;
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export type ViewMode = 'table' | 'grid';
export type SortField = 'name' | 'size' | 'modifiedTime';
export type SortOrder = 'asc' | 'desc';
export type ThemeMode = 'dark' | 'light';

export interface FolderStats {
  folders: number;
  files: number;
  totalBytes: number;
}
