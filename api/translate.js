import { nativeTranslate } from '../engine/index.js';
import { query } from '../database/neon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { text, source, target, style, sessionId } = req.body || {};
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for translation.' });
    }

    const result = await nativeTranslate({ text, source, target, style });

    // Simpan riwayat ke Neon DB jika ada sessionId
    if (sessionId) {
      await query(
        `CREATE TABLE IF NOT EXISTS translation_history (
          id SERIAL PRIMARY KEY, session_id VARCHAR(255), source_text TEXT, translated_text TEXT, source_lang VARCHAR(10), target_lang VARCHAR(10), style VARCHAR(50), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        INSERT INTO translation_history (session_id, source_text, translated_text, source_lang, target_lang, style) VALUES ($1, $2, $3, $4, $5, $6)`,
        [sessionId, text, result.translation, source || 'id', target || 'pt-BR', style || 'natural']
      ).catch(e => console.log('History log error:', e.message));
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('API Translate Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
