import pkg from 'pg';
const { Pool } = pkg;

let pool;
export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set.');
    }
    pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
  }
  return pool;
}

export async function query(text, params) {
  const poolInstance = getPool();
  return await poolInstance.query(text, params);
}
