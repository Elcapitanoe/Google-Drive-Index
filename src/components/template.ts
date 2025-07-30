import { formatBytes, formatDate, sanitizeHtml } from '@/utils/format';
import type {
  ContentData,
  Breadcrumb,
  ViewFileData,
  ProcessedFile,
} from '@/types';

/**
 * Template rendering service
 */
export class TemplateRenderer {
  private static instance: TemplateRenderer;

  private constructor() {}

  static getInstance(): TemplateRenderer {
    if (!TemplateRenderer.instance) {
      TemplateRenderer.instance = new TemplateRenderer();
    }
    return TemplateRenderer.instance;
  }

  /**
   * Renders the content section based on data type
   */
  renderContent(data: ContentData): string {
    if (this.isViewFileData(data)) {
      return this.renderFileViewer(data.viewFile);
    }
    return this.renderFilesGrid(data);
  }

  /**
   * Type guard to check if data is ViewFileData
   */
  private isViewFileData(data: ContentData): data is ViewFileData {
    return 'viewFile' in data;
  }

  /**
   * Renders the file viewer component
   */
  private renderFileViewer(file: ViewFileData['viewFile']): string {
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
          ${details
            .map(
              detail => `
            <div class="detail-item">
              <span class="detail-label">${detail.label}:</span>
              <span class="detail-value">${detail.value}</span>
            </div>
          `
            )
            .join('')}
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

  /**
   * Renders the files grid component
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
   * Renders a single file card
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
        </div>
      </a>
    `;
  }

  /**
   * Renders breadcrumb navigation
   */
  private renderBreadcrumbs(breadcrumbs: Breadcrumb[]): string {
    const homeLink = '<a href="/">Home</a>';

    if (!breadcrumbs.length) {
      return homeLink;
    }

    const crumbLinks = breadcrumbs
      .map(
        crumb => `
      <span class="breadcrumb-separator">/</span>
      <a href="${crumb.path}" title="${sanitizeHtml(crumb.name)}">
        ${sanitizeHtml(crumb.name)}
      </a>
    `
      )
      .join('');

    return homeLink + crumbLinks;
  }

  /**
   * Generates the complete HTML page
   */
  generateHTML(data: ContentData, breadcrumbs: Breadcrumb[] = []): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="PAMBI Drive - Simple Google Drive file index">
  <title>PAMBI Drive</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet" crossorigin="anonymous">
  <link href="/styles/main.css" rel="stylesheet">
</head>
<body>
  <div class="content">
    <div class="container">
      <header class="header">
        <h1>PAMBI Drive</h1>
        <nav class="breadcrumb" aria-label="Breadcrumb navigation">
          ${this.renderBreadcrumbs(breadcrumbs)}
        </nav>
      </header>

      <main id="main-content">
        ${this.renderContent(data)}
      </main>
    </div>
  </div>

  <footer class="footer">
    <div class="footer-content">
      © 2025 PAMBI Drive. All rights reserved.
    </div>
  </footer>

  <div id="toast" class="toast" role="alert" aria-live="polite"></div>
  <script type="module" src="/js/main.js"></script>
</body>
</html>
    `;
  }
}
