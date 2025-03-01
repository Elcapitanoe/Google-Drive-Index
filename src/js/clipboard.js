/**
 * Clipboard functionality for copying text to clipboard
 */

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('URL copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy URL');
  }
}

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

/**
 * Initializes clipboard functionality
 */
export function initClipboard() {
  // Add global function for use in inline onclick handlers
  window.copyToClipboard = copyToClipboard;
}