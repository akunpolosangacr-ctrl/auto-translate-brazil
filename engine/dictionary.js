const idToPtBase = {
  "aku nggak tahu bro": "não sei, mano",
  "gila mahal banget": "caramba, tá caro demais",
  "aku akan mencobanya nanti": "vou tentar mais tarde",
  "kamu sedang apa?": "o que você tá fazendo?",
  "bagaimana cara menemukan offset ini?": "como faço para encontrar esse offset?",
  "aku cuma ingin tahu": "só quero saber",
  "apalah": "[Kata Ambigu / Informal]: Seja o que for / O que quer que seja (tergantung konteks kalimat di depannya)",
  "aku coba dulu nanti aku kasih tahu": "vou tentar aqui e depois te aviso",
  "kamu tahu cara menemukan offset itu": "tu sabe como encontrar esse offset?",
  "tidak tahu apa-apa": "não faço ideia de nada",
  "bagaimana kabarmu": "tudo bem com você?",
  "terima kasih banyak": "muito obrigado"
};

const ptToIdBase = {
  "tá muito caro, mano": "mahal banget, bro",
  "vou tentar aqui": "aku coba dulu di sini",
  "não faço ideia": "aku sama sekali nggak tahu",
  "os caras conseguiram crackear": "orang-orang itu berhasil nge-crack",
  "tudo bem com você?": "bagaimana kabarmu?",
  "muito obrigado": "terima kasih banyak",
  "caramba, tá caro demais, mano": "gila, mahal banget bro",
  "tu sabe como encontrar esse offset?": "kamu tahu cara menemukan offset itu?"
};

export function lookupDictionary(text, direction) {
  const clean = text.toLowerCase().trim().replace(/[?!.,]/g, '');
  const base = direction === 'id-to-pt' ? idToPtBase : ptToIdBase;
  
  // Exact match
  if (base[clean]) return base[clean];

  // Partial match search
  for (const [k, v] of Object.entries(base)) {
    if (clean.includes(k) || k.includes(clean)) {
      return v;
    }
  }
  return null;
}
