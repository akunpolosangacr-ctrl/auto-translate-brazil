import { normalizeTypo } from './typo.js';
import { translateSlang } from './slang.js';
import { lookupDictionary } from './dictionary.js';
import { analyzeContext } from './analyzer.js';
import { parseSentence } from './parser.js';
import { applyNaturalTone } from './naturalizer.js';
import { query } from '../database/neon.js';

export async function nativeTranslate({ text, source, target, style }) {
  const cleanedText = normalizeTypo(text);
  const direction = (source === 'id' || source === 'Indonesian') ? 'id-to-pt' : 'pt-to-id';
  const targetLangName = (direction === 'id-to-pt') ? 'Brazilian Portuguese' : 'Indonesian';

  // 1. Cek kamus statis & database memori lokal/Neon
  let translated = lookupDictionary(cleanedText, direction);
  
  if (!translated) {
    // Cek database Neon untuk koreksi atau kamus dinamis
    const dbRes = await query(
      `SELECT target_phrase FROM translation_dictionary WHERE source_lang = $1 AND target_lang = $2 AND source_phrase ILIKE $3 LIMIT 1`,
      [source, target, cleanedText]
    );
    if (dbRes && dbRes.rows.length > 0) {
      translated = dbRes.rows[0].target_phrase;
    }
  }

  if (!translated) {
    // 2. Fallback Rule-Based & Slang Engine Hibrida
    translated = translateSlang(cleanedText, direction);
    
    // Jika tidak ada padanan slang, lakukan konversi kata dasar terstruktur
    if (translated === cleanedText) {
      if (direction === 'id-to-pt') {
        translated = cleanedText
          .replace(/\bbagaimana\b/gi, 'como')
          .replace(/\bsaya\b/gi, 'eu')
          .replace(/\bkamu\b/gi, 'você')
          .replace(/\btidak\b/gi, 'não')
          .replace(/\bmau\b/gi, 'quero')
          .replace(/\bbeli\b/gi, 'comprar')
          .replace(/\bada\b/gi, 'tem')
          .replace(/\bmereka\b/gi, 'eles');
      } else {
        translated = cleanedText
          .replace(/\bcomo\b/gi, 'bagaimana')
          .replace(/\beu\b/gi, 'saya')
          .replace(/\bvocê\b/gi, 'kamu')
          .replace(/\bnão\b/gi, 'tidak')
          .replace(/\bquero\b/gi, 'mau')
          .replace(/\bcomprar\b/gi, 'beli')
          .replace(/\btem\b/gi, 'ada')
          .replace(/\beles\b/gi, 'mereka');
      }
    }
  }

  // 3. Terapkan Analisis Konteks & Gaya Bahasa Natural
  const context = analyzeContext(text);
  const finalResult = applyNaturalTone(translated, targetLangName, style || context);

  return {
    success: true,
    translation: finalResult,
    source: source,
    target: target,
    engine: 'native-natural-engine'
  };
}
