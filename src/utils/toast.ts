import type { ToastOptions } from '@/types';

/**
 * Toast notification utility
 */
export class ToastManager {
  private static instance: ToastManager;
  private toastElement: HTMLElement | null = null;

  private constructor() {
    this.initializeToast();
  }

  static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  private initializeToast(): void {
    this.toastElement = document.getElementById('toast');
    if (!this.toastElement) {
      this.createToastElement();
    }
  }

  private createToastElement(): void {
    this.toastElement = document.createElement('div');
    this.toastElement.id = 'toast';
    this.toastElement.className = 'toast';
    document.body.appendChild(this.toastElement);
  }

  /**
   * Shows a toast notification
   */
  show({ message, duration = 3000, type = 'info' }: ToastOptions): void {
    if (!this.toastElement) return;

    this.toastElement.textContent = message;
    this.toastElement.className = `toast toast--${type}`;
    this.toastElement.style.display = 'block';

    setTimeout(() => {
      if (this.toastElement) {
        this.toastElement.style.display = 'none';
      }
    }, duration);
  }

  /**
   * Shows a success toast
   */
  success(message: string, duration?: number): void {
    this.show({ message, duration, type: 'success' });
  }

  /**
   * Shows an error toast
   */
  error(message: string, duration?: number): void {
    this.show({ message, duration, type: 'error' });
  }
}
