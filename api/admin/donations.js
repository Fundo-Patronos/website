// /api/admin/donations
//
// POST → adiciona um evento de doação (PIX por enquanto). Sem auto-criar perfil;
//        se o email não tem perfil em donors, o evento fica órfão até alguém cadastrar.
// GET  → opcional v1: ?email=X retorna histórico de eventos daquele email
//        sem ?email retorna lista paginada (limite 100)

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'POST') {
    const { email, amount, occurredAt, source } = req.body || {};

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email is required' });
    }

    const amt = parseFloat(amount);
    if (!Number.isFinite(amt) || amt <= 0) {
      return res.status(400).json({ error: 'amount must be a positive number' });
    }

    // occurredAt: aceita "YYYY-MM-DD" ou ISO; valida no Postgres via cast.
    if (!occurredAt || typeof occurredAt !== 'string') {
      return res.status(400).json({ error: 'occurredAt (YYYY-MM-DD) is required' });
    }

    const src = (source && typeof source === 'string' ? source.trim() : 'pix').slice(0, 40);

    try {
      const r = await pool.query(
        `INSERT INTO donation_events (donor_email, amount, occurred_at, source)
         VALUES ($1, $2, $3::date, $4)
         RETURNING id, donor_email, amount, occurred_at, source, created_at`,
        [email.trim(), amt, occurredAt, src]
      );
      const row = r.rows[0];
      return res.status(201).json({
        event: {
          id: row.id,
          email: row.donor_email,
          amount: parseFloat(row.amount),
          occurredAt: new Date(row.occurred_at).toISOString().split('T')[0],
          source: row.source,
          createdAt: row.created_at,
        },
      });
    } catch (err) {
      console.error('POST /api/admin/donations error:', err.message);
      if (err.code === '22007' || err.code === '22008') {
        return res.status(400).json({ error: 'occurredAt must be a valid date (YYYY-MM-DD)' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'GET') {
    const { email, limit: limitRaw } = req.query;
    const limit = Math.min(parseInt(limitRaw, 10) || 100, 500);

    try {
      let r;
      if (email && typeof email === 'string') {
        r = await pool.query(
          `SELECT id, donor_email, amount, occurred_at, source, created_at
           FROM donation_events
           WHERE LOWER(donor_email) = LOWER($1)
           ORDER BY occurred_at DESC, id DESC
           LIMIT $2`,
          [email.trim(), limit]
        );
      } else {
        r = await pool.query(
          `SELECT id, donor_email, amount, occurred_at, source, created_at
           FROM donation_events
           ORDER BY occurred_at DESC, id DESC
           LIMIT $1`,
          [limit]
        );
      }
      const events = r.rows.map((row) => ({
        id: row.id,
        email: row.donor_email,
        amount: parseFloat(row.amount),
        occurredAt: new Date(row.occurred_at).toISOString().split('T')[0],
        source: row.source,
        createdAt: row.created_at,
      }));
      return res.status(200).json({ events });
    } catch (err) {
      console.error('GET /api/admin/donations error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    const eventId = parseInt(id, 10);
    if (!Number.isFinite(eventId) || eventId <= 0) {
      return res.status(400).json({ error: 'id query param is required (positive integer)' });
    }

    const { email, amount, occurredAt, source } = req.body || {};

    // Permite atualização parcial: só campos que vierem no body são alterados.
    const setClauses = [];
    const values = [];
    let idx = 1;

    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        return res.status(400).json({ error: 'email must be a non-empty string' });
      }
      setClauses.push(`donor_email = $${idx++}`);
      values.push(email.trim());
    }
    if (amount !== undefined) {
      const amt = parseFloat(amount);
      if (!Number.isFinite(amt) || amt <= 0) {
        return res.status(400).json({ error: 'amount must be a positive number' });
      }
      setClauses.push(`amount = $${idx++}`);
      values.push(amt);
    }
    if (occurredAt !== undefined) {
      if (typeof occurredAt !== 'string' || !occurredAt) {
        return res.status(400).json({ error: 'occurredAt must be YYYY-MM-DD' });
      }
      setClauses.push(`occurred_at = $${idx++}::date`);
      values.push(occurredAt);
    }
    if (source !== undefined) {
      if (typeof source !== 'string') {
        return res.status(400).json({ error: 'source must be a string' });
      }
      setClauses.push(`source = $${idx++}`);
      values.push(source.trim().slice(0, 40));
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(eventId);
    try {
      const r = await pool.query(
        `UPDATE donation_events
         SET ${setClauses.join(', ')}
         WHERE id = $${idx}
         RETURNING id, donor_email, amount, occurred_at, source, created_at`,
        values
      );
      if (r.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      const row = r.rows[0];
      return res.status(200).json({
        event: {
          id: row.id,
          email: row.donor_email,
          amount: parseFloat(row.amount),
          occurredAt: new Date(row.occurred_at).toISOString().split('T')[0],
          source: row.source,
          createdAt: row.created_at,
        },
      });
    } catch (err) {
      console.error('PUT /api/admin/donations error:', err.message);
      if (err.code === '22007' || err.code === '22008') {
        return res.status(400).json({ error: 'occurredAt must be a valid date (YYYY-MM-DD)' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    const eventId = parseInt(id, 10);
    if (!Number.isFinite(eventId) || eventId <= 0) {
      return res.status(400).json({ error: 'id query param is required (positive integer)' });
    }
    try {
      const r = await pool.query(
        `DELETE FROM donation_events WHERE id = $1 RETURNING id`,
        [eventId]
      );
      if (r.rowCount === 0) {
        return res.status(404).json({ error: 'Event not found' });
      }
      return res.status(200).json({ ok: true, deletedId: r.rows[0].id });
    } catch (err) {
      console.error('DELETE /api/admin/donations error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
