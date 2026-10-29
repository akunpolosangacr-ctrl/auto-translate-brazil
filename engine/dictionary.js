const idToPtBase = {
  "aku coba dulu nanti aku kasih tahu": "vou tentar aqui e depois te aviso",
  "kamu tahu cara menemukan offset itu": "tu sabe como encontrar esse offset?",
  "tidak tahu apa-apa": "não faço ideia de nada",
  "bagaimana kabarmu": "tudo bem com você?",
  "terima kasih banyak": "muito obrigado"
};

const ptToIdBase = {
  "vou tentar aqui e depois te aviso": "aku coba dulu, nanti aku kasih tahu",
  "tu sabe como encontrar esse offset?": "kamu tahu cara menemukan offset itu?",
  "não faço ideia": "aku tidak tahu apa-apa",
  "tudo bem com você?": "bagaimana kabarmu?",
  "muito obrigado": "terima kasih banyak"
};

export function lookupDictionary(text, direction) {
  const clean = text.toLowerCase().trim();
  const base = direction === 'id-to-pt' ? idToPtBase : ptToIdBase;
  return base[clean] || null;
}
