import './styles/main.css';
import { ClipboardManager } from '@/utils/clipboard';
import { ToastManager } from '@/utils/toast';

/**
 * Application initialization
 */
class App {
  private clipboardManager: ClipboardManager;
  private toastManager: ToastManager;

  constructor() {
    this.clipboardManager = ClipboardManager.getInstance();
    this.toastManager = ToastManager.getInstance();
    this.init();
  }

  /**
   * Initialize the application
   */
  private init(): void {
    this.setupGlobalReferences();
    this.setupEventListeners();
    console.log('PAMBI Drive initialized successfully');
  }

  /**
   * Setup global references for backward compatibility
   */
  private setupGlobalReferences(): void {
    // Make clipboard manager available globally for onclick handlers
    (window as any).clipboardManager = this.clipboardManager;
    
    // Legacy support
    (window as any).copyToClipboard = (text: string) => {
      this.clipboardManager.copyToClipboard(text);
    };
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Handle keyboard navigation
    document.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Handle file card interactions
    document.addEventListener('click', this.handleClick.bind(this));
  }

  /**
   * Handle keyboard events
   */
  private handleKeydown(event: KeyboardEvent): void {
    // ESC key to close modals or go back
    if (event.key === 'Escape') {
      // Could be used for future modal implementations
      console.log('Escape key pressed');
    }
  }

  /**
   * Handle click events
   */
  private handleClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Handle copy button clicks
    if (target.closest('.copy-button')) {
      event.preventDefault();
      // The onclick handler will handle the actual copying
    }
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new App();
});