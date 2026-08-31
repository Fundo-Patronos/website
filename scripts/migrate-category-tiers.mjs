// scripts/migrate-category-tiers.mjs
//
// Substitui o modelo de 3 categorias (category_rules: Patrono/Associado/Amigo)
// pelas 6 categorias oficiais do Relatório Anual 2025:
//
//   Amigo ≥ 5k · Aliado ≥ 10k · Protetor ≥ 20k · Patrono ≥ 50k
//   Patrono Associado ≥ 100k · Patrono Benemérito ≥ 300k
//   (abaixo de 5k: sem categoria — donor_summary.categoria = NULL)
//
// - Cria a tabela category_tiers (nome, min_valor, beneficios) e semeia as 6.
// - Recria a view donor_summary escolhendo o tier mais alto <= valor_total.
// - A tabela category_rules antiga fica no lugar (deprecated, sem leitores).
//
// Idempotente: seed com ON CONFLICT DO NOTHING (não sobrescreve edições do admin).
//
// Uso:
//   node --env-file=.env.local scripts/migrate-category-tiers.mjs

import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const TIERS = [
  { nome: 'Amigo', min: 5000, beneficios: [
    'Nome nos Relatórios Anuais',
    'Convite para eventos online',
    'Nome no Website',
  ]},
  { nome: 'Aliado', min: 10000, beneficios: [
    'Nome nos Relatórios Anuais',
    'Convite para eventos online',
    'Nome no Website',
    'Relationship Manager',
  ]},
  { nome: 'Protetor', min: 20000, beneficios: [
    'Nome nos Relatórios Anuais',
    'Convite para eventos online',
    'Nome no Website',
    'Relationship Manager',
    'Convites para eventos presenciais',
  ]},
  { nome: 'Patrono', min: 50000, beneficios: [
    'Nome nos Relatórios Anuais',
    'Convite para eventos online',
    'Nome no Website',
    'Relationship Manager',
    'Convites para eventos presenciais',
    'Post de agradecimento nas redes sociais',
  ]},
  { nome: 'Patrono Associado', min: 100000, beneficios: [
    'Nome nos Relatórios Anuais',
    'Convite para eventos online',
    'Nome no Website',
    'Relationship Manager',
    'Convites para eventos presenciais',
    'Post de agradecimento nas redes sociais',
    'Voto em Assembleia Geral',
  ]},
  { nome: 'Patrono Benemérito', min: 300000, beneficios: [
    'Nome nos Relatórios Anuais',
    'Convite para eventos online',
    'Nome no Website',
    'Relationship Manager',
    'Convites para eventos presenciais',
    'Post de agradecimento nas redes sociais',
    'Voto em Assembleia Geral',
    'Nome para bolsa/financiamento',
  ]},
];

async function main() {
  await client.connect();
  console.log('✓ Conectado ao Postgres');

  await client.query('BEGIN');
  try {
    // 1. Tabela de tiers
    await client.query(`
      CREATE TABLE IF NOT EXISTS category_tiers (
        id         SERIAL PRIMARY KEY,
        nome       VARCHAR(60)   NOT NULL UNIQUE,
        min_valor  NUMERIC(12,2) NOT NULL CHECK (min_valor > 0),
        beneficios TEXT[]        NOT NULL DEFAULT '{}',
        updated_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);
    console.log('✓ category_tiers pronta');

    // 2. Seed (não sobrescreve valores já editados pelo admin)
    for (const t of TIERS) {
      await client.query(
        `INSERT INTO category_tiers (nome, min_valor, beneficios)
         VALUES ($1, $2, $3)
         ON CONFLICT (nome) DO NOTHING`,
        [t.nome, t.min, t.beneficios]
      );
    }
    console.log(`✓ Seed de ${TIERS.length} categorias (ON CONFLICT DO NOTHING)`);

    // 3. Recria donor_summary: tier mais alto cujo min_valor <= valor_total.
    //    Mesma lista de colunas da versão anterior — donor-data.js e stats.js
    //    continuam funcionando sem mudança de contrato (categoria agora pode ser NULL).
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
        COALESCE(t.valor_total, 0)::NUMERIC(12,2) AS valor_total,
        t.data_primeira_doacao,
        c.nome AS categoria
      FROM donors d
      LEFT JOIN (
        SELECT LOWER(donor_email) AS email_lower,
               SUM(amount)        AS valor_total,
               MIN(occurred_at)   AS data_primeira_doacao
        FROM donation_events
        GROUP BY LOWER(donor_email)
      ) t ON t.email_lower = LOWER(d.email)
      LEFT JOIN LATERAL (
        SELECT nome FROM category_tiers
        WHERE min_valor <= COALESCE(t.valor_total, 0)
        ORDER BY min_valor DESC
        LIMIT 1
      ) c ON TRUE;
    `);
    console.log('✓ View donor_summary recriada (6 tiers, NULL abaixo do Amigo)');

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }

  // === Verificação ===
  console.log('\n=== Verificação ===');
  const tiers = await client.query(
    `SELECT nome, min_valor, array_length(beneficios, 1) AS n_beneficios
     FROM category_tiers ORDER BY min_valor`
  );
  console.table(tiers.rows);

  const dist = await client.query(`
    SELECT COALESCE(categoria, '(sem categoria)') AS categoria, COUNT(*)::int AS doadores
    FROM donor_summary
    GROUP BY categoria
    ORDER BY MIN(CASE WHEN categoria IS NULL THEN 0 ELSE (
      SELECT min_valor FROM category_tiers ct WHERE ct.nome = donor_summary.categoria
    ) END)
  `);
  console.log('Distribuição de doadores:');
  console.table(dist.rows);

  await client.end();
}

main().catch(err => {
  console.error('❌ Falhou:', err.message);
  process.exit(1);
});
