import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FileMetadata } from '../../types';
import { FileIcon } from './FileIcon';

interface FileCardProps {
  file: FileMetadata;
  onClick?: (file: FileMetadata) => void;
}

const StyledCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.2s ease-in-out;
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const FileHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FileInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
  word-break: break-word;
  line-height: ${({ theme }) => theme.typography.lineHeight.tight};
`;

const FileSize = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FileDescription = styled.p`
  margin: ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  flex: 1;
`;

const FileFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const FileDate = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const FileType = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.primary}20;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export const FileCard: React.FC<FileCardProps> = ({ file, onClick }) => {
  const handleClick = () => {
    onClick?.(file);
  };

  return (
    <StyledCard onClick={handleClick}>
      <FileHeader>
        <FileIcon category={file.category} size={32} />
        <FileInfo>
          <FileName title={file.name}>{file.name}</FileName>
          <FileSize>{formatFileSize(file.size)}</FileSize>
        </FileInfo>
      </FileHeader>

      <FileDescription>{file.description}</FileDescription>

      <FileFooter>
        <FileDate>
          Modified {format(new Date(file.dateModified), 'MMM d, yyyy')}
        </FileDate>
        <FileType>{file.extension}</FileType>
      </FileFooter>
    </StyledCard>
  );
};
