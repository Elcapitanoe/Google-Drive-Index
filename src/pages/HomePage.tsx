import React, { useState } from 'react';
import styled from 'styled-components';
import { FileMetadata } from '../types';
import { useFiles } from '../hooks/useFiles';
import { FileStats } from '../components/files/FileStats';
import { FileFilters } from '../components/files/FileFilters';
import { FileGrid } from '../components/files/FileGrid';

const PageContainer = styled.div`
  width: 100%;
`;

const PageTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  }
`;

const ResultsInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ResultsCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SortInfo = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const HomePage: React.FC = () => {
  const { files, stats, filter, updateFilter, clearFilter } = useFiles();

  const handleFileClick = (file: FileMetadata) => {
    // In a real app, this might navigate to a file detail page
    console.log('File clicked:', file);
  };

  const getSortLabel = () => {
    const sortLabels = {
      name: 'Name',
      size: 'Size',
      dateCreated: 'Date Created',
      dateModified: 'Date Modified',
    };

    const sortLabel = sortLabels[filter.sortBy || 'name'];
    const orderLabel = filter.sortOrder === 'desc' ? 'descending' : 'ascending';

    return `${sortLabel} (${orderLabel})`;
  };

  return (
    <PageContainer>
      <PageTitle>File Manager</PageTitle>

      <FileStats stats={stats} />

      <FileFilters
        filter={filter}
        onFilterChange={updateFilter}
        onClearFilters={clearFilter}
      />

      <ResultsInfo>
        <ResultsCount>
          {files.length === 1
            ? '1 file found'
            : `${files.length.toLocaleString()} files found`}
        </ResultsCount>
        <SortInfo>Sorted by {getSortLabel()}</SortInfo>
      </ResultsInfo>

      <FileGrid files={files} onFileClick={handleFileClick} />
    </PageContainer>
  );
};
