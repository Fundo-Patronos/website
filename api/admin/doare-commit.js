// /api/admin/doare-commit
//
// POST: commita o que veio do preview. Roda em uma das duas modalidades:
//   - mode === 'profiles' → insere perfis novos (ON CONFLICT DO NOTHING)
//   - mode === 'events'   → insere eventos novos (ON CONFLICT no índice único faz nada)
//
// Faz dedup de novo no nível do banco — defesa em profundidade contra race
// conditions ou reupload do mesmo CSV.

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mode, profiles, events } = req.body || {};

  if (mode === 'profiles') {
    if (!Array.isArray(profiles)) {
      return res.status(400).json({ error: 'profiles array required' });
    }
    let inserted = 0;
    let skipped = 0;
    let failed = 0;

    for (const p of profiles) {
      if (!p?.email || !p?.nome) { skipped++; continue; }
      try {
        const r = await pool.query(
          `INSERT INTO donors (email, nome, tipo_contribuicao, estado_assinatura, valor_assinatura)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (email) DO NOTHING
           RETURNING email`,
          [
            p.email.trim().toLowerCase(),
            p.nome.trim(),
            p.tipoContribuicao === 'Recorrente' ? 'Recorrente' : 'Pontual',
            ['Ativa', 'Pausada', 'Cancelada', 'N/A'].includes(p.estadoAssinatura) ? p.estadoAssinatura : 'N/A',
            Number.isFinite(p.valorAssinatura) ? p.valorAssinatura : 0,
          ]
        );
        if (r.rowCount > 0) inserted++;
        else skipped++;
      } catch (err) {
        console.error('Profile insert failed:', p.email, err.message);
        failed++;
      }
    }
    return res.status(200).json({ inserted, skipped, failed });
  }

  if (mode === 'events') {
    if (!Array.isArray(events)) {
      return res.status(400).json({ error: 'events array required' });
    }
    let inserted = 0;
    let skipped = 0;
    let failed = 0;

    for (const e of events) {
      if (!e?.sourceId || !e?.email || !Number.isFinite(e?.amount) || !e?.occurredAt) {
        skipped++; continue;
      }
      try {
        // ON CONFLICT no índice único parcial (source, source_id) — dedup garantida
        const r = await pool.query(
          `INSERT INTO donation_events (donor_email, amount, occurred_at, source, source_id)
           VALUES ($1, $2, $3::date, 'doare', $4)
           ON CONFLICT (source, source_id) WHERE source_id IS NOT NULL DO NOTHING
           RETURNING id`,
          [e.email.trim().toLowerCase(), e.amount, e.occurredAt, e.sourceId]
        );
        if (r.rowCount > 0) inserted++;
        else skipped++;
      } catch (err) {
        console.error('Event insert failed:', e.sourceId, err.message);
        failed++;
      }
    }
    return res.status(200).json({ inserted, skipped, failed });
  }

  return res.status(400).json({ error: "mode must be 'profiles' or 'events'" });
}
