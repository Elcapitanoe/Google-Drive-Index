export interface ToastOptions {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'warning' | 'info';
}