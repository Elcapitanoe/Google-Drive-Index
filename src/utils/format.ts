/**
 * Utility functions for formatting data
 */

/**
 * Formats file sizes in human-readable format
 */
export const formatBytes = (bytes: string | number | undefined): string => {
  if (!bytes || Number(bytes) === 0) return '0 Bytes';

  const numBytes = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'] as const;
  const i = Math.floor(Math.log(numBytes) / Math.log(k));

  return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Formats date strings in a localized format
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';

  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return 'Invalid Date';
  }
};

/**
 * Truncates text to a specified length with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};
