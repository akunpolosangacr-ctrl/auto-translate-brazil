import { nativeTranslate } from './engine/index.js';

const testCases = [
  { text: "aku nggak tahu bro", source: "id", target: "pt-BR", expected: "não sei, mano" },
  { text: "gila mahal banget", source: "id", target: "pt-BR", expected: "caramba, tá caro demais" },
  { text: "aku akan mencobanya nanti", source: "id", target: "pt-BR", expected: "vou tentar mais tarde" },
  { text: "kamu sedang apa?", source: "id", target: "pt-BR", expected: "o que você tá fazendo?" },
  { text: "bagaimana cara menemukan offset ini?", source: "id", target: "pt-BR", expected: "como faço para encontrar esse offset?" },
  { text: "aku cuma ingin tahu", source: "id", target: "pt-BR", expected: "só quero saber" },
  { text: "aku coba dulu nanti aku kasih tahu", source: "id", target: "pt-BR", expected: "vou tentar aqui dan depois te aviso" },
  { text: "kamu tahu cara menemukan offset itu", source: "id", target: "pt-BR", expected: "tu sabe como encontrar esse offset?" },
  { text: "tidak tahu apa-apa", source: "id", target: "pt-BR", expected: "não faço ideia de nada" },
  { text: "bagaimana kabarmu", source: "id", target: "pt-BR", expected: "tudo bem com você?" },
  { text: "terima kasih banyak", source: "id", target: "pt-BR", expected: "muito obrigado" },
  { text: "tá muito caro, mano", source: "pt-BR", target: "id", expected: "mahal banget, bro" },
  { text: "vou tentar aqui", source: "pt-BR", target: "id", expected: "aku coba dulu di sini" },
  { text: "não faço ideia", source: "pt-BR", target: "id", expected: "aku sama sekali nggak tahu" },
  { text: "os caras conseguiram crackear", source: "pt-BR", target: "id", expected: "orang-orang itu berhasil nge-crack" },
  { text: "tudo bem com você?", source: "pt-BR", target: "id", expected: "bagaimana kabarmu?" },
  { text: "muito obrigado", source: "pt-BR", target: "id", expected: "terima kasih banyak" },
  { text: "caramba, tá caro demais, mano", source: "pt-BR", target: "id", expected: "gila, mahal banget bro" },
  { text: "tu sabe como encontrar esse offset?", source: "pt-BR", target: "id", expected: "kamu tahu cara menemukan offset itu?" },
  { text: "Apalah", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Randomunmatchedtext12345", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Testcase 22", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Testcase 23", source: "pt-BR", target: "id", expectedUnmatched: true },
  { text: "Testcase 24", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Testcase 25", source: "pt-BR", target: "id", expectedUnmatched: true },
  { text: "Testcase 26", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Testcase 27", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Testcase 28", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Testcase 29", source: "id", target: "pt-BR", expectedUnmatched: true },
  { text: "Testcase 30", source: "id", target: "pt-BR", expectedUnmatched: true }
];

async function runTests() {
  console.log('Running 30+ Regression Tests...');
  let passed = 0;
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const res = await nativeTranslate({ text: tc.text, source: tc.source, target: tc.target, style: 'natural' });
    
    if (tc.expectedUnmatched) {
      if (res.success === false && res.status === 'unmatched') {
        passed++;
      } else {
        console.log(`[FAIL] Test ${i+1}: Expected unmatched for "${tc.text}"`);
      }
    } else {
      if (res.success && res.translation.toLowerCase().includes(tc.expected.toLowerCase())) {
        passed++;
      } else {
        console.log(`[FAIL] Test ${i+1}: Expected "${tc.expected}", got "${res.translation}"`);
      }
    }
  }
  console.log(`Tests Completed: ${passed}/${testCases.length} passed.`);
}

runTests();
