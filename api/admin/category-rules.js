// /api/admin/category-rules
//
// GET → retorna { minPatrono, minAssociado } atuais
// PUT → atualiza thresholds (impacta o cálculo de categoria no donor_summary view)

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'GET') {
    try {
      const r = await pool.query(
        `SELECT min_patrono, min_associado, updated_at FROM category_rules WHERE id = 1`
      );
      if (r.rows.length === 0) {
        return res.status(500).json({ error: 'category_rules singleton missing' });
      }
      const row = r.rows[0];
      return res.status(200).json({
        minPatrono: parseFloat(row.min_patrono),
        minAssociado: parseFloat(row.min_associado),
        updatedAt: row.updated_at,
      });
    } catch (err) {
      console.error('GET /api/admin/category-rules error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'PUT') {
    const { minPatrono, minAssociado } = req.body || {};

    const mp = parseFloat(minPatrono);
    const ma = parseFloat(minAssociado);

    if (!Number.isFinite(mp) || mp <= 0) {
      return res.status(400).json({ error: 'minPatrono must be a positive number' });
    }
    if (!Number.isFinite(ma) || ma <= 0) {
      return res.status(400).json({ error: 'minAssociado must be a positive number' });
    }
    if (mp <= ma) {
      return res.status(400).json({ error: 'minPatrono must be greater than minAssociado' });
    }

    try {
      await pool.query(
        `UPDATE category_rules
         SET min_patrono = $1, min_associado = $2, updated_at = NOW()
         WHERE id = 1`,
        [mp, ma]
      );
      return res.status(200).json({ minPatrono: mp, minAssociado: ma });
    } catch (err) {
      console.error('PUT /api/admin/category-rules error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
