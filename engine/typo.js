export function normalizeTypo(text) {
  if (!text) return '';
  let cleaned = text.trim().toLowerCase();
  cleaned = cleaned.replace(/\bbgt\b/gi, 'banget');
  cleaned = cleaned.replace(/\bnggak\b/gi, 'tidak');
  cleaned = cleaned.replace(/\btdk\b/gi, 'tidak');
  cleaned = cleaned.replace(/\bgue\b/gi, 'saya');
  cleaned = cleaned.replace(/\blu\b/gi, 'kamu');
  cleaned = cleaned.replace(/\bdong\b/gi, '');
  return cleaned.trim();
}
