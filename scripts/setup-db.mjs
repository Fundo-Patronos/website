// scripts/setup-db.mjs
//
// Cria a tabela `donors` e popula com 15 doadores fictícios para desenvolvimento.
// Script idempotente: pode rodar várias vezes sem quebrar (CREATE IF NOT EXISTS + UPSERT).
//
// Uso:
//   node --env-file=.env.local scripts/setup-db.mjs
//
// Requer no .env.local:
//   - DATABASE_URL=postgresql://...
//   - TEST_USER_EMAIL=seu@email.com  (vira o "doador de teste" pra você logar no Passo 3)

import pg from 'pg';
const { Client } = pg;

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Faltando DATABASE_URL no .env.local');
  process.exit(1);
}
if (!TEST_USER_EMAIL) {
  console.error('❌ Faltando TEST_USER_EMAIL no .env.local');
  process.exit(1);
}

const schemaSQL = `
CREATE TABLE IF NOT EXISTS donors (
  id                       SERIAL PRIMARY KEY,
  email                    VARCHAR(255) NOT NULL UNIQUE,
  nome                     VARCHAR(255) NOT NULL,
  valor_total              NUMERIC(12,2) NOT NULL DEFAULT 0,
  valor_assinatura         NUMERIC(12,2) NOT NULL DEFAULT 0,
  categoria                VARCHAR(20)  NOT NULL DEFAULT 'Amigo',
  tipo_contribuicao        VARCHAR(20)  NOT NULL DEFAULT 'Pontual',
  data_primeira_doacao     DATE,
  estado_assinatura        VARCHAR(20)  DEFAULT 'N/A',
  data_source              VARCHAR(40)  NOT NULL DEFAULT 'manual_seed',
  created_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_donors_email_lower ON donors (LOWER(email));
`;

