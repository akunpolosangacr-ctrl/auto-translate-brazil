import { query } from '../database/neon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { sourceText, correctedText, sourceLang, targetLang } = req.body || {};
    if (!sourceText || !correctedText) {
      return res.status(400).json({ error: 'Source and corrected text are required.' });
    }

    await query(
      `CREATE TABLE IF NOT EXISTS translation_corrections (
        id SERIAL PRIMARY KEY, source_text TEXT, corrected_text TEXT, source_lang VARCHAR(10), target_lang VARCHAR(10), status VARCHAR(20) DEFAULT 'pending', created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      INSERT INTO translation_corrections (source_text, corrected_text, source_lang, target_lang, status) VALUES ($1, $2, $3, $4, 'pending')`,
      [sourceText, correctedText, sourceLang || 'id', targetLang || 'pt-BR']
    );

    return res.status(200).json({ success: true, message: 'Correction submitted successfully for validation.' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
