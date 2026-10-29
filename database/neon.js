import pkg from 'pg';
const { Pool } = pkg;

let pool;
export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return null;
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
  if (!poolInstance) return null;
  try {
    return await poolInstance.query(text, params);
  } catch (error) {
    console.error('Database query error:', error.message);
    return null;
  }
}
