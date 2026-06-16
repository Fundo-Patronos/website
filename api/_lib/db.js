// Pool de conexão Postgres compartilhado entre serverless functions.
// Reutiliza entre invocações warm da mesma instância; em dev guarda no globalThis
// pra não vazar conexões a cada hot reload do Vercel dev.

import pg from 'pg';
const { Pool } = pg;

export const pool = globalThis.__pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pgPool = pool;
}
