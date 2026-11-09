// /api/hall-dos-doadores — Hall dos Doadores público (somente leitura).
//
// GET → { doadores: [{ posicao, nome, categoria }] } do MAIOR para o MENOR.
// Sem auth, cacheável. NÃO expõe e-mail, RM nem valores exatos.
//
// Regras: total = soma de todas as doações (donor_summary.valor_total);
// entram apenas doadores que alcançaram o menor nível de category_tiers
// (hoje R$ 5.000 — vem da tabela, não do código).

import { pool } from './_lib/db.js';

// Decisão de produto fácil de mudar: expor o valor total exato de cada doador?
// Mantenha false enquanto o Fundo não decidir o contrário.
const EXIBIR_VALOR = false;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const r = await pool.query(
      `SELECT
         RANK() OVER (ORDER BY valor_total DESC)::int AS posicao,
         nome,
         categoria,
         valor_total
       FROM donor_summary
       WHERE valor_total >= (SELECT MIN(min_valor) FROM category_tiers)
         AND categoria IS NOT NULL
       ORDER BY valor_total DESC, nome ASC`
    );
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({
      doadores: r.rows.map((row) => ({
        posicao: row.posicao,
        nome: row.nome,
        categoria: row.categoria,
        ...(EXIBIR_VALOR ? { valorTotal: parseFloat(row.valor_total) } : {}),
      })),
    });
  } catch (err) {
    console.error('GET /api/hall-dos-doadores error:', err.message);
    return res.status(500).json({ error: 'Database error' });
  }
}
