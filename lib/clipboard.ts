/**
 * Copy text to clipboard with fallback
 * Tries modern Clipboard API first, then falls back to deprecated execCommand
 * No permission prompts required
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, using fallback:', err);
    }
  }

  // Fallback: use execCommand (older but no permissions required)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);

    const selected = document.getSelection()?.rangeCount ?? 0 > 0
      ? document.getSelection()?.getRangeAt(0)
      : null;

    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);

    if (selected && document.getSelection()) {
      document.getSelection()?.removeAllRanges();
      document.getSelection()?.addRange(selected);
    }

    return success;
  } catch (err) {
    console.error('Fallback clipboard failed:', err);
    return false;
  }
}
