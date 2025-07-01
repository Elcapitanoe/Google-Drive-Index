export interface DriveConfig {
  readonly clientId: string;
  readonly clientSecret: string;
  readonly refreshToken: string;
  readonly teamDriveId: string;
}

export interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  md5Checksum?: string;
  parents?: string[];
  trashed?: boolean;
}

export interface ProcessedFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  link: string;
}

export interface FileDetails extends DriveFile {
  downloadUrl: string;
}

export interface Breadcrumb {
  name: string;
  path: string;
}

export interface DriveApiResponse {
  files?: DriveFile[];
  nextPageToken?: string;
}

export interface ViewFileData {
  viewFile: FileDetails;
}

export type ContentData = ProcessedFile[] | ViewFileData;

export interface ToastOptions {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
}