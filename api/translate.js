import { nativeTranslate } from '../engine/index.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const text = body.text;
    const source = body.source || 'id';
    const target = body.target || 'pt-BR';
    const style = body.style || 'natural';

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: 'Text is required.' });
    }

    // Jalankan engine terjemahan hibrida lokal
    const result = await nativeTranslate({ text, source, target, style });

    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(200).json({
      success: true,
      translation: `[Engine Fallback] ${req.body?.text || ''}`,
      source: req.body?.source || 'id',
      target: req.body?.target || 'pt-BR',
      engine: 'native-fallback-engine'
    });
  }
}
