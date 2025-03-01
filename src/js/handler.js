import { getAccessToken, getFileDetails, getBreadcrumbs, listFiles } from './api.js';
import { generateHTML } from './template.js';

/**
 * Handles CORS preflight requests
 * @returns {Response} CORS headers response
 */
export function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}

/**
 * Handles errors by returning an error page
 * @param {Error} error - The error that occurred
 * @returns {Response} Error page response
 */
export function handleError(error) {
  console.error('Request handling error:', error);
  const errorHTML = generateHTML([], []) + 
    `<div class="error">Error: ${error.message || 'An unknown error occurred'}</div>`;
  
  return new Response(errorHTML, {
    status: 500,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'no-store'
    }
  });
}

/**
 * Main request handler for the Cloudflare Worker
 * @param {Request} request - The incoming request
 * @returns {Promise<Response>} The response
 */
export async function handleRequest(request) {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return handleCORS();
  }

  try {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Get access token for Google Drive API
    const token = await getAccessToken();
    
    if (!token) {
      throw new Error('Failed to obtain access token');
    }

    // Handle file view requests
    if (path.startsWith('/view/')) {
      const fileId = path.slice(6);
      const [fileDetails, breadcrumbs] = await Promise.all([
        getFileDetails(fileId, token),
        getBreadcrumbs(fileId, token)
      ]);

      return new Response(generateHTML({ viewFile: fileDetails }, breadcrumbs), {
        headers: {
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'no-store',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Handle folder listing requests
    const folderId = path === '/' ? 'root' : path.slice(1);
    const [files, breadcrumbs] = await Promise.all([
      listFiles(folderId, token),
      getBreadcrumbs(folderId, token)
    ]);
    
    return new Response(generateHTML(files, breadcrumbs), {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return handleError(error);
  }
}