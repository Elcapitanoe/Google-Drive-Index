import type { ProcessedFile, FileDetails, Breadcrumb } from '../types';

/**
 * Mock Google Drive service for demonstration
 */
export class MockDriveService {
  private static instance: MockDriveService;

  private constructor() {}

  static getInstance(): MockDriveService {
    if (!MockDriveService.instance) {
      MockDriveService.instance = new MockDriveService();
    }
    return MockDriveService.instance;
  }

  /**
   * Mock file data
   */
  private getMockFiles(): ProcessedFile[] {
    return [
      {
        id: 'folder1',
        name: 'Documents',
        mimeType: 'folder',
        createdTime: '2024-01-15T10:30:00Z',
        modifiedTime: '2024-01-20T14:45:00Z',
        link: '/folder1',
      },
      {
        id: 'folder2',
        name: 'Images',
        mimeType: 'folder',
        createdTime: '2024-01-10T09:15:00Z',
        modifiedTime: '2024-01-25T16:20:00Z',
        link: '/folder2',
      },
      {
        id: 'file1',
        name: 'Project Report.pdf',
        mimeType: 'application/pdf',
        size: '2048576',
        createdTime: '2024-01-18T11:00:00Z',
        modifiedTime: '2024-01-18T11:00:00Z',
        link: 'https://example.com/download/file1',
      },
      {
        id: 'file2',
        name: 'Presentation.pptx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        size: '5242880',
        createdTime: '2024-01-16T13:30:00Z',
        modifiedTime: '2024-01-19T10:15:00Z',
        link: 'https://example.com/download/file2',
      },
      {
        id: 'file3',
        name: 'Data Analysis.xlsx',
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: '1048576',
        createdTime: '2024-01-12T08:45:00Z',
        modifiedTime: '2024-01-22T15:30:00Z',
        link: 'https://example.com/download/file3',
      },
    ];
  }

  /**
   * Mock folder contents
   */
  private getFolderContents(folderId: string): ProcessedFile[] {
    if (folderId === 'folder1') {
      return [
        {
          id: 'file4',
          name: 'Meeting Notes.docx',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          size: '524288',
          createdTime: '2024-01-20T09:00:00Z',
          modifiedTime: '2024-01-20T09:00:00Z',
          link: 'https://example.com/download/file4',
        },
        {
          id: 'file5',
          name: 'Contract.pdf',
          mimeType: 'application/pdf',
          size: '1572864',
          createdTime: '2024-01-19T14:30:00Z',
          modifiedTime: '2024-01-19T14:30:00Z',
          link: 'https://example.com/download/file5',
        },
      ];
    }

    if (folderId === 'folder2') {
      return [
        {
          id: 'file6',
          name: 'Logo.png',
          mimeType: 'image/png',
          size: '262144',
          createdTime: '2024-01-15T12:00:00Z',
          modifiedTime: '2024-01-15T12:00:00Z',
          link: 'https://example.com/download/file6',
        },
        {
          id: 'file7',
          name: 'Banner.jpg',
          mimeType: 'image/jpeg',
          size: '1048576',
          createdTime: '2024-01-17T16:45:00Z',
          modifiedTime: '2024-01-17T16:45:00Z',
          link: 'https://example.com/download/file7',
        },
      ];
    }

    return [];
  }

  /**
   * List files in a folder
   */
  async listFiles(folderId: string): Promise<ProcessedFile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (folderId === 'root') {
      return this.getMockFiles();
    }

    return this.getFolderContents(folderId);
  }

  /**
   * Get file details
   */
  async getFileDetails(fileId: string): Promise<FileDetails> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const allFiles = [
      ...this.getMockFiles(),
      ...this.getFolderContents('folder1'),
      ...this.getFolderContents('folder2'),
    ];

    const file = allFiles.find(f => f.id === fileId);

    if (!file) {
      throw new Error('File not found');
    }

    return {
      ...file,
      md5Checksum: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
      downloadUrl: file.link,
    };
  }

  /**
   * Get breadcrumb navigation
   */
  async getBreadcrumbs(folderId: string): Promise<Breadcrumb[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const breadcrumbs: Breadcrumb[] = [];

    if (folderId === 'folder1') {
      breadcrumbs.push({ name: 'Documents', path: '/folder1' });
    } else if (folderId === 'folder2') {
      breadcrumbs.push({ name: 'Images', path: '/folder2' });
    } else if (folderId.startsWith('file')) {
      // For files, we need to determine their parent folder
      const folderFiles = this.getFolderContents('folder1');
      const imageFiles = this.getFolderContents('folder2');

      if (folderFiles.some(f => f.id === folderId)) {
        breadcrumbs.push({ name: 'Documents', path: '/folder1' });
      } else if (imageFiles.some(f => f.id === folderId)) {
        breadcrumbs.push({ name: 'Images', path: '/folder2' });
      }
    }

    return breadcrumbs;
  }
}
