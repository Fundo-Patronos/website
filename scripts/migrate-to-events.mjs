// scripts/migrate-to-events.mjs
//
// Migração one-time: separa o esquema atual em
//   - donors:           perfis manuais (nome, tipo_contribuicao, estado_assinatura, valor_assinatura)
//   - donation_events:  log imutável de cada doação (PIX agora, doa.re/Stripe depois)
//   - category_rules:   thresholds editáveis (singleton, default Patrono ≥ 5k, Associado ≥ 1k)
//   - donor_summary:    view que computa valor_total, data_primeira_doacao e categoria
//
// Idempotente. Backwards-compatible: NÃO dropa colunas antigas de donors —
// elas ficam órfãs até uma limpeza futura. Isso evita janela de quebra durante deploy.
//
// Uso:
//   node --env-file=.env.local scripts/migrate-to-events.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function tableHasColumn(table, column) {
  const r = await client.query(
    `SELECT 1 FROM information_schema.columns
     WHERE table_name = $1 AND column_name = $2`,
    [table, column]
  );
  return r.rows.length > 0;
}

async function main() {
  await client.connect();
  console.log('✓ Conectado ao Postgres');

  await client.query('BEGIN');

  try {
    // 1. donation_events
    await client.query(`
      CREATE TABLE IF NOT EXISTS donation_events (
        id           SERIAL PRIMARY KEY,
        donor_email  VARCHAR(255) NOT NULL,
        amount       NUMERIC(12,2) NOT NULL CHECK (amount > 0),
        occurred_at  DATE         NOT NULL,
        source       VARCHAR(40)  NOT NULL,
        source_id    VARCHAR(255),
        raw_payload  JSONB,
        created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_email_lower ON donation_events (LOWER(donor_email));`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_occurred_at ON donation_events (occurred_at);`);
    console.log('✓ donation_events pronta');

    // 2. category_rules (singleton)
    await client.query(`
      CREATE TABLE IF NOT EXISTS category_rules (
        id            INTEGER       PRIMARY KEY DEFAULT 1 CHECK (id = 1),
        min_patrono   NUMERIC(12,2) NOT NULL DEFAULT 5000,
        min_associado NUMERIC(12,2) NOT NULL DEFAULT 1000,
        updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);
    await client.query(`INSERT INTO category_rules (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
    console.log('✓ category_rules pronta (default: Patrono ≥ R$ 5k, Associado ≥ R$ 1k)');

    // 3. Migrar dados — cada doador com valor_total > 0 vira UM evento de seed.
    //    Só roda se donors ainda tem valor_total E donation_events está vazia.
    const hasValorTotal = await tableHasColumn('donors', 'valor_total');
    if (hasValorTotal) {
      const eventsCount = await client.query('SELECT COUNT(*)::int AS n FROM donation_events');
      if (eventsCount.rows[0].n === 0) {
        const result = await client.query(`
          INSERT INTO donation_events (donor_email, amount, occurred_at, source)
          SELECT
            email,
            valor_total,
            COALESCE(data_primeira_doacao, CURRENT_DATE),
            'manual_seed'
          FROM donors
          WHERE valor_total > 0
          RETURNING id;
        `);
        console.log(`✓ Migrados ${result.rowCount} doadores → 1 evento de seed cada`);
      } else {
        console.log(`⊘ donation_events já tem ${eventsCount.rows[0].n} linhas — pulando migração inicial de dados`);
      }
    } else {
      console.log('⊘ donors já no novo schema (sem valor_total) — nada a migrar');
    }

    // 4. Garantir coluna `rm` na donors (Responsável pelo Relacionamento)
    const hasRm = await tableHasColumn('donors', 'rm');
    if (!hasRm) {
      await client.query(`ALTER TABLE donors ADD COLUMN rm VARCHAR(255)`);
      console.log('✓ Coluna `rm` adicionada em donors');
    }

    // 5. View donor_summary — JOIN profile + agregação de eventos + categoria computada
    // (DROP + CREATE em vez de CREATE OR REPLACE porque a lista de colunas pode mudar
    //  entre versões; OR REPLACE não permite alterar a lista de colunas.)
    //
    // NOTA: esta definição (3 categorias via category_rules) é só o bootstrap de um
    // banco novo. Depois que migrate-category-tiers.mjs roda, a view passa a ser
    // definida lá (6 categorias oficiais) — e este script NÃO deve sobrescrevê-la.
    const tiersExist = await client.query(`SELECT to_regclass('category_tiers') IS NOT NULL AS ok`);
    if (tiersExist.rows[0].ok) {
      console.log('⊘ category_tiers existe — view donor_summary é gerenciada por migrate-category-tiers.mjs; pulando recriação');
    } else {
      await client.query(`DROP VIEW IF EXISTS donor_summary`);
      await client.query(`
        CREATE VIEW donor_summary AS
        SELECT
          d.email,
          d.nome,
          d.rm,
          d.tipo_contribuicao,
          d.estado_assinatura,
          d.valor_assinatura,
          COALESCE(SUM(e.amount), 0)::NUMERIC(12,2) AS valor_total,
          MIN(e.occurred_at)                        AS data_primeira_doacao,
          CASE
            WHEN COALESCE(SUM(e.amount), 0) >= (SELECT min_patrono   FROM category_rules WHERE id = 1)
              THEN 'Patrono'
            WHEN COALESCE(SUM(e.amount), 0) >= (SELECT min_associado FROM category_rules WHERE id = 1)
              THEN 'Associado'
            ELSE 'Amigo'
          END                                       AS categoria
        FROM donors d
        LEFT JOIN donation_events e ON LOWER(e.donor_email) = LOWER(d.email)
        GROUP BY d.email, d.nome, d.rm, d.tipo_contribuicao, d.estado_assinatura, d.valor_assinatura;
      `);
      console.log('✓ View donor_summary criada/atualizada');
    }

    await client.query('COMMIT');

    // === Verificação ===
    console.log('\n=== Verificação ===');
    const donorCount  = await client.query('SELECT COUNT(*)::int AS n FROM donors');
    const eventCount  = await client.query('SELECT COUNT(*)::int AS n FROM donation_events');
    console.log(`donors:          ${donorCount.rows[0].n}`);
    console.log(`donation_events: ${eventCount.rows[0].n}`);

    const dist = await client.query(`
      SELECT categoria, COUNT(*)::int AS n
      FROM donor_summary
      GROUP BY categoria
      ORDER BY CASE categoria WHEN 'Patrono' THEN 1 WHEN 'Associado' THEN 2 ELSE 3 END
    `);
    console.log('\nDistribuição em donor_summary:');
    for (const r of dist.rows) console.log(`  ${r.categoria.padEnd(10)} ${r.n}`);

    if (process.env.TEST_USER_EMAIL) {
      const r = await client.query(
        `SELECT email, nome, valor_total, valor_assinatura, categoria, tipo_contribuicao, data_primeira_doacao, estado_assinatura
         FROM donor_summary
         WHERE LOWER(email) = LOWER($1)`,
        [process.env.TEST_USER_EMAIL]
      );
      console.log('\nSeu doador de teste via donor_summary:');
      console.table(r.rows);
    }
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
