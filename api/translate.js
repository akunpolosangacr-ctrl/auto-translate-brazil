import { GoogleGenerativeAI } from "@google/generative-ai";
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
    const { text, sourceLang, targetLang, tone, sessionId } = req.body || {};

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for translation.' });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'AI_API_KEY is not configured in Vercel environment variables.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';
    const model = genAI.getGenerativeModel({ model: modelName });

    const src = sourceLang || 'auto';
    const tgt = targetLang || 'Brazilian Portuguese';
    const currentTone = tone || 'natural';

    const prompt = `You are a professional native-level Brazilian Portuguese and Indonesian conversational translator.

Translate the user's message from "${src}" to "${tgt}" using the tone/style: "${currentTone}".
Preserve exact meaning, intent, tone, emotional nuance, slang, abbreviations, technical terminology (such as offsets, APK, DEX, SO, Game Guardian, C++, Lua, scripts, coordinates), and conversational context.

For Brazilian Portuguese, use natural contemporary Brazilian Portuguese (PT-BR), including colloquial forms when appropriate. Never default to European Portuguese.
For Indonesian, use natural Indonesian that sounds like a real person chatting (using casual words like aku, kamu, gue, lu, bro, bang, banget sesuai gaya teks sumber).

Understand context rather than translating word by word. Correct obvious typos only when the intended meaning is clear. Never invent facts, omit important details, or add explanations.
Keep names, code, identifiers, game terminology, offsets, APK, DEX, SO, and other technical tokens unchanged when appropriate.

Return ONLY the translated text without any conversational filler, quotation marks, or extra explanations.

Text to translate:
${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text().trim();

    if (sessionId && process.env.DATABASE_URL) {
      await query(
        `CREATE TABLE IF NOT EXISTS translation_history (
          id SERIAL PRIMARY KEY,
          session_id VARCHAR(255),
          source_text TEXT,
          translated_text TEXT,
          source_lang VARCHAR(50),
          target_lang VARCHAR(50),
          tone VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        INSERT INTO translation_history (session_id, source_text, translated_text, source_lang, target_lang, tone) VALUES ($1, $2, $3, $4, $5, $6)`,
        [sessionId, text, translatedText, src, tgt, currentTone]
      ).catch(e => console.log('DB log skipped:', e.message));
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
