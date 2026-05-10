// scripts/test-api.mjs
//
// Testa a API /api/donor-data localmente, sem precisar de vercel dev.
// Importa o handler como módulo e simula req/res.
//
// Uso:
//   node --env-file=.env.local scripts/test-api.mjs

import handler from '../api/donor-data.js';

function mockResponse() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
    setHeader(key, value) { this.headers[key] = value; return this; },
  };
  return res;
}

async function testCase(label, req) {
  const res = mockResponse();
  await handler(req, res);
  const status = res.statusCode === 200 ? '✓' : res.statusCode === 404 ? '○' : '✗';
  console.log(`${status} ${label}`);
  console.log(`  status: ${res.statusCode}`);
  console.log(`  body:   ${JSON.stringify(res.body)}`);
  console.log('');
}

console.log('Testando /api/donor-data\n');

await testCase('Seu email de teste',
  { method: 'GET', query: { email: process.env.TEST_USER_EMAIL } });

await testCase('Doador fake existente (Maria)',
  { method: 'GET', query: { email: 'maria.santos@example.com' } });

await testCase('Lookup case-insensitive (Maria em CAPS)',
  { method: 'GET', query: { email: 'MARIA.SANTOS@EXAMPLE.COM' } });

await testCase('Doador inexistente',
  { method: 'GET', query: { email: 'nobody@example.com' } });

await testCase('Sem parâmetro email',
  { method: 'GET', query: {} });

await testCase('Método errado (POST)',
  { method: 'POST', query: { email: 'qualquer@coisa.com' } });

process.exit(0);
