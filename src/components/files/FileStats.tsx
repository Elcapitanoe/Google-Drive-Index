import React from 'react';
import styled from 'styled-components';
import { FileStats as FileStatsType } from '../../types';
import { Card } from '../common/Card';

interface FileStatsProps {
  stats: FileStatsType;
}

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export const FileStats: React.FC<FileStatsProps> = ({ stats }) => {
  return (
    <StatsContainer>
      <StatCard>
        <StatValue>{stats.totalFiles.toLocaleString()}</StatValue>
        <StatLabel>Total Files</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{formatFileSize(stats.totalSize)}</StatValue>
        <StatLabel>Total Size</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{stats.typeDistribution.document || 0}</StatValue>
        <StatLabel>Documents</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{stats.typeDistribution.image || 0}</StatValue>
        <StatLabel>Images</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{stats.typeDistribution.code || 0}</StatValue>
        <StatLabel>Code Files</StatLabel>
      </StatCard>

      <StatCard>
        <StatValue>{stats.typeDistribution.data || 0}</StatValue>
        <StatLabel>Data Files</StatLabel>
      </StatCard>
    </StatsContainer>
  );
};
