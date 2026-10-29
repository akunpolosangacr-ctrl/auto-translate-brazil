export function parseSentence(text) {
  if (!text) return [];
  return text.split(/([.?!,])/).filter(Boolean);
}
