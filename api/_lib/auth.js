// Helper de autenticação Firebase Admin para serverless functions.
// Reutiliza a app inicializada entre invocações warm.

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getFirebaseApp() {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // O private_key vem com `\n` literais (vinda do JSON do service account);
  // pra Firebase aceitar, precisa virar newlines reais.
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
 * Retorna o payload decodificado ({ email, uid, ... }) ou null se inválido.
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
 * Checa se o email pertence à lista ADMIN_EMAILS (env var, separados por vírgula).
 */
export function isAdmin(email) {
  if (!email) return false;
  const allowed = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

/**
 * Middleware-ish: verifica token + admin. Se OK retorna o payload do token.
 * Se não, responde direto com 401/403 e retorna null (handler deve dar return).
 */
export async function requireAdmin(req, res) {
  const decoded = await verifyIdToken(req.headers.authorization);
  if (!decoded) {
    res.status(401).json({ error: 'Unauthorized — missing or invalid token' });
    return null;
  }
  if (!isAdmin(decoded.email)) {
    res.status(403).json({ error: 'Forbidden — admin access required' });
    return null;
  }
  return decoded;
}
