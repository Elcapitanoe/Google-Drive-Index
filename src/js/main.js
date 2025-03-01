/**
 * Main JavaScript file for PAMBI Drive
 */

// Initialize clipboard functionality
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('URL copied to clipboard!');
  } catch (err) {
    showToast('Failed to copy URL');
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

// Make copyToClipboard available globally
window.copyToClipboard = copyToClipboard;