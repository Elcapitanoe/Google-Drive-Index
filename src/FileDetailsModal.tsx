import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  ExternalLink,
  Copy,
  Check,
  HardDrive,
  Calendar,
  FileCode,
  Tag,
} from 'lucide-react';
import type { DriveItem } from './types';
import { FileIcon } from './FileIcon';
import { formatBytes, formatDateTime } from './utils';

interface FileDetailsModalProps {
  item: DriveItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FileDetailsModal: React.FC<FileDetailsModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopiedLink(false);
      setCopiedId(false);

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
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const handleCopyLink = async () => {
    if (!item.downloadUrl) return;
    try {
      await navigator.clipboard.writeText(item.downloadUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(item.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container file-details-modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-modal-title"
      >
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-file-icon-wrap">
              <FileIcon type={item.iconType} size={20} />
            </div>
            <h2
              id="file-modal-title"
              className="modal-title file-title-truncate"
              title={item.name}
            >
              {item.name}
            </h2>
          </div>
          <button
            type="button"
            className="action-btn icon-only"
            onClick={onClose}
            aria-label="Close file details"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">
                <HardDrive size={13} />
                <span>Size</span>
              </div>
              <div className="detail-value">
                <strong>{formatBytes(item.size)}</strong>
                {item.size !== undefined && (
                  <span className="detail-subvalue">
                    ({item.size.toLocaleString()} bytes)
                  </span>
                )}
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Calendar size={13} />
                <span>Last Modified</span>
              </div>
              <div className="detail-value">
                <span>{formatDateTime(item.modifiedTime)}</span>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Tag size={13} />
                <span>MIME Type</span>
              </div>
              <div className="detail-value font-mono">
                <code>{item.mimeType}</code>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <FileCode size={13} />
                <span>Drive File ID</span>
              </div>
              <div className="detail-value flex-between">
                <code className="font-mono text-xs truncate">{item.id}</code>
                <button
                  type="button"
                  className="action-btn icon-only small-btn"
                  onClick={handleCopyId}
                  title="Copy File ID"
                >
                  {copiedId ? (
                    <Check size={13} className="text-success" />
                  ) : (
                    <Copy size={13} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {item.webViewLink && (
            <a
              href={item.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn secondary-btn"
            >
              <ExternalLink size={14} />
              <span>Open in Drive</span>
            </a>
          )}

          {item.downloadUrl && (
            <button
              type="button"
              className="action-btn secondary-btn"
              onClick={handleCopyLink}
            >
              {copiedLink ? (
                <Check size={14} className="text-success" />
              ) : (
                <Copy size={14} />
              )}
              <span>{copiedLink ? 'Link Copied' : 'Copy Link'}</span>
            </button>
          )}

          {item.downloadUrl && (
            <a
              href={item.downloadUrl}
              download={item.name}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn primary-btn"
            >
              <Download size={14} />
              <span>Download File</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
