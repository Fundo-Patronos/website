/* eslint-disable no-undef */
// Vercel Serverless Function — busca dados do doador no Postgres (Railway).
//
// Endpoint: GET /api/donor-data?email=<email>
// Resposta 200: { email, nome, valorTotal, valorAssinatura, categoria, tipoContribuicao, dataPrimeiraDoacao, estadoAssinatura }
// Resposta 404: { error: 'Donor not found' }
// Resposta 500: { error: 'Server configuration error' | 'Database error' | 'Internal server error' }

import pg from 'pg';
const { Pool } = pg;

// Reusa o pool entre invocações da mesma instância warm da função.
// Em dev (HMR/vercel dev), guarda no globalThis pra não vazar conexões a cada hot reload.
const pool = globalThis.__pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 5,                       // máximo de conexões por instância
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});
if (process.env.NODE_ENV !== 'production') {
  globalThis.__pgPool = pool;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  if (!process.env.DATABASE_URL) {
    console.error('Missing DATABASE_URL');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const result = await pool.query(
      `SELECT
         email,
         nome,
         valor_total,
         valor_assinatura,
         categoria,
         tipo_contribuicao,
         data_primeira_doacao,
         estado_assinatura
       FROM donors
       WHERE LOWER(email) = LOWER($1)
       LIMIT 1`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    const row = result.rows[0];

    // Mapeia snake_case (Postgres) → camelCase (frontend).
    // Mantém o mesmo formato da versão anterior (Google Sheets) pra não quebrar o dashboard.
    const donorData = {
      email: row.email || '',
      nome: row.nome || '',
      valorTotal: parseFloat(row.valor_total) || 0,
      valorAssinatura: parseFloat(row.valor_assinatura) || 0,
      categoria: row.categoria || 'Amigo',
      tipoContribuicao: row.tipo_contribuicao || 'Pontual',
      dataPrimeiraDoacao: row.data_primeira_doacao
        ? new Date(row.data_primeira_doacao).toISOString().split('T')[0]
        : '',
      estadoAssinatura: row.estado_assinatura || 'N/A',
    };

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(donorData);
  } catch (err) {
    console.error('Database error:', err.message);
    return res.status(500).json({ error: 'Database error' });
  }
}