// 15 doadores fictícios — mix de categorias, tipos, datas e estados de assinatura.
// O primeiro usa TEST_USER_EMAIL pra você conseguir logar com seu email real no Passo 3.
const donors = [
  // — Seu doador de teste —
  { email: TEST_USER_EMAIL,                 nome: 'Renan Nardoni (Teste)',  valor_total: 1800,  valor_assinatura: 100,  categoria: 'Associado', tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2024-03-15', estado_assinatura: 'Ativa' },

  // — Patronos (doação alta) —
  { email: 'maria.santos@example.com',      nome: 'Maria Santos',           valor_total: 25000, valor_assinatura: 0,    categoria: 'Patrono',   tipo_contribuicao: 'Pontual',    data_primeira_doacao: '2021-08-20', estado_assinatura: 'N/A' },
  { email: 'rafael.mendes@example.com',     nome: 'Rafael Mendes',          valor_total: 18000, valor_assinatura: 1000, categoria: 'Patrono',   tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2021-06-18', estado_assinatura: 'Ativa' },
  { email: 'joao.silva@example.com',        nome: 'João Silva',             valor_total: 12000, valor_assinatura: 500,  categoria: 'Patrono',   tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2022-01-10', estado_assinatura: 'Ativa' },
  { email: 'fernanda.lima@example.com',     nome: 'Fernanda Lima',          valor_total: 8000,  valor_assinatura: 200,  categoria: 'Patrono',   tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2022-11-03', estado_assinatura: 'Ativa' },
  { email: 'gustavo.castro@example.com',    nome: 'Gustavo Castro',         valor_total: 6500,  valor_assinatura: 250,  categoria: 'Patrono',   tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2023-02-14', estado_assinatura: 'Ativa' },

  // — Associados (doação média) —
  { email: 'beatriz.rocha@example.com',     nome: 'Beatriz Rocha',          valor_total: 4500,  valor_assinatura: 0,    categoria: 'Associado', tipo_contribuicao: 'Pontual',    data_primeira_doacao: '2023-09-22', estado_assinatura: 'N/A' },
  { email: 'ana.costa@example.com',         nome: 'Ana Costa',              valor_total: 3500,  valor_assinatura: 0,    categoria: 'Associado', tipo_contribuicao: 'Pontual',    data_primeira_doacao: '2023-05-12', estado_assinatura: 'N/A' },
  { email: 'carla.souza@example.com',       nome: 'Carla Souza',            valor_total: 2100,  valor_assinatura: 150,  categoria: 'Associado', tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2024-06-15', estado_assinatura: 'Ativa' },
  { email: 'marcos.ribeiro@example.com',    nome: 'Marcos Ribeiro',         valor_total: 1200,  valor_assinatura: 50,   categoria: 'Associado', tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2025-04-10', estado_assinatura: 'Ativa' },

  // — Amigos (doação baixa) —
  { email: 'lucas.pereira@example.com',     nome: 'Lucas Pereira',          valor_total: 720,   valor_assinatura: 60,   categoria: 'Amigo',     tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2024-12-15', estado_assinatura: 'Pausada' },
  { email: 'pedro.oliveira@example.com',    nome: 'Pedro Oliveira',         valor_total: 480,   valor_assinatura: 30,   categoria: 'Amigo',     tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2025-01-01', estado_assinatura: 'Ativa' },
  { email: 'patricia.gomes@example.com',    nome: 'Patrícia Gomes',         valor_total: 300,   valor_assinatura: 0,    categoria: 'Amigo',     tipo_contribuicao: 'Pontual',    data_primeira_doacao: '2025-11-30', estado_assinatura: 'N/A' },
  { email: 'roberto.alves@example.com',     nome: 'Roberto Alves',          valor_total: 150,   valor_assinatura: 0,    categoria: 'Amigo',     tipo_contribuicao: 'Pontual',    data_primeira_doacao: '2026-02-10', estado_assinatura: 'N/A' },
  { email: 'julia.ferreira@example.com',    nome: 'Júlia Ferreira',         valor_total: 90,    valor_assinatura: 30,   categoria: 'Amigo',     tipo_contribuicao: 'Recorrente', data_primeira_doacao: '2026-01-20', estado_assinatura: 'Cancelada' },
];

const upsertSQL = `
INSERT INTO donors
  (email, nome, valor_total, valor_assinatura, categoria, tipo_contribuicao, data_primeira_doacao, estado_assinatura)
VALUES
  ($1, $2, $3, $4, $5, $6, $7, $8)
ON CONFLICT (email) DO UPDATE SET
  nome                  = EXCLUDED.nome,
  valor_total           = EXCLUDED.valor_total,
  valor_assinatura      = EXCLUDED.valor_assinatura,
  categoria             = EXCLUDED.categoria,
  tipo_contribuicao     = EXCLUDED.tipo_contribuicao,
  data_primeira_doacao  = EXCLUDED.data_primeira_doacao,
  estado_assinatura     = EXCLUDED.estado_assinatura,
  updated_at            = NOW();
`;

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log('✓ Conectado ao Postgres');

  await client.query(schemaSQL);
  console.log('✓ Schema aplicado (tabela donors criada ou já existia)');

  for (const d of donors) {
    await client.query(upsertSQL, [
      d.email, d.nome, d.valor_total, d.valor_assinatura,
      d.categoria, d.tipo_contribuicao, d.data_primeira_doacao, d.estado_assinatura,
    ]);
  }
  console.log(`✓ ${donors.length} doadores inseridos/atualizados`);

  const res = await client.query(
    'SELECT categoria, COUNT(*)::int AS n FROM donors GROUP BY categoria ORDER BY categoria'
  );
  console.log('\nDistribuição por categoria:');
  for (const row of res.rows) {
    console.log(`  ${row.categoria.padEnd(10)} ${row.n}`);
  }

  const total = await client.query('SELECT COUNT(*)::int AS n FROM donors');
  console.log(`\nTotal de doadores no banco: ${total.rows[0].n}`);

  await client.end();
}

main().catch(err => {
  console.error('❌ Falhou:', err.message);
  process.exit(1);
});
