import React, { useState, useEffect, useMemo } from 'react';
import {
  HardDrive,
  Search,
  LayoutGrid,
  List,
  Download,
  Folder,
  ArrowUpDown,
  RefreshCw,
  Settings,
  ChevronRight,
  ExternalLink,
  Info,
} from 'lucide-react';
import type { DriveItem, BreadcrumbItem, ViewMode, SortField, SortOrder } from './types';
import { formatBytes, formatDate } from './utils';
import { fetchFolderContents, getStoredConfig, DriveConfig } from './api';
import { FileIcon } from './FileIcon';
import { SettingsModal } from './SettingsModal';

export const App: React.FC = () => {
  const [config, setConfig] = useState<DriveConfig>(getStoredConfig);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: config.rootFolderId || 'root', name: 'Root' },
  ]);
  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  const [items, setItems] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const loadFolder = async (folderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFolderContents(folderId, config);
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolder(currentFolderId);
  }, [currentFolderId, config]);

  const handleNavigate = (folderId: string, folderName: string) => {
    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
    setSearchTerm('');
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    setSearchTerm('');
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const displayedItems = useMemo(() => {
    let list = [...items];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;

      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        const sizeA = a.size || 0;
        const sizeB = b.size || 0;
        comparison = sizeA - sizeB;
      } else if (sortField === 'modifiedTime') {
        comparison = new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [items, searchTerm, sortField, sortOrder]);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <HardDrive size={16} />
            </div>
            <span>Google Drive Index</span>
          </div>

          <div className="header-actions">
            <button
              className="btn btn-ghost btn-icon"
              title="Refresh"
              onClick={() => loadFolder(currentFolderId)}
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={15} />
              <span>Configure</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main-wrapper">
        {!config.apiKey && (
          <div className="banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} />
              <span>
                Running in <strong>Demonstration Mode</strong> with mock fixtures. Set up a valid Google Drive API Key to index your real drives.
              </span>
            </div>
            <button
              className="btn btn-secondary"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
              onClick={() => setIsSettingsOpen(true)}
            >
              Set API Key
            </button>
          </div>
        )}

        {error && (
          <div className="banner error">
            <span>{error}</span>
            <button
              className="btn btn-ghost"
              style={{ padding: '0.2rem 0.5rem', color: '#fca5a5' }}
              onClick={() => loadFolder(currentFolderId)}
            >
              Retry
            </button>
          </div>
        )}

        <div className="toolbar">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id + idx}>
                  <button
                    className={`breadcrumb-btn ${isLast ? 'current' : ''}`}
                    onClick={() => handleBreadcrumbClick(idx)}
                    disabled={isLast}
                  >
                    {idx === 0 && <Folder size={14} />}
                    <span>{crumb.name}</span>
                  </button>
                  {!isLast && <ChevronRight size={14} className="breadcrumb-separator" />}
                </React.Fragment>
              );
            })}
          </nav>

          <div className="search-and-view">
            <div className="search-box">
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Filter files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="view-toggle">
              <button
                className={`btn-icon ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table view"
              >
                <List size={16} />
              </button>
              <button
                className={`btn-icon ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="file-explorer">
          {loading ? (
            <div className="state-container">
              <RefreshCw size={24} className="spin" />
              <div className="state-title">Loading drive contents...</div>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="state-container">
              <HardDrive size={32} />
              <div className="state-title">
                {searchTerm ? 'No matching files found' : 'This folder is empty'}
              </div>
            </div>
          ) : viewMode === 'table' ? (
            <table className="file-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => toggleSort('name')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>Name</span>
                      {sortField === 'name' && <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th className="sortable" style={{ width: '120px' }} onClick={() => toggleSort('size')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>Size</span>
                      {sortField === 'size' && <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th className="sortable" style={{ width: '160px' }} onClick={() => toggleSort('modifiedTime')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>Last Modified</span>
                      {sortField === 'modifiedTime' && <ArrowUpDown size={12} />}
                    </div>
                  </th>
                  <th style={{ width: '80px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedItems.map((item) => (
                  <tr key={item.id} className="file-row">
                    <td>
                      <div className="file-name-cell">
                        <FileIcon type={item.iconType} />
                        {item.isFolder ? (
                          <button
                            className="file-name-btn"
                            onClick={() => handleNavigate(item.id, item.name)}
                          >
                            {item.name}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                        )}
                      </div>
                    </td>
                    <td>{formatBytes(item.size)}</td>
                    <td>{formatDate(item.modifiedTime)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {item.downloadUrl && !item.isFolder && (
                        <a
                          href={item.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-icon"
                          title="Download / Open direct link"
                        >
                          <Download size={14} />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="file-grid">
              {displayedItems.map((item) => (
                <div
                  key={item.id}
                  className="grid-card"
                  onClick={() => {
                    if (item.isFolder) {
                      handleNavigate(item.id, item.name);
                    }
                  }}
                >
                  <div className="grid-card-header">
                    <FileIcon type={item.iconType} size={24} />
                    {item.downloadUrl && !item.isFolder && (
                      <a
                        href={item.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-icon"
                        style={{ width: '24px', height: '24px' }}
                        onClick={(e) => e.stopPropagation()}
                        title="Download link"
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <div className="grid-card-title" title={item.name}>
                    {item.name}
                  </div>
                  <div className="grid-card-meta">
                    <span>{formatBytes(item.size)}</span>
                    <span>{formatDate(item.modifiedTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newCfg) => {
          setConfig(newCfg);
          setBreadcrumbs([{ id: newCfg.rootFolderId || 'root', name: 'Root' }]);
        }}
      />

      <footer className="footer">
        Google Drive Index &copy; {new Date().getFullYear()} &mdash; Minimalist, High-Performance File Gateway
      </footer>
    </div>
  );
};
export default App;
