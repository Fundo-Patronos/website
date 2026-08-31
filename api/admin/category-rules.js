// /api/admin/category-rules
//
// Gerencia os thresholds das 6 categorias oficiais (tabela category_tiers).
// Os NOMES são fixos (vêm do Relatório Anual); o admin edita apenas o valor mínimo.
//
// GET → { categorias: [{ id, nome, minValor, beneficios, updatedAt }] } (ordem crescente)
// PUT → body { id, minValor } atualiza o mínimo de UMA categoria.
//       Recusa valores que quebrem a ordem (cada tier deve continuar entre os vizinhos).

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'GET') {
    try {
      const r = await pool.query(
        `SELECT id, nome, min_valor, beneficios, updated_at
         FROM category_tiers ORDER BY min_valor ASC`
      );
      return res.status(200).json({
        categorias: r.rows.map((row) => ({
          id: row.id,
          nome: row.nome,
          minValor: parseFloat(row.min_valor),
          beneficios: row.beneficios || [],
          updatedAt: row.updated_at,
        })),
      });
    } catch (err) {
      console.error('GET /api/admin/category-rules error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'PUT') {
    const { id, minValor } = req.body || {};
    const tierId = parseInt(id, 10);
    const mv = parseFloat(minValor);

    if (!Number.isFinite(tierId) || tierId <= 0) {
      return res.status(400).json({ error: 'id is required (positive integer)' });
    }
    if (!Number.isFinite(mv) || mv <= 0) {
      return res.status(400).json({ error: 'minValor must be a positive number' });
    }

    try {
      // Valida que o novo mínimo mantém a escada estritamente crescente:
      // maior que o mínimo do tier abaixo e menor que o do tier acima.
      const all = await pool.query(
        `SELECT id, nome, min_valor FROM category_tiers ORDER BY min_valor ASC`
      );
      const idx = all.rows.findIndex((r) => r.id === tierId);
      if (idx === -1) {
        return res.status(404).json({ error: 'Categoria not found' });
      }
      const below = idx > 0 ? parseFloat(all.rows[idx - 1].min_valor) : 0;
      const above = idx < all.rows.length - 1 ? parseFloat(all.rows[idx + 1].min_valor) : Infinity;
      if (mv <= below || mv >= above) {
        return res.status(400).json({
          error: `minValor de ${all.rows[idx].nome} deve ficar entre ${below} e ${above === Infinity ? '∞' : above} (exclusivo)`,
        });
      }

      const r = await pool.query(
        `UPDATE category_tiers SET min_valor = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id, nome, min_valor, beneficios, updated_at`,
        [mv, tierId]
      );
      const row = r.rows[0];
      return res.status(200).json({
        categoria: {
          id: row.id,
          nome: row.nome,
          minValor: parseFloat(row.min_valor),
          beneficios: row.beneficios || [],
          updatedAt: row.updated_at,
        },
      });
    } catch (err) {
      console.error('PUT /api/admin/category-rules error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
