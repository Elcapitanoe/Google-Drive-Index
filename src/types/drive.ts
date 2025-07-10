export interface DriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  teamDriveId: string;
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
  trashed?: boolean;
  parents?: string[];
  md5Checksum?: string;
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

export interface FileDetails extends ProcessedFile {
  md5Checksum?: string;
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