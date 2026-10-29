export function normalizeTypo(text) {
  if (!text) return '';
  let cleaned = text.trim();
  cleaned = cleaned.replace(/\bbgt\b/gi, 'banget');
  cleaned = cleaned.replace(/\btdk\b/gi, 'tidak');
  return cleaned;
}
