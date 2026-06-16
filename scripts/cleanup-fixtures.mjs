// scripts/cleanup-fixtures.mjs
//
// Remove os 15 doadores fictícios criados pelo setup-db.mjs inicial:
//   - Todos os eventos com source = 'manual_seed' (15 eventos)
//   - Todos os perfis com email @example.com (14 perfis fake)
//   - O perfil milton.coruja95@gmail.com SE nome ainda for o seed default
//     "Renan Nardoni (Teste)" — salvaguarda pra não nukear se o usuário
//     já tiver atualizado o próprio perfil pra usar normalmente
//
// Idempotente. Roda em transação — ou tudo ou nada.
//
// Uso:
//   node --env-file=.env.local scripts/cleanup-fixtures.mjs

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
    // === Preview do que vai ser deletado ===
    console.log('\n=== Preview antes da remoção ===');

    const seedEvents = await client.query(
      `SELECT COUNT(*)::int AS n, COALESCE(SUM(amount), 0)::numeric AS total
       FROM donation_events WHERE source = 'manual_seed'`
    );
    console.log(`Eventos com source='manual_seed': ${seedEvents.rows[0].n} (total R$ ${seedEvents.rows[0].total})`);

    const exampleProfiles = await client.query(
      `SELECT email, nome FROM donors WHERE email LIKE '%@example.com' ORDER BY email`
    );
    console.log(`\nPerfis @example.com (${exampleProfiles.rowCount}):`);
    for (const r of exampleProfiles.rows) {
      console.log(`  - ${r.email.padEnd(40)} ${r.nome}`);
    }

    const miltonProfile = await client.query(
      `SELECT email, nome FROM donors
       WHERE email = 'milton.coruja95@gmail.com' AND nome = 'Renan Nardoni (Teste)'`
    );
    if (miltonProfile.rowCount > 0) {
      console.log(`\nPerfil milton.coruja95 (ainda com nome seed): será removido`);
    } else {
      console.log(`\nPerfil milton.coruja95 NÃO bate com nome seed — preservado`);
    }

    // === DELETE ===
    console.log('\n=== Deletando ===');

    const r1 = await client.query(`DELETE FROM donation_events WHERE source = 'manual_seed'`);
    console.log(`✓ Removidos ${r1.rowCount} eventos seed`);

    const r2 = await client.query(`DELETE FROM donors WHERE email LIKE '%@example.com'`);
    console.log(`✓ Removidos ${r2.rowCount} perfis @example.com`);

    const r3 = await client.query(
      `DELETE FROM donors
       WHERE email = 'milton.coruja95@gmail.com'
         AND nome = 'Renan Nardoni (Teste)'`
    );
    console.log(`✓ Removidos ${r3.rowCount} perfis milton.coruja95 seed`);

    await client.query('COMMIT');

    // === Estado final ===
    console.log('\n=== Estado final ===');
    const finalDonors = await client.query('SELECT COUNT(*)::int AS n FROM donors');
    const finalEvents = await client.query('SELECT COUNT(*)::int AS n FROM donation_events');
    const bySource = await client.query(
      `SELECT source, COUNT(*)::int AS n FROM donation_events GROUP BY source ORDER BY n DESC`
    );
    console.log(`donors:          ${finalDonors.rows[0].n}`);
    console.log(`donation_events: ${finalEvents.rows[0].n}`);
    console.log('Distribuição por source:');
    for (const r of bySource.rows) console.log(`  ${r.source.padEnd(15)} ${r.n}`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('❌ Falhou:', err.message);
  process.exit(1);
});
