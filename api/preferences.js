import { query } from '../database/neon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sessionId = req.query.sessionId || req.body?.sessionId;

  try {
    if (req.method === 'GET') {
      if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
      const resDb = await query(`SELECT default_style FROM user_preferences WHERE session_id = $1`, [sessionId]);
      const style = resDb && resDb.rows.length > 0 ? resDb.rows[0].default_style : 'natural';
      return res.status(200).json({ success: true, defaultStyle: style });
    }

    if (req.method === 'POST') {
      const { sessionId, defaultStyle } = req.body || {};
      if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
      await query(
        `CREATE TABLE IF NOT EXISTS user_preferences (id SERIAL PRIMARY KEY, session_id VARCHAR(255) UNIQUE, default_style VARCHAR(50), updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);
         INSERT INTO user_preferences (session_id, default_style) VALUES ($1, $2) ON CONFLICT (session_id) DO UPDATE SET default_style = $2, updated_at = CURRENT_TIMESTAMP`,
        [sessionId, defaultStyle || 'natural']
      );
      return res.status(200).json({ success: true, message: 'Preferences saved.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
