import { ToastManager } from '@/utils/toast';

/**
 * Clipboard utility for copying text
 */
export class ClipboardManager {
  private static instance: ClipboardManager;
  private toastManager: ToastManager;

  private constructor() {
    this.toastManager = ToastManager.getInstance();
  }

  static getInstance(): ClipboardManager {
    if (!ClipboardManager.instance) {
      ClipboardManager.instance = new ClipboardManager();
    }
    return ClipboardManager.instance;
  }

  /**
   * Copies text to clipboard with fallback support
   */
  async copyToClipboard(text: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        this.toastManager.success('URL copied to clipboard!');
      } else {
        // Fallback for older browsers or non-secure contexts
        this.fallbackCopyToClipboard(text);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      this.toastManager.error('Failed to copy URL');
    }
  }

  /**
   * Fallback method for copying text
   */
  private fallbackCopyToClipboard(text: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      this.toastManager.success('URL copied to clipboard!');
    } catch (error) {
      console.error('Fallback copy failed:', error);
      this.toastManager.error('Failed to copy URL');
    } finally {
      document.body.removeChild(textArea);
    }
  }
}