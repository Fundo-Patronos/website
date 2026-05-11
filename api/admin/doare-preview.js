// /api/admin/doare-preview
//
// POST: recebe linhas já parseadas do CSV doa.re e devolve análise.
//   - Filtra Status === 'Paga' (descarta cancelada/falha/etc)
//   - Agrupa por email pra inferir perfil (Recorrente se há ao menos uma Assinatura)
//   - Dedup contra donors (por email) → newProfiles vs existingProfiles
//   - Dedup contra donation_events (por source_id) → newEvents vs existingEventCount
//
// Body esperado:
// {
//   rows: [
//     { id, email, nome, tipo, status, valorBruto, valorLiquido, dataPagamento, periodicidade, idAssinatura },
//     ...
//   ]
// }

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { rows } = req.body || {};
  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: 'rows array required' });
  }

  // 1. Filtra Status === 'Paga'
  const paidRows = rows.filter((r) => r && r.status === 'Paga');
  const skippedNotPaid = rows.length - paidRows.length;

  // 2. Normaliza emails e descarta linhas sem email
  const normalized = paidRows
    .map((r) => ({
      ...r,
      email: String(r.email || '').toLowerCase().trim(),
    }))
    .filter((r) => r.email);

  // 3. Agrupa por email pra inferir perfil
  const byEmail = new Map();
  for (const r of normalized) {
    if (!byEmail.has(r.email)) byEmail.set(r.email, []);
    byEmail.get(r.email).push(r);
  }

  const emailList = [...byEmail.keys()];

  // 4. Busca quais emails já têm perfil em donors
  let existingEmailSet = new Set();
  if (emailList.length > 0) {
    const r = await pool.query(
      `SELECT LOWER(email) AS email FROM donors WHERE LOWER(email) = ANY($1::text[])`,
      [emailList]
    );
    existingEmailSet = new Set(r.rows.map((row) => row.email));
  }

  // 5. Busca quais source_ids já existem em donation_events
  const allIds = normalized.map((r) => r.id).filter(Boolean);
  let existingIdSet = new Set();
  if (allIds.length > 0) {
    const r = await pool.query(
      `SELECT source_id FROM donation_events
       WHERE source = 'doare' AND source_id = ANY($1::text[])`,
      [allIds]
    );
    existingIdSet = new Set(r.rows.map((row) => row.source_id));
  }

  // 6. Monta lista de perfis novos e existentes
  const newProfiles = [];
  const existingProfilesSample = [];
  for (const [email, txs] of byEmail) {
    const hasSubscription = txs.some((t) => t.tipo === 'Assinatura');
    const tipoContribuicao = hasSubscription ? 'Recorrente' : 'Pontual';
    const estadoAssinatura = hasSubscription ? 'Ativa' : 'N/A';

    // valor_assinatura: pega o valor bruto da assinatura mais recente
    let valorAssinatura = 0;
    if (hasSubscription) {
      const subs = txs
        .filter((t) => t.tipo === 'Assinatura' && Number.isFinite(t.valorBruto))
        .sort((a, b) => new Date(b.dataPagamento) - new Date(a.dataPagamento));
      valorAssinatura = subs[0]?.valorBruto || 0;
    }

    // Nome: pega da transação mais recente (provável estar mais atualizado)
    const sortedByDate = [...txs].sort(
      (a, b) => new Date(b.dataPagamento) - new Date(a.dataPagamento)
    );
    const nome = (sortedByDate[0]?.nome || '').trim();

    const totalAmount = txs.reduce(
      (s, t) => s + (Number.isFinite(t.valorBruto) ? t.valorBruto : 0),
      0
    );

    const profile = {
      email,
      nome,
      tipoContribuicao,
      estadoAssinatura,
      valorAssinatura,
      transactionCount: txs.length,
      totalAmount,
    };

    if (existingEmailSet.has(email)) {
      if (existingProfilesSample.length < 20) {
        existingProfilesSample.push(profile);
      }
    } else {
      newProfiles.push(profile);
    }
  }

  // 7. Monta lista de eventos novos
  const newEvents = [];
  let existingEventCount = 0;
  for (const r of normalized) {
    if (!r.id) continue;
    if (existingIdSet.has(r.id)) {
      existingEventCount++;
      continue;
    }
    const amount = Number.isFinite(r.valorBruto) ? r.valorBruto : null;
    if (amount === null || amount <= 0) continue;
    if (!r.dataPagamento) continue;
    newEvents.push({
      sourceId: r.id,
      email: r.email,
      amount,
      occurredAt: r.dataPagamento,
      tipo: r.tipo,
    });
  }

  return res.status(200).json({
    stats: {
      totalRows: rows.length,
      skippedNotPaid,
      validRows: normalized.length,
      uniqueEmails: byEmail.size,
      newProfileCount: newProfiles.length,
      existingProfileCount: byEmail.size - newProfiles.length,
      newEventCount: newEvents.length,
      existingEventCount,
    },
    newProfiles: newProfiles.sort((a, b) => b.totalAmount - a.totalAmount),
    existingProfilesSample,
    newEvents: newEvents.sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt)),
  });
}
