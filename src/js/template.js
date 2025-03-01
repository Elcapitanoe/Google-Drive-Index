import { formatBytes, formatDate } from './utils.js';

/**
 * Renders the content section of the HTML based on files data
 * @param {Object|Array} files - File data to render
 * @returns {string} HTML content
 */
export function renderContent(files) {
  if (files.viewFile) {
    return `
      <div class="file-viewer">
        <div class="file-viewer-header">
          <h2>${files.viewFile.name}</h2>
        </div>
        <div class="file-details">
          <div class="detail-item">
            <span class="detail-label">File Name:</span>
            <span class="detail-value">${files.viewFile.name}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">File Type:</span>
            <span class="detail-value">${files.viewFile.mimeType}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Size:</span>
            <span class="detail-value">${formatBytes(files.viewFile.size)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Created:</span>
            <span class="detail-value">${formatDate(files.viewFile.createdTime)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Modified:</span>
            <span class="detail-value">${formatDate(files.viewFile.modifiedTime)}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">MD5 Checksum:</span>
            <span class="detail-value">${files.viewFile.md5Checksum || 'Not available'}</span>
          </div>
        </div>
        <div class="action-buttons">
          <a href="${files.viewFile.downloadUrl}" class="action-button" download>
            <i class="fas fa-download"></i>
            Download
          </a>
          <button onclick="copyToClipboard('${files.viewFile.downloadUrl}')" class="action-button copy-button">
            <i class="fas fa-copy"></i>
            Copy URL
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="files-grid">
      ${files && files.length > 0 ? 
        files.map(file => `
          <a class="file-card" href="${file.mimeType === 'folder' ? `/${file.id}` : `/view/${file.id}`}">
            <div class="file-icon">
              <i class="fas ${file.mimeType === 'folder' ? 'fa-folder' : 'fa-file'}"></i>
            </div>
            <div class="file-info">
              <div class="file-name">${file.name}</div>
            </div>
          </a>
        `).join('') : 
        '<div class="error">No files found in this folder</div>'
      }
    </div>
  `;
}

/**
 * Generates the complete HTML page
 * @param {Object|Array} files - File data to render
 * @param {Array} breadcrumbs - Breadcrumb navigation data
 * @returns {string} Complete HTML page
 */
export function generateHTML(files, breadcrumbs = []) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PAMBI Drive</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <link href="/styles/main.css" rel="stylesheet">
</head>
<body>
<div class="content">
  <div class="container">
    <div class="header">
      <h1>PAMBI Drive</h1>
      <nav class="breadcrumb">
        <a href="/">Home</a>
        ${breadcrumbs.map((crumb, index) => `
          <span class="breadcrumb-separator">/</span>
          <a href="${crumb.path}">${crumb.name}</a>
        `).join('')}
      </nav>
    </div>

    <div id="main-content">
      ${renderContent(files)}
    </div>
  </div>
</div>

<center>
<div class="footer">© 2025 PAMBI Drive. All rights reserved.</div>
</center>

<div id="toast" class="toast"></div>
<script src="/js/main.js"></script>
</body>
</html>
  `;
}