// scripts/add-event-dedup-index.mjs
//
// Adiciona índice único parcial em donation_events (source, source_id) WHERE source_id IS NOT NULL.
// Garante que importações repetidas do mesmo CSV não duplicam eventos no banco.
//
// Idempotente.
//
// Uso:
//   node --env-file=.env.local scripts/add-event-dedup-index.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('✓ Conectado ao Postgres');

  // Índice ÚNICO mas PARCIAL — só quando source_id existe. Isso permite que
  // os eventos de seed antigos (sem source_id) continuem existindo sem violar
  // unicidade, enquanto novos imports são protegidos contra duplicação.
  await client.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS uniq_events_source_source_id
    ON donation_events (source, source_id)
    WHERE source_id IS NOT NULL;
  `);
  console.log('✓ Índice único parcial em (source, source_id) garantido');

  // Sanity
  const r = await client.query(`
    SELECT COUNT(*)::int AS n
    FROM pg_indexes
    WHERE tablename = 'donation_events' AND indexname = 'uniq_events_source_source_id'
  `);
  console.log(`Índices encontrados com esse nome: ${r.rows[0].n}`);

  await client.end();
}

main().catch(err => {
  console.error('❌ Falhou:', err.message);
  process.exit(1);
});
