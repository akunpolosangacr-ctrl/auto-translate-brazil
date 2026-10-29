import { GoogleGenerativeAI } from "@google/generative-ai";

export async function translateText({ text, sourceLang, targetLang, tone }) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error('AI_API_KEY is not configured on environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.AI_MODEL || 'gemini-1.5-flash';
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `You are a professional native-level Brazilian Portuguese and Indonesian conversational translator.

Translate the user's message from "${sourceLang}" to "${targetLang}" using the tone/style: "${tone || 'natural'}".
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
  return response.text().trim();
}
