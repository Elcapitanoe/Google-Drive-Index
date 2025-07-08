import React from 'react';
import styled from 'styled-components';
import { FileMetadata } from '../../types';
import { FileCard } from './FileCard';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface FileGridProps {
  files: FileMetadata[];
  loading?: boolean;
  onFileClick?: (file: FileMetadata) => void;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textMuted};
  grid-column: 1 / -1;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

export const FileGrid: React.FC<FileGridProps> = ({ 
  files, 
  loading = false, 
  onFileClick 
}) => {
  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (files.length === 0) {
    return (
      <GridContainer>
        <EmptyState>
          <EmptyTitle>No files found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your search criteria or filters to find what you're looking for.
          </EmptyDescription>
        </EmptyState>
      </GridContainer>
    );
  }

  return (
    <GridContainer>
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onClick={onFileClick}
        />
      ))}
    </GridContainer>
  );
};