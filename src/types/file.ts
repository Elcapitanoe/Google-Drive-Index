export interface FileMetadata {
  id: string;
  name: string;
  extension: string;
  size: number;
  dateCreated: Date;
  dateModified: Date;
  type: FileType;
  description: string;
  tags: string[];
  category: FileCategory;
}

export type FileType = 'document' | 'image' | 'code' | 'data';

export type FileCategory =
  | 'pdf'
  | 'doc'
  | 'docx'
  | 'txt'
  | 'jpg'
  | 'png'
  | 'svg'
  | 'ts'
  | 'tsx'
  | 'js'
  | 'jsx'
  | 'json'
  | 'csv';

export interface FileFilter {
  type?: FileType;
  category?: FileCategory;
  searchTerm?: string;
  sortBy?: 'name' | 'size' | 'dateCreated' | 'dateModified';
  sortOrder?: 'asc' | 'desc';
}

export interface FileStats {
  totalFiles: number;
  totalSize: number;
  typeDistribution: Record<FileType, number>;
  categoryDistribution: Record<FileCategory, number>;
}
