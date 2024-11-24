function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
}

const config = {
  client_id: 'YOUR CLIENT ID',
  client_secret: 'YOUT CLIENT SECRET',
  refresh_token: 'YOUR REFRESH TOKEN',
  team_drive_id: 'YOUR TIME DRIVE ID / ROOT'
};

function renderContent(files) {
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

const html = (files, breadcrumbs = []) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PAMBI Drive</title>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
  <style>
    :root {
      --bg-primary: #1a1b1e;
      --bg-secondary: #2c2e33;
      --text-primary: #ffffff;
      --text-secondary: #a1a1aa;
      --accent: #3b82f6;
      --hover: #374151;
      --border: #374151;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body { 
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    html, body {
      height: 100%;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .header {
      background: var(--bg-secondary);
      padding: 1.5rem;
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .header h1 {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .breadcrumb {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .breadcrumb a {
      color: var(--accent);
      text-decoration: none;
      transition: color 0.2s;
    }

    .breadcrumb a:hover {
      color: var(--text-primary);
    }

    .breadcrumb-separator {
      color: var(--text-secondary);
    }

    .files-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .file-card {
      background: var(--bg-secondary);
      border-radius: 8px;
      padding: 1rem;
      transition: all 0.2s;
      text-decoration: none;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      border: 1px solid var(--border);
      overflow: hidden;
      flex-wrap: nowrap;
    }
    
    .file-info {
      flex: 1;
      min-width: 0;
      overflow: hidden;
    }
    
    .file-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    .file-card:hover {
      transform: translateY(-2px);
      background: var(--hover);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .file-icon {
      font-size: 1.5rem;
      color: var(--accent);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 8px;
    }

    .error {
      color: #ef4444;
      padding: 2rem;
      text-align: center;
      background: var(--bg-secondary);
      border-radius: 8px;
      margin-top: 2rem;
    }

    .content {
      flex: 1;
      padding: 20px;
    }
    
    .footer {
      background-color: #1A1B1E;
      color: #fff;
      text-align: center;
      padding: 10px 0;
    }

    /* File viewer styles */
    .file-viewer {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
    }

    .file-viewer-header {
      margin-bottom: 2rem;
    }

    .file-details {
      display: grid;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      border-bottom: 1px solid var(--border);
    }

    .detail-label {
      color: var(--text-secondary);
    }

    .detail-value {
      color: var(--text-primary);
      word-break: break-all;
    }

    .action-buttons {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    .action-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .action-button:hover {
      opacity: 0.9;
    }

    .copy-button {
      background: var(--bg-primary);
      border: 1px solid var(--border);
    }

    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--accent);
      color: white;
      padding: 1rem 2rem;
      border-radius: 6px;
      display: none;
      animation: fadeIn 0.3s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(1rem); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .container {
        padding: 1rem;
      }

      .header {
        padding: 1rem;
      }

      .files-grid {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
      }

      .file-viewer {
        padding: 1rem;
      }
    }

    .image-container {
      width: 185px;
      height: 158px;
      overflow: hidden;
      position: relative;
    }

    .image-container img {
      position: absolute;
      top: 35px;
      left: 0px;
    }

    @media (max-width: 640px) {
      .header h1 {
        font-size: 1.4rem;
      }
      
      .breadcrumb {
        font-size: 0.8rem;
      }
      
      .file-name {
        font-size: 0.9rem;
      }
      
      .file-viewer-header h2 {
        font-size: 1.2rem;
        word-break: break-word;
      }
      
      .detail-label,
      .detail-value {
        font-size: 0.85rem;
      }
    }
    
    .breadcrumb {
      max-width: 100%;
    }
    
    .breadcrumb a {
      max-width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      vertical-align: middle;
    }
    
    .file-viewer-header h2 {
      word-break: break-word;
      line-height: 1.4;
    }
    
    .file-details {
      word-break: break-word;
    }
    
    .detail-item {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 1rem;
      padding: 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    
    @media (max-width: 640px) {
      .detail-item {
        grid-template-columns: 100px 1fr;
        gap: 0.5rem;
      }
    }
  </style>
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
<script>
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('URL copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy URL');
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}
</script>

</body>
</html>
`;

function renderContent(files) {
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

async function getAccessToken() {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: config.client_id,
        client_secret: config.client_secret,
        refresh_token: config.refresh_token,
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const result = await response.json();
    return result.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

async function getFileDetails(fileId, token) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?fields=id,name,mimeType,size,createdTime,modifiedTime,md5Checksum&supportsAllDrives=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get file details');
    }

    const file = await response.json();
    return {
      ...file,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`
    };
  } catch (error) {
    console.error('Error getting file details:', error);
    throw error;
  }
}

async function getBreadcrumbs(folderId, token) {
  const breadcrumbs = [];
  let currentId = folderId;

  while (currentId && currentId !== 'root') {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${currentId}?fields=name,parents&supportsAllDrives=true`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) break;

      const result = await response.json();
      breadcrumbs.unshift({
        name: result.name,
        path: `/${currentId}`
      });

      currentId = result.parents ? result.parents[0] : null;
      if (currentId === config.team_drive_id) break;
    } catch (error) {
      console.error('Error building breadcrumbs:', error);
      break;
    }
  }

  return breadcrumbs;
}

async function listFiles(parent, token) {
  try {
    let url = 'https://www.googleapis.com/drive/v3/files';
    let query = '';

    if (parent === 'root') {
      query = `'${config.team_drive_id}' in parents and trashed = false`;
    } else {
      query = `'${parent}' in parents and trashed = false`;
    }

    const params = new URLSearchParams({
      q: query,
      fields: 'files(id,name,mimeType,size,createdTime,modifiedTime,trashed)',
      orderBy: 'folder,name',
      pageSize: '1000',
      includeItemsFromAllDrives: 'true',
      supportsAllDrives: 'true',
      corpora: 'drive',
      driveId: config.team_drive_id
    });

    const response = await fetch(
      `${url}?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to list files');
    }

    const result = await response.json();
    
    if (!result.files) {
      return [];
    }

    return result.files
      .filter(file => !file.trashed)
      .map(file => ({
        id: file.id,
        name: file.name,
        mimeType: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : file.mimeType,
        size: file.size,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        link: file.mimeType === 'application/vnd.google-apps.folder' 
          ? `/${file.id}`
          : `https://drive.google.com/uc?export=download&id=${file.id}`
      }));
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
}

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const path = url.pathname;
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Failed to obtain access token');
    }

    if (path.startsWith('/view/')) {
      const fileId = path.slice(6);
      const [fileDetails, breadcrumbs] = await Promise.all([
        getFileDetails(fileId, token),
        getBreadcrumbs(fileId, token)
      ]);

      return new Response(html({ viewFile: fileDetails }, breadcrumbs), {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'no-cache'
        }
      });
    }

    const folderId = path === '/' ? 'root' : path.slice(1);
    const [files, breadcrumbs] = await Promise.all([
      listFiles(folderId, token),
      getBreadcrumbs(folderId, token)
    ]);
    
    return new Response(html(files, breadcrumbs), {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (err) {
    console.error('Request handling error:', err);
    return new Response(html([], []) + `<div class="error">Error: ${err.message}</div>`, {
      status: 500,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8'
      }
    });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});