import { ClipboardManager } from '../utils/clipboard';
import { ToastManager } from '../utils/toast';
import { UIRenderer } from '../components/UIRenderer';
import { MockDriveService } from '../services/MockDriveService';
import type { ProcessedFile, FileDetails, Breadcrumb } from '../types';

/**
 * Main application class for PAMBI Drive
 */
export class DriveApp {
  private clipboardManager: ClipboardManager;
  private uiRenderer: UIRenderer;
  private driveService: MockDriveService;

  constructor() {
    this.clipboardManager = ClipboardManager.getInstance();
    this.uiRenderer = UIRenderer.getInstance();
    this.driveService = MockDriveService.getInstance();
    this.init();
  }

  /**
   * Initialize the application
   */
  private async init(): Promise<void> {
    this.setupGlobalReferences();
    this.setupEventListeners();
    await this.loadInitialContent();
    console.log('PAMBI Drive initialized successfully');
  }

  /**
   * Setup global references for backward compatibility
   */
  private setupGlobalReferences(): void {
    (window as any).clipboardManager = this.clipboardManager;
    (window as any).copyToClipboard = (text: string) => {
      this.clipboardManager.copyToClipboard(text);
    };
    (window as any).driveApp = this;
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Handle navigation
    window.addEventListener('popstate', this.handlePopState.bind(this));

    // Handle clicks
    document.addEventListener('click', this.handleClick.bind(this));

    // Handle keyboard events
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  /**
   * Handle browser back/forward navigation
   */
  private handlePopState(_event: PopStateEvent): void {
    const path = window.location.pathname;
    this.navigateToPath(path, false);
  }

  /**
   * Handle click events
   */
  private handleClick(event: Event): void {
    const target = event.target as HTMLElement;
    const fileCard = target.closest('.file-card') as HTMLAnchorElement;

    if (fileCard) {
      event.preventDefault();
      const href = fileCard.getAttribute('href');
      if (href) {
        this.navigateToPath(href);
      }
    }
  }

  /**
   * Handle keyboard events
   */
  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      // Could be used for future modal implementations
      console.log('Escape key pressed');
    }
  }

  /**
   * Navigate to a specific path
   */
  public async navigateToPath(
    path: string,
    pushState: boolean = true
  ): Promise<void> {
    try {
      this.showLoading();

      if (pushState) {
        window.history.pushState(null, '', path);
      }

      this.currentPath = path;

      if (path.startsWith('/view/')) {
        const fileId = path.slice(6);
        await this.showFileDetails(fileId);
      } else {
        const folderId = path === '/' ? 'root' : path.slice(1);
        await this.showFolderContents(folderId);
      }
    } catch (error) {
      console.error('Navigation error:', error);
      this.showError('Failed to load content');
    }
  }

  /**
   * Show folder contents
   */
  private async showFolderContents(folderId: string): Promise<void> {
    const [files, breadcrumbs] = await Promise.all([
      this.driveService.listFiles(folderId),
      this.driveService.getBreadcrumbs(folderId),
    ]);

    this.uiRenderer.renderFolderView(files, breadcrumbs);
  }

  /**
   * Show file details
   */
  private async showFileDetails(fileId: string): Promise<void> {
    const [fileDetails, breadcrumbs] = await Promise.all([
      this.driveService.getFileDetails(fileId),
      this.driveService.getBreadcrumbs(fileId),
    ]);

    this.uiRenderer.renderFileView(fileDetails, breadcrumbs);
  }

  /**
   * Load initial content based on current URL
   */
  private async loadInitialContent(): Promise<void> {
    const path = window.location.pathname;
    await this.navigateToPath(path, false);
  }

  /**
   * Show loading state
   */
  private showLoading(): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = '<div class="loading">Loading...</div>';
    }
  }

  /**
   * Show error message
   */
  private showError(message: string): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = `<div class="error">${message}</div>`;
    }
  }
}
