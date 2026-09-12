import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  HardDrive,
  Search,
  LayoutGrid,
  List,
  Download,
  Folder,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Settings,
  ChevronRight,
  Sun,
  Moon,
  X,
  Copy,
  Check,
  Info,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import type {
  DriveItem,
  BreadcrumbItem,
  ViewMode,
  SortField,
  SortOrder,
  ThemeMode,
  FolderStats,
} from './types';
import { formatBytes, formatDate } from './utils';
import {
  fetchFolderContents,
  getStoredConfig,
  clearFolderCache,
  type DriveConfig,
} from './api';
import { FileIcon } from './FileIcon';
import { SettingsModal } from './SettingsModal';
import { FileDetailsModal } from './FileDetailsModal';

const THEME_STORAGE_KEY = 'gdrive_theme_preference';

function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    // Fallback on error
  }
  return 'dark';
}

export const App: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [config, setConfig] = useState<DriveConfig>(getStoredConfig);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<DriveItem | null>(null);

  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: config.rootFolderId || 'root', name: 'Drive' },
  ]);
  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  const [items, setItems] = useState<DriveItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Apply theme class to document element
  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignored
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const loadFolder = useCallback(
    async (folderId: string, bypassCache = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const data = await fetchFolderContents(
          folderId,
          config,
          controller.signal,
          bypassCache
        );
        if (!controller.signal.aborted) {
          setItems(data);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to fetch directory contents.';
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [config]
  );

  useEffect(() => {
    loadFolder(currentFolder.id);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentFolder.id, loadFolder]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputActive =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      if (e.key === '/' && !isInputActive && !isSettingsOpen && !selectedFile) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (searchTerm) {
          setSearchTerm('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, selectedFile, searchTerm]);

  const handleNavigate = (folderId: string, folderName: string) => {
    setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
    setSearchTerm('');
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbs(prev => prev.slice(0, index + 1));
    setSearchTerm('');
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleCopyLink = async (e: React.MouseEvent, item: DriveItem) => {
    e.stopPropagation();
    if (!item.downloadUrl) return;

    try {
      await navigator.clipboard.writeText(item.downloadUrl);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const stats: FolderStats = useMemo(() => {
    let folders = 0;
    let files = 0;
    let totalBytes = 0;

    for (const item of items) {
      if (item.isFolder) {
        folders++;
      } else {
        files++;
        if (item.size) totalBytes += item.size;
      }
    }

    return { folders, files, totalBytes };
  }, [items]);

  const displayedItems = useMemo(() => {
    let list = [...items];
    const q = searchTerm.trim().toLowerCase();

    if (q) {
      list = list.filter(i => i.name.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      // Folders always pinned to top
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;

      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      } else if (sortField === 'size') {
        const sizeA = a.size || 0;
        const sizeB = b.size || 0;
        comparison = sizeA - sizeB;
      } else if (sortField === 'modifiedTime') {
        comparison =
          new Date(a.modifiedTime).getTime() -
          new Date(b.modifiedTime).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [items, searchTerm, sortField, sortOrder]);

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="sort-icon-inactive" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} className="sort-icon-active" />
    ) : (
      <ArrowDown size={12} className="sort-icon-active" />
    );
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-badge">
              <HardDrive size={15} />
            </div>
            <div className="brand-details">
              <span className="brand-title">Google Drive Index</span>
              <span className="brand-status-tag">Gateway</span>
            </div>
          </div>

          <div className="header-actions-group">
            <button
              type="button"
              className="action-btn icon-only"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              type="button"
              className="action-btn icon-only"
              onClick={() => {
                clearFolderCache(currentFolder.id);
                loadFolder(currentFolder.id, true);
              }}
              disabled={loading}
              aria-label="Refresh directory"
              title="Refresh directory"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            </button>

            <button
              type="button"
              className="action-btn secondary-btn"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={14} />
              <span className="action-btn-text">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main">
        {/* Environment Notices */}
        {!config.apiKey && (
          <aside className="notice-banner info-banner" role="status">
            <div className="notice-content">
              <Info size={16} className="notice-icon text-info" />
              <div className="notice-text">
                <span className="notice-headline">Demonstration Mode:</span>
                <span className="notice-desc">
                  Displaying simulated drive fixtures. Configure a Google Drive
                  API Key to index your real folders.
                </span>
              </div>
            </div>
            <button
              type="button"
              className="action-btn text-btn compact"
              onClick={() => setIsSettingsOpen(true)}
            >
              Configure Key
            </button>
          </aside>
        )}

        {error && (
          <aside className="notice-banner error-banner" role="alert">
            <div className="notice-content">
              <AlertCircle size={16} className="notice-icon text-danger" />
              <div className="notice-text">
                <span className="notice-headline">Fetch Failed:</span>
                <span className="notice-desc">{error}</span>
              </div>
            </div>
            <button
              type="button"
              className="action-btn text-btn compact danger-hover"
              onClick={() => loadFolder(currentFolder.id, true)}
            >
              Retry
            </button>
          </aside>
        )}

        {/* Toolbar: Breadcrumbs, Search, View Controls */}
        <section className="app-toolbar" aria-label="Directory Toolbar">
          <nav className="breadcrumb-nav" aria-label="Breadcrumb hierarchy">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={`${crumb.id}-${idx}`} className="breadcrumb-step">
                  <button
                    type="button"
                    className={`breadcrumb-node ${isLast ? 'active' : ''}`}
                    onClick={() => handleBreadcrumbClick(idx)}
                    disabled={isLast}
                    title={crumb.name}
                  >
                    {idx === 0 && (
                      <Folder size={13} className="breadcrumb-root-icon" />
                    )}
                    <span className="breadcrumb-name">{crumb.name}</span>
                  </button>
                  {!isLast && (
                    <ChevronRight
                      size={13}
                      className="breadcrumb-divider"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="toolbar-controls">
            <div className="search-wrapper">
              <Search
                size={14}
                className="search-prefix-icon"
                aria-hidden="true"
              />
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder="Filter files (press '/' to focus)..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                spellCheck="false"
                autoComplete="off"
              />
              {searchTerm && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setSearchTerm('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear filter"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            <div
              className="view-mode-switch"
              role="group"
              aria-label="View format"
            >
              <button
                type="button"
                className={`switch-option ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
                title="Table view"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                className={`switch-option ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </section>

        {/* File Explorer Container */}
        <section className="explorer-card" aria-label="File Explorer">
          {loading ? (
            <div className="state-placeholder">
              <RefreshCw size={26} className="animate-spin text-accent" />
              <p className="state-title">Indexing folder contents...</p>
              <p className="state-subtitle">
                Querying Google Drive v3 REST API
              </p>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="state-placeholder">
              <HardDrive size={34} className="state-empty-icon" />
              <p className="state-title">
                {searchTerm ? 'No matching files found' : 'Directory is empty'}
              </p>
              <p className="state-subtitle">
                {searchTerm
                  ? `No items match the filter query "${searchTerm}".`
                  : 'This folder contains no sub-folders or downloadable files.'}
              </p>
              {searchTerm && (
                <button
                  type="button"
                  className="action-btn secondary-btn mt-2"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Filter
                </button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <div className="table-responsive-wrapper">
              <table className="explorer-table">
                <thead>
                  <tr>
                    <th
                      className="col-name sortable-header"
                      onClick={() => toggleSort('name')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="header-cell-inner">
                        <span>Name</span>
                        {renderSortIndicator('name')}
                      </div>
                    </th>
                    <th
                      className="col-size sortable-header"
                      onClick={() => toggleSort('size')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="header-cell-inner">
                        <span>Size</span>
                        {renderSortIndicator('size')}
                      </div>
                    </th>
                    <th
                      className="col-date sortable-header"
                      onClick={() => toggleSort('modifiedTime')}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="header-cell-inner">
                        <span>Modified</span>
                        {renderSortIndicator('modifiedTime')}
                      </div>
                    </th>
                    <th className="col-actions text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedItems.map(item => (
                    <tr
                      key={item.id}
                      className={`explorer-row ${item.isFolder ? 'folder-row' : 'file-row'}`}
                      onClick={() => {
                        if (item.isFolder) {
                          handleNavigate(item.id, item.name);
                        } else {
                          setSelectedFile(item);
                        }
                      }}
                    >
                      <td className="col-name">
                        <div className="file-identity-cell">
                          <span className="file-icon-box" aria-hidden="true">
                            <FileIcon type={item.iconType} size={16} />
                          </span>
                          <span className="file-primary-name" title={item.name}>
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="col-size font-mono">
                        {formatBytes(item.size)}
                      </td>
                      <td className="col-date font-mono">
                        {formatDate(item.modifiedTime)}
                      </td>
                      <td
                        className="col-actions text-right"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="row-actions-group">
                          {!item.isFolder && item.downloadUrl && (
                            <>
                              <button
                                type="button"
                                className="action-btn icon-only small-btn"
                                onClick={e => handleCopyLink(e, item)}
                                title={
                                  copiedId === item.id
                                    ? 'Link copied!'
                                    : 'Copy download link'
                                }
                                aria-label="Copy download link"
                              >
                                {copiedId === item.id ? (
                                  <Check size={13} className="text-success" />
                                ) : (
                                  <Copy size={13} />
                                )}
                              </button>
                              <a
                                href={item.downloadUrl}
                                download={item.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn icon-only small-btn"
                                title="Download file"
                                aria-label="Download file"
                              >
                                <Download size={13} />
                              </a>
                            </>
                          )}
                          {!item.isFolder && (
                            <button
                              type="button"
                              className="action-btn icon-only small-btn"
                              onClick={() => setSelectedFile(item)}
                              title="Inspect file details"
                              aria-label="Inspect file details"
                            >
                              <FileCode size={13} />
                            </button>
                          )}
                          {item.isFolder && (
                            <button
                              type="button"
                              className="action-btn text-btn compact folder-open-hint"
                              onClick={() => handleNavigate(item.id, item.name)}
                            >
                              <span>Open</span>
                              <ChevronRight size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="explorer-grid">
              {displayedItems.map(item => (
                <div
                  key={item.id}
                  className={`grid-tile ${item.isFolder ? 'folder-tile' : 'file-tile'}`}
                  onClick={() => {
                    if (item.isFolder) {
                      handleNavigate(item.id, item.name);
                    } else {
                      setSelectedFile(item);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="grid-tile-top">
                    <div className="grid-tile-icon-box">
                      <FileIcon type={item.iconType} size={20} />
                    </div>
                    <div
                      className="grid-tile-quick-actions"
                      onClick={e => e.stopPropagation()}
                    >
                      {!item.isFolder && item.downloadUrl && (
                        <>
                          <button
                            type="button"
                            className="action-btn icon-only micro-btn"
                            onClick={e => handleCopyLink(e, item)}
                            title={
                              copiedId === item.id ? 'Link copied' : 'Copy link'
                            }
                          >
                            {copiedId === item.id ? (
                              <Check size={12} className="text-success" />
                            ) : (
                              <Copy size={12} />
                            )}
                          </button>
                          <a
                            href={item.downloadUrl}
                            download={item.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn icon-only micro-btn"
                            title="Download file"
                          >
                            <Download size={12} />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid-tile-body">
                    <span className="grid-tile-title" title={item.name}>
                      {item.name}
                    </span>
                  </div>

                  <div className="grid-tile-footer font-mono">
                    <span>{formatBytes(item.size)}</span>
                    <span>{formatDate(item.modifiedTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Directory Summary / Status Bar */}
          {!loading && displayedItems.length > 0 && (
            <div className="explorer-status-bar font-mono">
              <div className="status-bar-left">
                <span>
                  {stats.folders} {stats.folders === 1 ? 'folder' : 'folders'},{' '}
                  {stats.files} {stats.files === 1 ? 'file' : 'files'}
                </span>
                {stats.totalBytes > 0 && (
                  <>
                    <span className="status-separator">-</span>
                    <span>Total size: {formatBytes(stats.totalBytes)}</span>
                  </>
                )}
              </div>
              {searchTerm && (
                <div className="status-bar-right">
                  <span>
                    Showing {displayedItems.length} of {items.length} items
                  </span>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        config={config}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={newCfg => {
          setConfig(newCfg);
          setBreadcrumbs([
            { id: newCfg.rootFolderId || 'root', name: 'Drive' },
          ]);
        }}
      />

      {/* File Details Modal */}
      <FileDetailsModal
        item={selectedFile}
        isOpen={selectedFile !== null}
        onClose={() => setSelectedFile(null)}
      />

      {/* Footer */}
      <footer className="app-footer font-mono">
        <div className="footer-container">
          <span>Google Drive Index</span>
          <span className="footer-divider">-</span>
          <span>Zero-overhead direct client gateway</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
