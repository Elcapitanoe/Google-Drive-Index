import React from 'react';
import {
  Folder,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  Video,
  Music,
  Archive,
  Code2,
  File,
} from 'lucide-react';
import type { FileCategory } from './types';

interface FileIconProps {
  type: FileCategory;
  size?: number;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({
  type,
  size = 18,
  className = '',
}) => {
  const iconProps = {
    size,
    strokeWidth: 1.75,
  };

  switch (type) {
    case 'folder':
      return (
        <Folder {...iconProps} className={`icon-type-folder ${className}`} />
      );
    case 'pdf':
      return (
        <FileText {...iconProps} className={`icon-type-pdf ${className}`} />
      );
    case 'document':
      return (
        <FileText
          {...iconProps}
          className={`icon-type-document ${className}`}
        />
      );
    case 'spreadsheet':
      return (
        <FileSpreadsheet
          {...iconProps}
          className={`icon-type-spreadsheet ${className}`}
        />
      );
    case 'presentation':
      return (
        <Presentation
          {...iconProps}
          className={`icon-type-presentation ${className}`}
        />
      );
    case 'image':
      return (
        <Image {...iconProps} className={`icon-type-image ${className}`} />
      );
    case 'video':
      return (
        <Video {...iconProps} className={`icon-type-video ${className}`} />
      );
    case 'audio':
      return (
        <Music {...iconProps} className={`icon-type-audio ${className}`} />
      );
    case 'archive':
      return (
        <Archive {...iconProps} className={`icon-type-archive ${className}`} />
      );
    case 'code':
      return <Code2 {...iconProps} className={`icon-type-code ${className}`} />;
    default:
      return <File {...iconProps} className={`icon-type-file ${className}`} />;
  }
};
