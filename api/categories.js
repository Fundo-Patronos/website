// /api/categories — lista pública das categorias de doação (do Relatório Anual).
//
// GET → { categorias: [{ nome, minValor, beneficios }] } ordenado por minValor asc.
// Sem auth: o conteúdo é público (está no Relatório Anual). Cacheável.

import { pool } from './_lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const r = await pool.query(
      `SELECT nome, min_valor, beneficios
       FROM category_tiers
       ORDER BY min_valor ASC`
    );
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return res.status(200).json({
      categorias: r.rows.map((row) => ({
        nome: row.nome,
        minValor: parseFloat(row.min_valor),
        beneficios: row.beneficios || [],
      })),
    });
  } catch (err) {
    console.error('GET /api/categories error:', err.message);
    return res.status(500).json({ error: 'Database error' });
  }
}
