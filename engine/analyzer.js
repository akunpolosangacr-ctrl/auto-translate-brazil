export function analyzeContext(text) {
  const lower = text.toLowerCase();
  if (lower.includes('offset') || lower.includes('apk') || lower.includes('script') || lower.includes('crack')) {
    return 'technical';
  }
  if (lower.includes('bro') || lower.includes('mano') || lower.includes('wkwk') || lower.includes('kkk')) {
    return 'chat';
  }
  return 'natural';
}
