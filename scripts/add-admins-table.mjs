// scripts/add-admins-table.mjs
//
// Cria a tabela `admins` e popula com os emails já em ADMIN_EMAILS env var.
// A env var continua funcionando como fallback de emergência (no auth.js, ela é
// checada antes da DB) pra evitar lockout total se o banco ficar inacessível.
//
// Idempotente.
//
// Uso:
//   node --env-file=.env.local scripts/add-admins-table.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('✓ Conectado ao Postgres');

  await client.query('BEGIN');
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        email     VARCHAR(255) PRIMARY KEY,
        added_by  VARCHAR(255),
        added_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        active    BOOLEAN     NOT NULL DEFAULT TRUE
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_admins_email_lower ON admins (LOWER(email));`);
    console.log('✓ Tabela admins pronta');

    // Seed dos emails que estão em ADMIN_EMAILS (env var)
    const envAdmins = (process.env.ADMIN_EMAILS || '')
      .split(',').map((s) => s.trim()).filter(Boolean);

    if (envAdmins.length === 0) {
      console.log('⊘ ADMIN_EMAILS vazia — nada a seedar');
    } else {
      console.log(`Seeding ${envAdmins.length} admin(s) de ADMIN_EMAILS:`);
      for (const email of envAdmins) {
        const r = await client.query(
          `INSERT INTO admins (email, added_by)
           VALUES ($1, 'env_bootstrap')
           ON CONFLICT (email) DO NOTHING
           RETURNING email`,
          [email.toLowerCase()]
        );
        console.log(`  ${r.rowCount > 0 ? '✓ Adicionado' : '⊘ Já existe '}: ${email}`);
      }
    }

    await client.query('COMMIT');

    // Estado final
    const all = await client.query(`SELECT email, added_by, added_at FROM admins ORDER BY added_at`);
    console.log('\n=== Admins atuais ===');
    console.table(all.rows);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('❌ Falhou:', err.message);
  process.exit(1);
});
