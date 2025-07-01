import { AuthService } from '@/services/auth';
import { driveConfig, API_ENDPOINTS, DRIVE_PARAMS } from '@/config/drive';
import type {
  DriveFile,
  ProcessedFile,
  FileDetails,
  Breadcrumb,
  DriveApiResponse,
} from '@/types';

/**
 * Google Drive API service
 */
export class DriveApiService {
  private static instance: DriveApiService;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  static getInstance(): DriveApiService {
    if (!DriveApiService.instance) {
      DriveApiService.instance = new DriveApiService();
    }
    return DriveApiService.instance;
  }

  /**
   * Makes an authenticated request to the Drive API
   */
  private async makeRequest(url: string): Promise<Response> {
    const token = await this.authService.getAccessToken();
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Drive API request failed: ${response.statusText}`);
    }

    return response;
  }

  /**
   * Gets details for a specific file
   */
  async getFileDetails(fileId: string): Promise<FileDetails> {
    const url = `${API_ENDPOINTS.FILES}/${fileId}?fields=${DRIVE_PARAMS.FILE_FIELDS}&supportsAllDrives=true`;
    
    const response = await this.makeRequest(url);
    const file: DriveFile = await response.json();
    
    return {
      ...file,
      downloadUrl: `${API_ENDPOINTS.DOWNLOAD}${file.id}`,
    };
  }

  /**
   * Gets breadcrumb navigation data for a folder
   */
  async getBreadcrumbs(folderId: string): Promise<Breadcrumb[]> {
    const breadcrumbs: Breadcrumb[] = [];
    let currentId = folderId;

    while (currentId && currentId !== 'root') {
      try {
        const url = `${API_ENDPOINTS.FILES}/${currentId}?fields=${DRIVE_PARAMS.BREADCRUMB_FIELDS}&supportsAllDrives=true`;
        const response = await this.makeRequest(url);
        const result: DriveFile = await response.json();

        breadcrumbs.unshift({
          name: result.name,
          path: `/${currentId}`,
        });

        currentId = result.parents?.[0] ?? null;
        if (currentId === driveConfig.teamDriveId) break;
      } catch (error) {
        console.error('Error building breadcrumbs:', error);
        break;
      }
    }

    return breadcrumbs;
  }

  /**
   * Lists files in a folder
   */
  async listFiles(parent: string): Promise<ProcessedFile[]> {
    const query = parent === 'root' 
      ? `'${driveConfig.teamDriveId}' in parents and trashed = false`
      : `'${parent}' in parents and trashed = false`;

    const params = new URLSearchParams({
      q: query,
      fields: DRIVE_PARAMS.FIELDS,
      orderBy: DRIVE_PARAMS.ORDER_BY,
      pageSize: DRIVE_PARAMS.PAGE_SIZE,
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
      corpora: 'drive',
      driveId: driveConfig.teamDriveId,
    });

    const url = `${API_ENDPOINTS.FILES}?${params.toString()}`;
    const response = await this.makeRequest(url);
    const result: DriveApiResponse = await response.json();

    if (!result.files) {
      return [];
    }

    return result.files
      .filter(file => !file.trashed)
      .map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType === 'application/vnd.google-apps.folder' 
          ? 'folder' 
          : file.mimeType,
        size: file.size,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        link: file.mimeType === 'application/vnd.google-apps.folder'
          ? `/${file.id}`
          : `${API_ENDPOINTS.DOWNLOAD}${file.id}`,
      }));
  }
}