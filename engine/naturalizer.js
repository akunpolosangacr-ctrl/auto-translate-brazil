export function applyNaturalTone(text, targetLang, style) {
  if (!text) return '';
  let output = text;
  
  if (targetLang.toLowerCase().includes('portuguese') || targetLang === 'pt-BR') {
    if (style === 'chat' && !output.includes('mano')) {
      output = output + ', mano';
    }
  } else {
    if (style === 'chat' && !output.includes('ya')) {
      output = output + ' ya';
    }
  }
  
  return output.charAt(0).toUpperCase() + output.slice(1);
}
