import React from 'react';
import {
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Code2,
  File,
} from 'lucide-react';
import type { DriveItem } from './types';

interface FileIconProps {
  type: DriveItem['iconType'];
  size?: number;
  className?: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ type, size = 18, className = '' }) => {
  switch (type) {
    case 'folder':
      return <Folder size={size} className={`icon-folder ${className}`} />;
    case 'document':
      return <FileText size={size} className={`icon-document ${className}`} />;
    case 'image':
      return <Image size={size} className={`icon-image ${className}`} />;
    case 'video':
      return <Video size={size} className={`icon-video ${className}`} />;
    case 'audio':
      return <Music size={size} className={`icon-audio ${className}`} />;
    case 'archive':
      return <Archive size={size} className={`icon-archive ${className}`} />;
    case 'code':
      return <Code2 size={size} className={`icon-code ${className}`} />;
    default:
      return <File size={size} className={`icon-file ${className}`} />;
  }
};
