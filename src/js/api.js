/**
 * API functions for Google Drive integration
 */

// Configuration object - replace with your actual credentials
const config = {
  client_id: 'YOUR CLIENT ID',
  client_secret: 'YOUR CLIENT SECRET',
  refresh_token: 'YOUR REFRESH TOKEN',
  team_drive_id: 'YOUR TEAM DRIVE ID / ROOT'
};

/**
 * Gets an access token using the refresh token
 * @returns {Promise<string>} Access token
 */
export async function getAccessToken() {
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

/**
 * Gets details for a specific file
 * @param {string} fileId - ID of the file to get details for
 * @param {string} token - Access token
 * @returns {Promise<Object>} File details
 */
export async function getFileDetails(fileId, token) {
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

/**
 * Gets breadcrumb navigation data for a folder
 * @param {string} folderId - ID of the folder
 * @param {string} token - Access token
 * @returns {Promise<Array>} Breadcrumb data
 */
export async function getBreadcrumbs(folderId, token) {
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

/**
 * Lists files in a folder
 * @param {string} parent - ID of the parent folder
 * @param {string} token - Access token
 * @returns {Promise<Array>} List of files
 */
export async function listFiles(parent, token) {
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