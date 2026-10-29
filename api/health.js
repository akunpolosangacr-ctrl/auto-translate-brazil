import { query } from '../database/neon.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  try {
    const dbCheck = await query('SELECT NOW()');
    return res.status(200).json({
      status: 'healthy',
      engine: 'native-natural-engine',
      database: dbCheck ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    return res.status(500).json({ status: 'unhealthy', error: e.message });
  }
}
