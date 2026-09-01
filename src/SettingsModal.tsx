import React, { useState } from 'react';
import { Settings, X, Key, FolderGit2 } from 'lucide-react';
import { DriveConfig, saveStoredConfig } from './api';

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
  const [apiKey, setApiKey] = useState(config.apiKey || '');
  const [rootFolderId, setRootFolderId] = useState(config.rootFolderId || 'root');

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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} />
            <h2 className="modal-title">Drive API Configuration</h2>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="apiKey">
                Google Drive API Key
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="apiKey"
                  type="password"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2rem' }}
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Key size={14} style={{ position: 'absolute', left: '0.625rem', color: 'var(--text-muted)' }} />
              </div>
              <span className="form-hint">
                Google Cloud Console API key with Drive API v3 enabled.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rootFolderId">
                Root Folder ID
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="rootFolderId"
                  type="text"
                  className="form-input"
                  style={{ width: '100%', paddingLeft: '2rem' }}
                  placeholder="root or folder ID"
                  value={rootFolderId}
                  onChange={(e) => setRootFolderId(e.target.value)}
                />
                <FolderGit2 size={14} style={{ position: 'absolute', left: '0.625rem', color: 'var(--text-muted)' }} />
              </div>
              <span className="form-hint">
                Target Google Drive folder ID or "root".
              </span>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
