import { useState, useMemo, useCallback } from 'react';
import { FileMetadata, FileFilter, FileStats } from '../types';
import { generateMockFiles } from '../data/mockFiles';

export const useFiles = () => {
  const [files] = useState<FileMetadata[]>(() => generateMockFiles(100));
  const [filter, setFilter] = useState<FileFilter>({
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const filteredFiles = useMemo(() => {
    let result = [...files];

    // Apply type filter
    if (filter.type) {
      result = result.filter(file => file.type === filter.type);
    }

    // Apply category filter
    if (filter.category) {
      result = result.filter(file => file.category === filter.category);
    }

    // Apply search filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(
        file =>
          file.name.toLowerCase().includes(searchLower) ||
          file.description.toLowerCase().includes(searchLower) ||
          file.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    if (filter.sortBy) {
      result.sort((a, b) => {
        let aValue: any = a[filter.sortBy!];
        let bValue: any = b[filter.sortBy!];

        if (
          filter.sortBy === 'dateCreated' ||
          filter.sortBy === 'dateModified'
        ) {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return filter.sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return filter.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [files, filter]);

  const stats = useMemo((): FileStats => {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    const typeDistribution = files.reduce(
      (acc, file) => {
        acc[file.type] = (acc[file.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const categoryDistribution = files.reduce(
      (acc, file) => {
        acc[file.category] = (acc[file.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalFiles,
      totalSize,
      typeDistribution: typeDistribution as any,
      categoryDistribution: categoryDistribution as any,
    };
  }, [files]);

  const updateFilter = useCallback((newFilter: Partial<FileFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  }, []);

  const clearFilter = useCallback(() => {
    setFilter({
      sortBy: 'name',
      sortOrder: 'asc',
    });
  }, []);

  return {
    files: filteredFiles,
    allFiles: files,
    filter,
    stats,
    updateFilter,
    clearFilter,
  };
};
