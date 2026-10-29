export function normalizeTypo(text) {
  if (!text) return '';
  let cleaned = text.trim();
  // Normalisasi slang ketik umum (misal: bgt -> banget, bener -> benar)
  cleaned = cleaned.replace(/\bbgt\b/gi, 'banget');
  cleaned = cleaned.replace(/\bnggak\b/gi, 'enggak');
  cleaned = cleaned.replace(/\btdk\b/gi, 'tidak');
  cleaned = cleaned.replace(/\bgue\b/gi, 'saya');
  cleaned = cleaned.replace(/\blu\b/gi, 'kamu');
  return cleaned;
}
