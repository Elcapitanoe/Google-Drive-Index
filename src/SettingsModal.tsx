import React, { useState, useEffect, useRef } from 'react';
import { Settings, X, Key, FolderGit2, Trash2 } from 'lucide-react';
import { DriveConfig, saveStoredConfig, clearFolderCache } from './api';

interface SettingsModalProps {
  config: DriveConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: DriveConfig) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [rootFolderId, setRootFolderId] = useState(config.rootFolderId);
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(config.apiKey);
      setRootFolderId(config.rootFolderId);
      inputRef.current?.focus();

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, config, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: DriveConfig = {
      apiKey: apiKey.trim(),
      rootFolderId: rootFolderId.trim() || 'root',
    };
    saveStoredConfig(updated);
    onSave(updated);
    onClose();
  };

  const handleReset = () => {
    setApiKey('');
    setRootFolderId('root');
    clearFolderCache();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="modal-container"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Settings size={16} />
            </div>
            <h2 id="settings-modal-title" className="modal-title">
              Google Drive Configuration
            </h2>
          </div>
          <button
            type="button"
            className="action-btn icon-only"
            onClick={onClose}
            aria-label="Close configuration modal"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-body">
            <div className="field-group">
              <label className="field-label" htmlFor="gdrive-api-key">
                Google Cloud API Key
              </label>
              <div className="input-affix-wrapper">
                <span className="input-prefix-icon" aria-hidden="true">
                  <Key size={14} />
                </span>
                <input
                  ref={inputRef}
                  id="gdrive-api-key"
                  type="password"
                  autoComplete="off"
                  spellCheck="false"
                  className="text-input with-prefix"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                />
              </div>
              <p className="field-hint">
                Google Cloud Console API key with Google Drive API v3 enabled.
                Leave empty to use demonstration fixtures.
              </p>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="gdrive-root-folder">
                Root Folder ID
              </label>
              <div className="input-affix-wrapper">
                <span className="input-prefix-icon" aria-hidden="true">
                  <FolderGit2 size={14} />
                </span>
                <input
                  id="gdrive-root-folder"
                  type="text"
                  autoComplete="off"
                  spellCheck="false"
                  className="text-input with-prefix"
                  placeholder="root or 0B1234..."
                  value={rootFolderId}
                  onChange={e => setRootFolderId(e.target.value)}
                />
              </div>
              <p className="field-hint">
                Specific folder ID from Google Drive URL or leave
                &quot;root&quot; for the drive root. The folder must have
                sharing set to Anyone with the link.
              </p>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="action-btn text-btn danger-hover"
              onClick={handleReset}
              title="Reset configuration to defaults"
            >
              <Trash2 size={14} />
              <span>Reset</span>
            </button>
            <div className="modal-footer-actions">
              <button
                type="button"
                className="action-btn secondary-btn"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="action-btn primary-btn">
                Apply Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
