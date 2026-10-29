import { query, getPool } from './neon.js';

export async function seedDatabase() {
  const pool = getPool();
  if (!pool) return;

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS translation_dictionary (
          id SERIAL PRIMARY KEY,
          source_lang VARCHAR(10) NOT NULL,
          target_lang VARCHAR(10) NOT NULL,
          source_phrase TEXT NOT NULL,
          target_phrase TEXT NOT NULL,
          category VARCHAR(50) DEFAULT 'general',
          CONSTRAINT unique_translation_pair UNIQUE (source_lang, target_lang, source_phrase)
      );
    `);

    const initialPairs = [
      ['id', 'pt-BR', 'aku nggak tahu bro', 'não sei, mano', 'chat'],
      ['id', 'pt-BR', 'gila mahal banget', 'caramba, tá caro demais', 'slang'],
      ['id', 'pt-BR', 'aku akan mencobanya nanti', 'vou tentar mais tarde', 'general'],
      ['id', 'pt-BR', 'kamu sedang apa?', 'o que você tá fazendo?', 'chat'],
      ['id', 'pt-BR', 'bagaimana cara menemukan offset ini?', 'como faço para encontrar esse offset?', 'technical'],
      ['id', 'pt-BR', 'aku cuma ingin tahu', 'só quero saber', 'general'],
      ['id', 'pt-BR', 'aku coba dulu nanti aku kasih tahu', 'vou tentar aqui e depois te aviso', 'natural'],
      ['id', 'pt-BR', 'kamu tahu cara menemukan offset itu', 'tu sabe como encontrar esse offset?', 'technical'],
      ['id', 'pt-BR', 'tidak tahu apa-apa', 'não faço ideia de nada', 'general'],
      ['id', 'pt-BR', 'bagaimana kabarmu', 'tudo bem com você?', 'general'],
      ['id', 'pt-BR', 'terima kasih banyak', 'muito obrigado', 'general'],
      ['pt-BR', 'id', 'tá muito caro, mano', 'mahal banget, bro', 'chat'],
      ['pt-BR', 'id', 'vou tentar aqui', 'aku coba dulu di sini', 'natural'],
      ['pt-BR', 'id', 'não faço ideia', 'aku sama sekali nggak tahu', 'general'],
      ['pt-BR', 'id', 'os caras conseguiram crackear', 'orang-orang itu berhasil nge-crack', 'technical'],
      ['pt-BR', 'id', 'tudo bem com você?', 'bagaimana kabarmu?', 'general'],
      ['pt-BR', 'id', 'muito obrigado', 'terima kasih banyak', 'general'],
      ['pt-BR', 'id', 'caramba, tá caro demais, mano', 'gila, mahal banget bro', 'slang'],
      ['pt-BR', 'id', 'tu sabe como encontrar esse offset?', 'kamu tahu cara menemukan offset itu?', 'technical']
    ];

    for (const p of initialPairs) {
      await query(
        `INSERT INTO translation_dictionary (source_lang, target_lang, source_phrase, target_phrase, category) 
         VALUES ($1, $2, $3, $4, $5) 
         ON CONFLICT (source_lang, target_lang, source_phrase) DO NOTHING`,
        [p[0], p[1], p[2], p[3], p[4]]
      );
    }
    console.log('Database seeding completed successfully.');
  } catch (err) {
    console.error('Seeding error:', err.message);
  }
}
