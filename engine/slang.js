const ptBrSlang = {
  "mano": "bro",
  "caramba": "gila",
  "tá caro demais": "mahal banget",
  "kkk": "wkwk",
  "ae": "hei",
  "trampo": "kerjaan",
  "parça": "sohib"
};

const idSlang = {
  "bro": "mano",
  "gila": "caramba",
  "mahal banget": "tá caro demais",
  "wkwk": "kkk",
  "banget": "demais",
  "keren": "da hora"
};

export function translateSlang(text, direction) {
  let result = text;
  const dict = direction === 'id-to-pt' ? idSlang : ptBrSlang;
  
  for (const [key, val] of Object.entries(dict)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, val);
  }
  return result;
}
