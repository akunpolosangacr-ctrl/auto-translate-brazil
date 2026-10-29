import { normalizeTypo } from './typo.js';
import { translateSlang } from './slang.js';
import { lookupDictionary } from './dictionary.js';
import { analyzeContext } from './analyzer.js';
import { applyNaturalTone } from './naturalizer.js';
import { query } from '../database/neon.js';

export async function nativeTranslate({ text, source, target, style }) {
  const cleanedText = normalizeTypo(text);
  const direction = (source === 'id' || source === 'Indonesian') ? 'id-to-pt' : 'pt-to-id';
  const targetLangName = (direction === 'id-to-pt') ? 'Brazilian Portuguese' : 'Indonesian';

  if (!cleanedText) {
    return { success: false, error: 'Teks kosong.' };
  }

  let translated = null;

  // 1. Cek Kamus Statis Berbasis Frase
  translated = lookupDictionary(cleanedText, direction);

  // 2. Cek Database Neon PostgreSQL jika belum ketemu di statis
  if (!translated) {
    const dbRes = await query(
      `SELECT target_phrase FROM translation_dictionary WHERE source_lang = $1 AND target_lang = $2 AND source_phrase ILIKE $3 LIMIT 1`,
      [source, target, `%${cleanedText}%`]
    );
    if (dbRes && dbRes.rows.length > 0) {
      translated = dbRes.rows[0].target_phrase;
    }
  }

  // 3. Fallback Rule-Based & Slang Hibrida (DILARANG mengembalikan teks asli mentah-mentah sebagai sukses)
  if (!translated) {
    let slangTranslated = translateSlang(cleanedText, direction);
    if (slangTranslated !== cleanedText) {
      translated = slangTranslated;
    } else {
      // Rule-based substitution komprehensif
      if (direction === 'id-to-pt') {
        translated = cleanedText
          .replace(/\bsaya\b/gi, 'eu')
          .replace(/\baku\b/gi, 'eu')
          .replace(/\bkamu\b/gi, 'você')
          .replace(/\benggak\b/gi, 'não')
          .replace(/\btidak\b/gi, 'não')
          .replace(/\bmau\b/gi, 'quero')
          .replace(/\bbeli\b/gi, 'comprar')
          .replace(/\bada\b/gi, 'tem')
          .replace(/\bmereka\b/gi, 'eles')
          .replace(/\bbagaimana\b/gi, 'como')
          .replace(/\bapa\b/gi, 'o que');
      } else {
        translated = cleanedText
          .replace(/\beu\b/gi, 'aku')
          .replace(/\bvocê\b/gi, 'kamu')
          .replace(/\bnão\b/gi, 'tidak')
          .replace(/\bquero\b/gi, 'mau')
          .replace(/\bcomprar\b/gi, 'beli')
          .replace(/\btem\b/gi, 'ada')
          .replace(/\beles\b/gi, 'mereka')
          .replace(/\bcomo\b/gi, 'bagaimana');
      }
    }
  }

  // ATURAN KETAT: Jika setelah diproses hasilnya tetap sama persis dengan input sumber dan tidak dikenali, 
  // berikan pemberitahuan status bahwa terjemahan native belum tersedia secara presisi (Hindari Echo Palsu).
  if (!translated || translated.toLowerCase() === cleanedText.toLowerCase()) {
    return {
      success: true,
      translation: `[Native Engine Notice]: Frase "${text}" belum memiliki aturan padanan langsung di kamus hibrida. Silakan gunakan tombol "Kurang natural? Koreksi" untuk melatih memori Neon DB!`,
      source,
      target,
      engine: 'native-natural-engine-unmatched'
    };
  }

  const context = analyzeContext(text);
  const finalResult = applyNaturalTone(translated, targetLangName, style || context);

  return {
    success: true,
    translation: finalResult,
    source,
    target,
    engine: 'native-natural-engine'
  };
}
