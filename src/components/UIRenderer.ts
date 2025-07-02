import { formatBytes, formatDate, sanitizeHtml } from '../utils/format';
import type { ProcessedFile, FileDetails, Breadcrumb } from '../types';

/**
 * UI rendering service
 */
export class UIRenderer {
  private static instance: UIRenderer;

  private constructor() {}

  static getInstance(): UIRenderer {
    if (!UIRenderer.instance) {
      UIRenderer.instance = new UIRenderer();
    }
    return UIRenderer.instance;
  }

  /**
   * Render folder view
   */
  renderFolderView(files: ProcessedFile[], breadcrumbs: Breadcrumb[]): void {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    this.updateBreadcrumbs(breadcrumbs);
    mainContent.innerHTML = this.renderFilesGrid(files);
  }

  /**
   * Render file view
   */
  renderFileView(file: FileDetails, breadcrumbs: Breadcrumb[]): void {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    this.updateBreadcrumbs(breadcrumbs);
    mainContent.innerHTML = this.renderFileViewer(file);
  }

  /**
   * Update breadcrumb navigation
   */
  private updateBreadcrumbs(breadcrumbs: Breadcrumb[]): void {
    const breadcrumbNav = document.querySelector('.breadcrumb');
    if (!breadcrumbNav) return;

    breadcrumbNav.innerHTML = this.renderBreadcrumbs(breadcrumbs);
  }

  /**
   * Render breadcrumb navigation
   */
  private renderBreadcrumbs(breadcrumbs: Breadcrumb[]): string {
    const homeLink = '<a href="/" data-nav="/">Home</a>';
    
    if (!breadcrumbs.length) {
      return homeLink;
    }

    const crumbLinks = breadcrumbs.map(crumb => `
      <span class="breadcrumb-separator">/</span>
      <a href="${crumb.path}" data-nav="${crumb.path}" title="${sanitizeHtml(crumb.name)}">
        ${sanitizeHtml(crumb.name)}
      </a>
    `).join('');

    return homeLink + crumbLinks;
  }

  /**
   * Render files grid
   */
  private renderFilesGrid(files: ProcessedFile[]): string {
    if (!files.length) {
      return '<div class="error">No files found in this folder</div>';
    }

    return `
      <div class="files-grid">
        ${files.map(file => this.renderFileCard(file)).join('')}
      </div>
    `;
  }

  /**
   * Render a single file card
   */
  private renderFileCard(file: ProcessedFile): string {
    const isFolder = file.mimeType === 'folder';
    const href = isFolder ? `/${file.id}` : `/view/${file.id}`;
    const iconClass = isFolder ? 'fa-folder' : 'fa-file';

    return `
      <a class="file-card" href="${href}" ${isFolder ? '' : 'data-file-id="' + file.id + '"'}>
        <div class="file-icon">
          <i class="fas ${iconClass}" aria-hidden="true"></i>
        </div>
        <div class="file-info">
          <div class="file-name" title="${sanitizeHtml(file.name)}">
            ${sanitizeHtml(file.name)}
          </div>
          ${file.size ? `<div class="file-size">${formatBytes(file.size)}</div>` : ''}
        </div>
      </a>
    `;
  }

  /**
   * Render file viewer
   */
  private renderFileViewer(file: FileDetails): string {
    const details = [
      { label: 'File Name', value: sanitizeHtml(file.name) },
      { label: 'File Type', value: sanitizeHtml(file.mimeType) },
      { label: 'Size', value: formatBytes(file.size) },
      { label: 'Created', value: formatDate(file.createdTime) },
      { label: 'Modified', value: formatDate(file.modifiedTime) },
      { label: 'MD5 Checksum', value: file.md5Checksum || 'Not available' },
    ];

    return `
      <div class="file-viewer">
        <div class="file-viewer-header">
          <h2>${sanitizeHtml(file.name)}</h2>
        </div>
        <div class="file-details">
          ${details.map(detail => `
            <div class="detail-item">
              <span class="detail-label">${detail.label}:</span>
              <span class="detail-value">${detail.value}</span>
            </div>
          `).join('')}
        </div>
        <div class="action-buttons">
          <a href="${file.downloadUrl}" class="action-button" download>
            <i class="fas fa-download" aria-hidden="true"></i>
            Download
          </a>
          <button 
            onclick="window.clipboardManager?.copyToClipboard('${file.downloadUrl}')" 
            class="action-button copy-button"
            type="button"
          >
            <i class="fas fa-copy" aria-hidden="true"></i>
            Copy URL
          </button>
        </div>
      </div>
    `;
  }
}