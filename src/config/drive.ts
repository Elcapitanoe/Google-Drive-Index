import type { DriveConfig } from '@/types';

/**
 * Google Drive API configuration
 * Replace with your actual credentials in production
 */
export const driveConfig: DriveConfig = {
  clientId: 'YOUR CLIENT ID',
  clientSecret: 'YOUR CLIENT SECRET',
  refreshToken: 'YOUR REFRESH TOKEN',
  teamDriveId: 'YOUR TEAM DRIVE ID / ROOT',
} as const;

export const API_ENDPOINTS = {
  TOKEN: 'https://oauth2.googleapis.com/token',
  FILES: 'https://www.googleapis.com/drive/v3/files',
  DOWNLOAD: 'https://drive.google.com/uc?export=download&id=',
} as const;

export const DRIVE_PARAMS = {
  FIELDS: 'files(id,name,mimeType,size,createdTime,modifiedTime,trashed)',
  FILE_FIELDS: 'id,name,mimeType,size,createdTime,modifiedTime,md5Checksum',
  BREADCRUMB_FIELDS: 'name,parents',
  ORDER_BY: 'folder,name',
  PAGE_SIZE: '1000',
} as const;
