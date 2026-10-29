import pkg from 'pg';
const { Pool } = pkg;

let pool;
export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is missing.');
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 5000,
    });
  }
  return pool;
}

export async function query(text, params) {
  const poolInstance = getPool();
  try {
    const res = await poolInstance.query(text, params);
    return res;
  } catch (error) {
    console.error('Database query execution error:', error.message);
    throw error;
  }
}
