import React from 'react';
import styled from 'styled-components';
import { Search, X } from 'lucide-react';
import { FileFilter, FileType, FileCategory } from '../../types';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface FileFiltersProps {
  filter: FileFilter;
  onFilterChange: (filter: Partial<FileFilter>) => void;
  onClearFilters: () => void;
}

const FiltersContainer = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const SearchInput = styled(Input)`
  & input {
    padding-right: 2.5rem;
  }
`;

const typeOptions = [
  { value: '', label: 'All Types' },
  { value: 'document', label: 'Documents' },
  { value: 'image', label: 'Images' },
  { value: 'code', label: 'Code Files' },
  { value: 'data', label: 'Data Files' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'DOC' },
  { value: 'docx', label: 'DOCX' },
  { value: 'txt', label: 'TXT' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'svg', label: 'SVG' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'tsx', label: 'TSX' },
  { value: 'js', label: 'JavaScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
];

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'size', label: 'Size' },
  { value: 'dateCreated', label: 'Date Created' },
  { value: 'dateModified', label: 'Date Modified' },
];

export const FileFilters: React.FC<FileFiltersProps> = ({
  filter,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = !!(
    filter.searchTerm ||
    filter.type ||
    filter.category
  );

  return (
    <FiltersContainer>
      <FiltersGrid>
        <SearchInputWrapper>
          <SearchIcon>
            <Search size={16} />
          </SearchIcon>
          <SearchInput
            placeholder="Search files..."
            value={filter.searchTerm || ''}
            onChange={e => onFilterChange({ searchTerm: e.target.value })}
          />
        </SearchInputWrapper>

        <Select
          label="Type"
          options={typeOptions}
          value={filter.type || ''}
          onChange={value =>
            onFilterChange({ type: (value as FileType) || undefined })
          }
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={filter.category || ''}
          onChange={value =>
            onFilterChange({ category: (value as FileCategory) || undefined })
          }
        />

        <Select
          label="Sort by"
          options={sortOptions}
          value={filter.sortBy || 'name'}
          onChange={value =>
            onFilterChange({
              sortBy: value as FileFilter['sortBy'],
              sortOrder: filter.sortOrder || 'asc',
            })
          }
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            aria-label="Clear all filters"
          >
            <X size={16} />
          </Button>
        )}
      </FiltersGrid>
    </FiltersContainer>
  );
};
