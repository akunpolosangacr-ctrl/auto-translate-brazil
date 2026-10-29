import { translateText } from '../lib/ai-provider.js';
import { query } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text, sourceLang, targetLang, tone, sessionId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for translation.' });
    }

    const src = sourceLang || 'auto';
    const tgt = targetLang || 'pt-BR';
    const currentTone = tone || 'natural';

    const translatedText = await translateText({
      text,
      sourceLang: src,
      targetLang: tgt,
      tone: currentTone
    });

    if (sessionId && process.env.DATABASE_URL) {
      try {
        await query(
          `INSERT INTO translation_history (session_id, source_text, translated_text, source_lang, target_lang, tone) VALUES ($1, $2, $3, $4, $5, $6)`,
          [sessionId, text, translatedText, src, tgt, currentTone]
        );
      } catch (dbErr) {
        console.error('DB History save failed:', dbErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      translatedText,
      sourceLang: src,
      targetLang: tgt,
      tone: currentTone
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error during translation.'
    });
  }
}
