import { DriveApiService } from '@/services/drive-api';
import { TemplateRenderer } from '@/components/template';
import type { ContentData } from '@/types';

/**
 * HTTP request handler for the application
 */
export class RequestHandler {
  private static instance: RequestHandler;
  private driveService: DriveApiService;
  private templateRenderer: TemplateRenderer;

  private constructor() {
    this.driveService = DriveApiService.getInstance();
    this.templateRenderer = TemplateRenderer.getInstance();
  }

  static getInstance(): RequestHandler {
    if (!RequestHandler.instance) {
      RequestHandler.instance = new RequestHandler();
    }
    return RequestHandler.instance;
  }

  /**
   * Handles CORS preflight requests
   */
  handleCORS(): Response {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  /**
   * Creates error response with proper HTML structure
   */
  createErrorResponse(error: Error, status = 500): Response {
    console.error('Request handling error:', error);
    
    const errorHTML = this.templateRenderer.generateHTML([], []) + 
      `<div class="error">Error: ${error.message || 'An unknown error occurred'}</div>`;
    
    return new Response(errorHTML, {
      status,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  /**
   * Creates successful HTML response
   */
  private createHTMLResponse(html: string): Response {
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  /**
   * Handles file view requests
   */
  async handleFileView(fileId: string): Promise<Response> {
    try {
      const [fileDetails, breadcrumbs] = await Promise.all([
        this.driveService.getFileDetails(fileId),
        this.driveService.getBreadcrumbs(fileId),
      ]);

      const data: ContentData = { viewFile: fileDetails };
      const html = this.templateRenderer.generateHTML(data, breadcrumbs);
      
      return this.createHTMLResponse(html);
    } catch (error) {
      return this.createErrorResponse(error as Error);
    }
  }

  /**
   * Handles folder listing requests
   */
  async handleFolderListing(folderId: string): Promise<Response> {
    try {
      const [files, breadcrumbs] = await Promise.all([
        this.driveService.listFiles(folderId),
        this.driveService.getBreadcrumbs(folderId),
      ]);
      
      const html = this.templateRenderer.generateHTML(files, breadcrumbs);
      
      return this.createHTMLResponse(html);
    } catch (error) {
      return this.createErrorResponse(error as Error);
    }
  }

  /**
   * Main request handler
   */
  async handleRequest(request: Request): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return this.handleCORS();
    }

    try {
      const url = new URL(request.url);
      const path = url.pathname;
      
      // Handle file view requests
      if (path.startsWith('/view/')) {
        const fileId = path.slice(6);
        if (!fileId) {
          throw new Error('File ID is required');
        }
        return await this.handleFileView(fileId);
      }

      // Handle folder listing requests
      const folderId = path === '/' ? 'root' : path.slice(1);
      return await this.handleFolderListing(folderId);
      
    } catch (error) {
      return this.createErrorResponse(error as Error);
    }
  }
}