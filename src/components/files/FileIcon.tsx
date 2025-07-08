import React from 'react';
import styled from 'styled-components';
import {
  FileText,
  Image,
  Code,
  Database,
  File,
  FileSpreadsheet,
  FileImage,
} from 'lucide-react';
import { FileCategory } from '../../types';

interface FileIconProps {
  category: FileCategory;
  size?: number;
}

const IconWrapper = styled.div<{ size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  color: ${({ theme }) => theme.colors.primary};
`;

const getIconComponent = (category: FileCategory) => {
  switch (category) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return FileText;
    case 'jpg':
    case 'png':
    case 'svg':
      return FileImage;
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return Code;
    case 'json':
      return Database;
    case 'csv':
      return FileSpreadsheet;
    default:
      return File;
  }
};

export const FileIcon: React.FC<FileIconProps> = ({ category, size = 24 }) => {
  const IconComponent = getIconComponent(category);

  return (
    <IconWrapper size={size}>
      <IconComponent size={size} />
    </IconWrapper>
  );
};