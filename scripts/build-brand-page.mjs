// Emit route-specific social metadata while retaining the existing Vite app.
import { readFile, writeFile } from 'node:fs/promises'
import { rebrand, rebrandTitle, rebrandUrl, rebrandStructuredData } from '../src/lib/rebrand.js'

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
let html = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8')
html = html.replace(/<title>([^<]*)<\/title>/, (_, title) => `<title data-site-default="${escape(title)}">${escape(rebrandTitle)}</title>`)

const tags = [
  ['name', 'description', rebrand.description],
  ['name', 'robots', 'noindex, nofollow'],
  ['property', 'og:title', rebrandTitle],
  ['property', 'og:description', rebrand.description],
  ['property', 'og:url', rebrandUrl],
  ['property', 'og:type', 'article'],
  ['property', 'og:image', `https://www.patronos.org${rebrand.poster}`],
  ['property', 'og:image:alt', 'Nova identidade visual do Fundo Patronos'],
  ['name', 'twitter:title', rebrandTitle],
  ['name', 'twitter:description', rebrand.description],
  ['name', 'twitter:url', rebrandUrl],
  ['name', 'twitter:image', `https://www.patronos.org${rebrand.poster}`],
]
for (const [attribute, name, content] of tags) {
  const pattern = new RegExp(`<meta ${attribute}="${name}" content="([^"]*)"\\s*/?>`)
  if (!pattern.test(html)) throw new Error(`Missing metadata: ${name}`)
  html = html.replace(pattern, (_, previous) => `<meta ${attribute}="${name}" content="${escape(content)}" data-site-default="${previous}" />`)
}
html = html.replace(/<link rel="canonical" href="([^"]*)"\s*\/?>/, (_, previous) => `<link rel="canonical" href="${rebrandUrl}" data-site-default="${previous}" />`)
// The site's home-page FAQ is not the subject of this announcement.
html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, script => script.includes('"FAQPage"') ? '' : script)
html = html.replace('</head>', `<script type="application/ld+json" id="brand-article-data">${JSON.stringify(rebrandStructuredData).replaceAll('<', '\\u003c')}</script>\n</head>`)
await writeFile(new URL('../dist/nossa-marca.html', import.meta.url), html)
console.log(`Prepared sharing metadata for ${rebrand.path}`)
