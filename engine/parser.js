export function parseSentence(text) {
  if (!text) return [];
  // Memecah kalimat berdasarkan tanda baca atau spasi untuk analisis frasa
  return text.split(/([.?!,])/).filter(Boolean);
}
