// Helper de autenticação Firebase Admin + check de admin para serverless functions.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { pool } from './db.js';

function getFirebaseApp() {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Missing Firebase Admin credentials');
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

/**
 * Extrai e valida o ID token do header Authorization.
 * Retorna o payload decodificado ou null se inválido.
 */
export async function verifyIdToken(authHeader) {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;
  try {
    return await getAuth(getFirebaseApp()).verifyIdToken(token);
  } catch (err) {
    console.error('verifyIdToken failed:', err.code || err.message);
    return null;
  }
}

/**
 * Checa se o email é admin. Duas camadas:
 *   1. ADMIN_EMAILS env var — fallback de emergência (zero dependência de DB)
 *   2. Tabela `admins` no Postgres — gerenciada via UI /admin
 * Se qualquer uma retornar true → é admin.
 */
export async function isAdmin(email) {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();

  // 1. Env var bootstrap
  const envAdmins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (envAdmins.includes(normalized)) return true;

  // 2. DB-managed admins
  try {
    const r = await pool.query(
      `SELECT 1 FROM admins WHERE LOWER(email) = $1 AND active = TRUE LIMIT 1`,
      [normalized]
    );
    return r.rowCount > 0;
  } catch (err) {
    console.error('isAdmin DB check failed:', err.message);
    // Se DB cair, ainda há o fallback do env. Quem está só na DB perde acesso temporariamente.
    return false;
  }
}

/**
 * Middleware-ish: verifica token + admin. Retorna payload do token se OK,
 * ou null (depois de já ter respondido 401/403) se não.
 */
export async function requireAdmin(req, res) {
  const decoded = await verifyIdToken(req.headers.authorization);
  if (!decoded) {
    res.status(401).json({ error: 'Unauthorized — missing or invalid token' });
    return null;
  }
  if (!(await isAdmin(decoded.email))) {
    res.status(403).json({ error: 'Forbidden — admin access required' });
    return null;
  }
  return decoded;
}
