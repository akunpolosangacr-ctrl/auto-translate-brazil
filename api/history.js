import { query } from '../database/neon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sessionId = req.query.sessionId || req.body?.sessionId;
  if (!sessionId) {
    return res.status(400).json({ success: false, error: 'sessionId is required for security isolation.' });
  }

  try {
    await query(
      `CREATE TABLE IF NOT EXISTS translation_history (
        id SERIAL PRIMARY KEY, session_id VARCHAR(255) NOT NULL, source_text TEXT, translated_text TEXT, source_lang VARCHAR(10), target_lang VARCHAR(10), style VARCHAR(50), created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );`
    );

    if (req.method === 'GET') {
      const resDb = await query(
        `SELECT * FROM translation_history WHERE session_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [sessionId]
      );
      return res.status(200).json({ success: true, history: resDb ? resDb.rows : [] });
    }

    if (req.method === 'POST') {
      const { sourceText, translatedText, sourceLang, targetLang, style } = req.body || {};
      if (!sourceText || !translatedText) return res.status(400).json({ success: false, error: 'Missing fields' });
      
      await query(
        `INSERT INTO translation_history (session_id, source_text, translated_text, source_lang, target_lang, style) VALUES ($1, $2, $3, $4, $5, $6)`,
        [sessionId, sourceText, translatedText, sourceLang, targetLang, style]
      );
      return res.status(200).json({ success: true, message: 'History saved.' });
    }

    if (req.method === 'DELETE') {
      await query(`DELETE FROM translation_history WHERE session_id = $1`, [sessionId]);
      return res.status(200).json({ success: true, message: 'History cleared for this session.' });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
