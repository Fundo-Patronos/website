// /api/admin/donors
//
// GET  → lista todos os doadores (via donor_summary view)
// POST → upsert de perfil (campos manuais: nome, tipo_contribuicao, etc.)
//        valor_total, data_primeira_doacao e categoria são COMPUTADOS, não enviados.

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'GET') {
    try {
      const r = await pool.query(`
        SELECT
          email,
          nome,
          valor_total,
          valor_assinatura,
          categoria,
          tipo_contribuicao,
          data_primeira_doacao,
          estado_assinatura
        FROM donor_summary
        ORDER BY valor_total DESC NULLS LAST, nome ASC
      `);
      const donors = r.rows.map((row) => ({
        email: row.email,
        nome: row.nome,
        valorTotal: parseFloat(row.valor_total) || 0,
        valorAssinatura: parseFloat(row.valor_assinatura) || 0,
        categoria: row.categoria,
        tipoContribuicao: row.tipo_contribuicao,
        dataPrimeiraDoacao: row.data_primeira_doacao
          ? new Date(row.data_primeira_doacao).toISOString().split('T')[0]
          : null,
        estadoAssinatura: row.estado_assinatura,
      }));
      return res.status(200).json({ donors });
    } catch (err) {
      console.error('GET /api/admin/donors error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'POST') {
    const { email, nome, tipoContribuicao, estadoAssinatura, valorAssinatura } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email is required' });
    }
    if (!nome || typeof nome !== 'string') {
      return res.status(400).json({ error: 'nome is required' });
    }

    const validTipos = ['Pontual', 'Recorrente'];
    const tipo = validTipos.includes(tipoContribuicao) ? tipoContribuicao : 'Pontual';

    const validEstados = ['Ativa', 'Pausada', 'Cancelada', 'N/A'];
    const estado = validEstados.includes(estadoAssinatura) ? estadoAssinatura : 'N/A';

    const vAssin = parseFloat(valorAssinatura);
    const valorA = Number.isFinite(vAssin) && vAssin >= 0 ? vAssin : 0;

    try {
      await pool.query(
        `INSERT INTO donors (email, nome, tipo_contribuicao, estado_assinatura, valor_assinatura)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO UPDATE SET
           nome              = EXCLUDED.nome,
           tipo_contribuicao = EXCLUDED.tipo_contribuicao,
           estado_assinatura = EXCLUDED.estado_assinatura,
           valor_assinatura  = EXCLUDED.valor_assinatura,
           updated_at        = NOW()`,
        [email.trim(), nome.trim(), tipo, estado, valorA]
      );
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('POST /api/admin/donors error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
