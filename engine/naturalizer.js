export function applyNaturalTone(text, targetLang, style) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}
