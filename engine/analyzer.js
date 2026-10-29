export function analyzeContext(text) {
  const lower = text.toLowerCase();
  if (lower.includes('offset') || lower.includes('apk') || lower.includes('script') || lower.includes('crack')) {
    return 'technical';
  }
  if (lower.includes('bro') || lower.includes('mano') || lower.includes('wkwk') || lower.includes('kkk')) {
    return 'chat';
  }
  if (lower.includes('mahal') || lower.includes('caramba') || lower.includes('gila')) {
    return 'slang';
  }
  return 'natural';
}
