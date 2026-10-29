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

  translated = lookupDictionary(cleanedText, direction);

  if (!translated) {
    try {
      const dbRes = await query(
        `SELECT target_phrase FROM translation_dictionary WHERE source_lang = $1 AND target_lang = $2 AND LOWER(source_phrase) = LOWER($3) LIMIT 1`,
        [source, target, cleanedText]
      );
      if (dbRes && dbRes.rows.length > 0) {
        translated = dbRes.rows[0].target_phrase;
      }
    } catch (e) {
      console.error('DB lookup warning:', e.message);
    }
  }

  if (!translated) {
    const slangRes = translateSlang(cleanedText, direction);
    if (slangRes !== cleanedText) {
      translated = slangRes;
    }
  }

  if (!translated || translated.toLowerCase() === cleanedText.toLowerCase()) {
    return {
      success: false,
      status: 'unmatched',
      error: `Native engine belum memiliki padanan presisi untuk frase "${text}". Gunakan tombol koreksi untuk melatih memori database!`,
      source,
      target
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
