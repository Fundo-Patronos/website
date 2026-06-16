// /api/admin/stats
//
// GET → retorna agregações pro dashboard do admin. Roda todas as queries
// em paralelo via Promise.all pra responder rápido mesmo com muitas linhas.

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [
      totals,
      byCategory,
      bySource,
      monthlyTimeline,
      topDonors,
      recentEvents,
      newDonorsByMonth,
      byDomain,
    ] = await Promise.all([
      // Totais agregados (uma única query com várias agregações)
      pool.query(`
        SELECT
          COALESCE(SUM(amount), 0)::numeric AS lifetime_raised,
          COALESCE(SUM(CASE WHEN occurred_at >= DATE_TRUNC('year',  CURRENT_DATE) THEN amount END), 0)::numeric AS year_raised,
          COALESCE(SUM(CASE WHEN occurred_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount END), 0)::numeric AS month_raised,
          COUNT(*)::int                                          AS event_count,
          COALESCE(AVG(amount), 0)::numeric                      AS avg_donation
        FROM donation_events
      `),

      // Distribuição por categoria (da view)
      pool.query(`
        SELECT
          categoria,
          COUNT(*)::int               AS count,
          COALESCE(SUM(valor_total), 0)::numeric AS total
        FROM donor_summary
        GROUP BY categoria
        ORDER BY CASE categoria WHEN 'Patrono' THEN 1 WHEN 'Associado' THEN 2 ELSE 3 END
      `),

      // Distribuição por source (eventos)
      pool.query(`
        SELECT
          COALESCE(source, 'unknown') AS source,
          COUNT(*)::int               AS count,
          COALESCE(SUM(amount), 0)::numeric AS total
        FROM donation_events
        GROUP BY source
        ORDER BY total DESC
      `),

      // Timeline mensal (últimos 12 meses, com breakdown por source)
      pool.query(`
        WITH months AS (
          SELECT generate_series(
            DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months'),
            DATE_TRUNC('month', CURRENT_DATE),
            INTERVAL '1 month'
          )::date AS month_start
        )
        SELECT
          TO_CHAR(m.month_start, 'YYYY-MM') AS month,
          COALESCE(COUNT(e.id), 0)::int                                                   AS count,
          COALESCE(SUM(e.amount), 0)::numeric                                             AS total,
          COALESCE(SUM(CASE WHEN e.source = 'doare' THEN e.amount END), 0)::numeric        AS total_doare,
          COALESCE(SUM(CASE WHEN e.source = 'pix'   THEN e.amount END), 0)::numeric        AS total_pix,
          COALESCE(SUM(CASE WHEN e.source NOT IN ('doare','pix') THEN e.amount END), 0)::numeric AS total_outros,
          COALESCE(COUNT(CASE WHEN e.source = 'doare' THEN 1 END), 0)::int                AS count_doare,
          COALESCE(COUNT(CASE WHEN e.source = 'pix'   THEN 1 END), 0)::int                AS count_pix
        FROM months m
        LEFT JOIN donation_events e
          ON DATE_TRUNC('month', e.occurred_at) = m.month_start
        GROUP BY m.month_start
        ORDER BY m.month_start
      `),

      // Top 10 doadores
      pool.query(`
        SELECT email, nome, valor_total, categoria
        FROM donor_summary
        WHERE valor_total > 0
        ORDER BY valor_total DESC
        LIMIT 10
      `),

      // 10 eventos mais recentes
      pool.query(`
        SELECT id, donor_email, amount, occurred_at, source
        FROM donation_events
        ORDER BY occurred_at DESC, id DESC
        LIMIT 10
      `),

      // Doadores cadastrados ao longo do tempo (mês do created_at)
      pool.query(`
        WITH months AS (
          SELECT generate_series(
            DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months'),
            DATE_TRUNC('month', CURRENT_DATE),
            INTERVAL '1 month'
          )::date AS month_start
        )
        SELECT
          TO_CHAR(m.month_start, 'YYYY-MM') AS month,
          COALESCE(COUNT(d.email), 0)::int  AS count
        FROM months m
        LEFT JOIN donors d
          ON DATE_TRUNC('month', d.created_at) = m.month_start
        GROUP BY m.month_start
        ORDER BY m.month_start
      `),

      // Distribuição por domínio de email (junta perfis com valor agregado)
      pool.query(`
        SELECT
          SPLIT_PART(LOWER(d.email), '@', 2)                  AS domain,
          COUNT(*)::int                                       AS count,
          COALESCE(SUM(ds.valor_total), 0)::numeric           AS total
        FROM donors d
        LEFT JOIN donor_summary ds ON LOWER(ds.email) = LOWER(d.email)
        GROUP BY SPLIT_PART(LOWER(d.email), '@', 2)
        ORDER BY count DESC
      `),
    ]);

    // Donor counts em uma query separada (mais clean que misturar nos totals)
    const counts = await pool.query(`
      SELECT
        (SELECT COUNT(*)::int FROM donors)                                                          AS donor_count,
        (SELECT COUNT(*)::int FROM donors WHERE estado_assinatura = 'Ativa')                        AS subscriber_count,
        (SELECT COUNT(*)::int FROM donor_summary WHERE valor_total > 0)                             AS with_donations_count,
        (SELECT COUNT(DISTINCT donor_email)::int FROM donation_events
          WHERE LOWER(donor_email) NOT IN (SELECT LOWER(email) FROM donors))                        AS orphan_donor_count
    `);

    const t = totals.rows[0];
    const c = counts.rows[0];

    return res.status(200).json({
      totals: {
        lifetimeRaised: parseFloat(t.lifetime_raised),
        yearRaised:     parseFloat(t.year_raised),
        monthRaised:    parseFloat(t.month_raised),
        eventCount:     t.event_count,
        avgDonation:    parseFloat(t.avg_donation),
        donorCount:        c.donor_count,
        subscriberCount:   c.subscriber_count,
        withDonationsCount:c.with_donations_count,
        orphanDonorCount:  c.orphan_donor_count,
      },
      byCategory: byCategory.rows.map((r) => ({
        categoria: r.categoria,
        count: r.count,
        total: parseFloat(r.total),
      })),
      bySource: bySource.rows.map((r) => ({
        source: r.source,
        count: r.count,
        total: parseFloat(r.total),
      })),
      monthlyTimeline: monthlyTimeline.rows.map((r) => ({
        month: r.month,
        count: r.count,
        total: parseFloat(r.total),
        totalDoare: parseFloat(r.total_doare),
        totalPix: parseFloat(r.total_pix),
        totalOutros: parseFloat(r.total_outros),
        countDoare: r.count_doare,
        countPix: r.count_pix,
      })),
      newDonorsByMonth: newDonorsByMonth.rows.map((r) => ({
        month: r.month,
        count: r.count,
      })),
      topDonors: topDonors.rows.map((r) => ({
        email: r.email,
        nome: r.nome,
        valorTotal: parseFloat(r.valor_total),
        categoria: r.categoria,
      })),
      recentEvents: recentEvents.rows.map((r) => ({
        id: r.id,
        email: r.donor_email,
        amount: parseFloat(r.amount),
        occurredAt: new Date(r.occurred_at).toISOString().split('T')[0],
        source: r.source,
      })),
      byDomain: byDomain.rows.map((r) => ({
        domain: r.domain || '(sem domínio)',
        count: r.count,
        total: parseFloat(r.total),
      })),
    });
  } catch (err) {
    console.error('GET /api/admin/stats error:', err.message);
    return res.status(500).json({ error: 'Database error' });
  }
}
