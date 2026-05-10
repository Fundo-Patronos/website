// scripts/sync-vercel-env.mjs
//
// Sobe um conjunto de env vars do .env.local pro Vercel (Production + Preview).
// Faz remove + add — se a var já existir lá, é substituída.
//
// Uso:
//   node --env-file=.env.local scripts/sync-vercel-env.mjs
//
// Pré-requisitos:
//   - .vercel/ existe (rode `npx vercel link` antes — uma vez por máquina)
//   - Logado: VERCEL_TOKEN no .env.local OU `npx vercel login` (token global do CLI)
//
// Segurança: só sincroniza as vars listadas em VARS_TO_SYNC. Nunca inclui
// VERCEL_TOKEN ou outras credenciais que pertencem só ao ambiente local.

import { spawnSync } from 'node:child_process';

const VARS_TO_SYNC = [
  'DATABASE_URL',
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

// NOTE: 'preview' está intencionalmente fora.
// Vercel CLI v53.3.2 tem um bug: `env add NAME preview --value V --yes` falha
// com "git_branch_required" mesmo quando a própria documentação sugere que
// esse comando deveria adicionar a "todos os branches de preview". Até virar
// um workflow de feature branches com preview, ficamos só em production.
// Pra adicionar em preview manualmente: Vercel UI ou `vercel env add NAME preview <branch> --value V --yes`
const ENVS = ['production'];

function run(args) {
  return spawnSync('npx', ['vercel', ...args], {
    encoding: 'utf-8',
    shell: true,
  });
}

let failures = 0;

for (const name of VARS_TO_SYNC) {
  const value = process.env[name];
  if (!value) {
    console.log(`⊘ ${name}: faltando em .env.local — pulando`);
    continue;
  }

  // Remove existing from each env (silencioso se não existir)
  for (const env of ENVS) {
    run(['env', 'rm', name, env, '--yes']);
  }

  // Add — uma chamada por env, valor via flag (modo não-interativo)
  const okEnvs = [];
  const badEnvs = [];
  for (const env of ENVS) {
    const res = run(['env', 'add', name, env, '--value', value, '--yes']);
    if (res.status === 0) {
      okEnvs.push(env);
    } else {
      badEnvs.push(env);
      const err = (res.stderr || '').trim();
      if (err) console.error(`  [${env}] stderr: ${err}`);
    }
  }
  if (badEnvs.length === 0) {
    console.log(`✓ ${name} → ${okEnvs.join(', ')}`);
  } else {
    failures++;
    console.log(`✗ ${name} → falhou em: ${badEnvs.join(', ')}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} variável(eis) falharam.`);
  process.exit(1);
}

console.log('\n✓ Sync concluído. Para aplicar, dispare um redeploy:');
console.log('   npx vercel --prod --yes');
console.log('  ou faça um novo push em main.');
