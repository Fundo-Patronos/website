// scripts/add-rm-column.mjs
//
// Adiciona o campo `rm` (Responsável pelo Relacionamento Manager) na tabela donors,
// e recria a view donor_summary pra expor essa coluna.
//
// Idempotente — safe pra rodar várias vezes.
//
// Uso:
//   node --env-file=.env.local scripts/add-rm-column.mjs

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
    if (!(await tableHasColumn('donors', 'rm'))) {
      await client.query(`ALTER TABLE donors ADD COLUMN rm VARCHAR(255)`);
      console.log('✓ Coluna `rm` adicionada em donors');
    } else {
      console.log('⊘ Coluna `rm` já existe — pulando ALTER');
    }

    // A partir de migrate-category-tiers.mjs a view donor_summary é definida lá
    // (modelo de 6 categorias). Se category_tiers já existe, NÃO recriar a view
    // aqui — a definição legada de 3 categorias reverteria o modelo novo.
    const tiersExist = await client.query(`SELECT to_regclass('category_tiers') IS NOT NULL AS ok`);
    if (tiersExist.rows[0].ok) {
      console.log('⊘ category_tiers existe — view donor_summary é gerenciada por migrate-category-tiers.mjs; pulando recriação');
    } else {
      // CREATE OR REPLACE VIEW não aceita mudar lista de colunas — precisa DROP + CREATE.
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
      console.log('✓ View donor_summary recriada com a coluna `rm`');
    }

    await client.query('COMMIT');

    // Sanity check
    const r = await client.query(`SELECT email, nome, rm FROM donor_summary LIMIT 3`);
    console.log('\nAmostra (rm deve aparecer, valor NULL ainda):');
    console.table(r.rows);
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
