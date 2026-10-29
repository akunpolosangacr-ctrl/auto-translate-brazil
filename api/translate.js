import { nativeTranslate } from '../engine/index.js';
import { seedDatabase } from '../database/seed.js';

let isSeeded = false;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    if (!isSeeded) {
      await seedDatabase().catch(() => {});
      isSeeded = true;
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e) { body = {}; }
    }
    body = body || {};

    const text = body.text;
    const source = body.source;
    const target = body.target;
    const style = body.style || 'natural';

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Text is required.' });
    }

    if (!source || !target) {
      return res.status(400).json({ success: false, error: 'Source and target languages are required.' });
    }

    const result = await nativeTranslate({ text, source, target, style });
    return res.status(200).json(result);
  } catch (error) {
    console.error('API Translate Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
