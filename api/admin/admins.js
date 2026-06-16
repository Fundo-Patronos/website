// /api/admin/admins
//
// GET    → lista todos os admins (apenas active = TRUE)
// POST   → adiciona admin (body: { email }). Idempotente — se já existir, reativa.
// DELETE → ?email=X. Safety: não permite remover a si mesmo (evita lockout).

import { pool } from '../_lib/db.js';
import { requireAdmin } from '../_lib/auth.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  const currentEmail = (admin.email || '').toLowerCase().trim();
  const bootstrapEmails = new Set(
    (process.env.ADMIN_EMAILS || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  );

  if (req.method === 'GET') {
    try {
      const r = await pool.query(
        `SELECT email, added_by, added_at FROM admins WHERE active = TRUE ORDER BY added_at`
      );
      const admins = r.rows.map((row) => ({
        email: row.email,
        addedBy: row.added_by,
        addedAt: row.added_at,
        isCurrentUser: row.email.toLowerCase() === currentEmail,
        isBootstrap: bootstrapEmails.has(row.email.toLowerCase()),
      }));
      return res.status(200).json({ admins, currentUserEmail: currentEmail });
    } catch (err) {
      console.error('GET /api/admin/admins error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'POST') {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email is required' });
    }
    const normalized = email.toLowerCase().trim();
    if (!EMAIL_REGEX.test(normalized)) {
      return res.status(400).json({ error: 'invalid email format' });
    }
    try {
      const r = await pool.query(
        `INSERT INTO admins (email, added_by)
         VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE SET
           active   = TRUE,
           added_by = EXCLUDED.added_by,
           added_at = NOW()
         RETURNING email`,
        [normalized, currentEmail]
      );
      return res.status(200).json({ ok: true, email: r.rows[0].email });
    } catch (err) {
      console.error('POST /api/admin/admins error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'DELETE') {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email query param is required' });
    }
    const normalized = email.toLowerCase().trim();

    // Safety: não pode remover a si mesmo
    if (normalized === currentEmail) {
      return res.status(400).json({
        error: 'Você não pode remover a si mesmo — peça pra outro admin fazer isso',
      });
    }

    try {
      const r = await pool.query(
        `DELETE FROM admins WHERE LOWER(email) = $1 RETURNING email`,
        [normalized]
      );
      if (r.rowCount === 0) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Aviso se o email removido continua no ADMIN_EMAILS env var
      const stillBootstrap = bootstrapEmails.has(normalized);
      return res.status(200).json({
        ok: true,
        deletedEmail: r.rows[0].email,
        warning: stillBootstrap
          ? 'Email removido da tabela, mas ainda está em ADMIN_EMAILS (env var) — continua tendo acesso. Remova da Vercel env se quiser revogar de verdade.'
          : null,
      });
    } catch (err) {
      console.error('DELETE /api/admin/admins error:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
