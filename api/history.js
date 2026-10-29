import { query } from '../database/neon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sessionId = req.query.sessionId || req.body?.sessionId;

  try {
    if (req.method === 'GET') {
      if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
      const resDb = await query(
        `SELECT * FROM translation_history WHERE session_id = $1 ORDER BY created_at DESC LIMIT 50`,
        [sessionId]
      );
      return res.status(200).json({ success: true, history: resDb ? resDb.rows : [] });
    }

    if (req.method === 'DELETE') {
      if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
      await query(`DELETE FROM translation_history WHERE session_id = $1`, [sessionId]);
      return res.status(200).json({ success: true, message: 'History cleared.' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
