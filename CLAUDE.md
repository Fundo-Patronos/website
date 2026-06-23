# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Patronos Website - institutional website for Fundo Patrimonial Patronos, a university endowment fund supporting Unicamp students in Brazil.

**Key Requirements:**
- All website content in Portuguese (PT-BR)
- Development discussions in English
- Light mode only

## Commands

```bash
npm run dev      # Start development server (use `vercel dev` to test API routes)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Architecture

### Routing Structure (src/App.jsx)
- **Main Website**: Routes under `/*` wrapped in `MainLayout` (Header + Footer)
- **Donor Portal**: `/doador/*` routes outside MainLayout with Firebase authentication
  - `/doador/login` - Public login page
  - `/doador` - Protected dashboard (requires authentication)

Page filenames don't map 1:1 to URLs — most live under `/sobre-nos/*` or `/impacto/*` prefixes:
| Route | Page component |
|-------|----------------|
| `/` | `Home.jsx` |
| `/sobre-nos/fundo` | `Fundo.jsx` |
| `/sobre-nos/nossa-missao` | `NossaMissao.jsx` |
| `/sobre-nos/transparencia` | `Transparencia.jsx` |
| `/sobre-nos/contato` | `Contato.jsx` |
| `/impacto/extras` | `Extras.jsx` |
| `/impacto/carreira` | `Carreira.jsx` |
| `/impacto/trilhas` | `TrilhaDeCarreiras.jsx` |
| `/impacto/centro` | `CentroDeCarreiras.jsx` |
| `/impacto/talentos` | `Talentos.jsx` |
| `/impacto/pesquisa` | `Pesquisa.jsx` |
| `/parceiros` | `Parceiros.jsx` |
| `/blog`, `/blog/:slug` | `Blog.jsx`, `BlogPost.jsx` |

### Key Directories
- `src/pages/` - Route-level page components
- `src/components/` - Reusable UI components (Hero, CTA, FAQ sections, etc.)
- `src/layouts/` - Layout wrappers (MainLayout, DoadorLayout)
- `src/ui/` - Adapted Launch UI Pro primitives (Button, Card, Badge, Marquee, Section)
- `src/contexts/` - React context providers (AuthContext for Firebase auth)
- `src/lib/` - Utilities (firebase.js, theme.js, utils.js with `cn` helper)
- `launch-ui-pro/` - Original Launch UI Pro component library (reference only)
- `api/` - Vercel serverless functions

### Authentication (src/contexts/AuthContext.jsx)
Firebase Authentication with multiple sign-in methods:
- Google OAuth popup
- Email/password
- Magic link (passwordless email)

Protected routes use `ProtectedRoute` component.

### Donor Portal Backend
- **API Route**: `/api/donor-data.js` (Vercel serverless function)
- **Data Source**: Railway Postgres (`donor_summary` view), looked up by email (case-insensitive). The Google Sheets path is fully retired — see Database section below.

### Admin Portal
A separate authenticated area at `/admin` (`src/pages/Admin.jsx`, gated by the same `ProtectedRoute`) backed by serverless functions under `api/admin/`. Every handler calls `requireAdmin(req, res)` from `api/_lib/auth.js` as its first line.

- **Admin auth is two-layered** (`api/_lib/auth.js → isAdmin`): (1) `ADMIN_EMAILS` env var = zero-DB emergency bootstrap; (2) the `admins` Postgres table managed through the UI. Either match grants access. If the DB is down, only the env-var admins keep access. `ProtectedRoute` only checks *logged-in*, not *admin* — the admin gate is server-side per endpoint.
- **Shared libs** (`api/_lib/`): `db.js` exports a singleton `pg` `pool` (cached on `globalThis` in dev to survive hot reload — both `donor-data.js` and every admin handler import this); `auth.js` exports `verifyIdToken`, `isAdmin`, `requireAdmin`.
- **Endpoints**: `stats.js` (dashboard aggregations, all queries `Promise.all`'d), `donors.js`, `donations.js` (append donation events), `admins.js` (CRUD; refuses to remove yourself to avoid lockout), `category-rules.js` (edit the Patrono/Associado thresholds), `doare-preview.js` + `doare-commit.js` (the doa.re CSV import flow, below).
- **doa.re CSV import** is a two-step preview→commit: the client parses the doa.re CSV (PapaParse), POSTs rows to `doare-preview` which filters `Status === 'Paga'`, infers profile type, and dedups against `donors` (by email) and `donation_events` (by `source_id`); the user reviews, then `doare-commit` inserts (`ON CONFLICT DO NOTHING` + the unique index = defense-in-depth against re-uploading the same CSV).

## Brand Guidelines

### Colors
**Primary Gradient**: `linear-gradient(135deg, #ff9700, #ff6253, #fc4696, #c964e2)`
- Use full gradient for buttons and large elements
- Use `#ff9700` (first color) for focus states and small accents

### Typography (Inter font)
- H1: `text-5xl sm:text-6xl` (Hero titles)
- H2: `text-4xl sm:text-5xl` (Section titles)
- H3: `text-xl` (Subtitles)
- Paragraphs: `text-lg leading-8`
- Base text: `text-base leading-7`
- Links/buttons: `text-sm font-semibold leading-6`

### Spacing
- Section padding: `py-12 sm:py-16`

### Social Media Links
Always use these official links:
- Instagram: https://www.instagram.com/fundopatronos/
- LinkedIn: https://www.linkedin.com/company/fundo-patronos
- YouTube: https://www.youtube.com/@FundoPatronos

## Environment Variables

### Client-side (VITE_ prefix required)
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Server-side (Vercel)
```
DATABASE_URL                  # Railway Postgres connection string (used by api/_lib/db.js + donor-data.js)
FIREBASE_ADMIN_CLIENT_EMAIL   # Firebase Admin SDK — verifies ID tokens server-side
FIREBASE_ADMIN_PRIVATE_KEY    # stored with literal \n; auth.js does .replace(/\\n/g, '\n')
ADMIN_EMAILS                  # comma-separated bootstrap admin list (see Admin Portal)
```
(The legacy `GOOGLE_SHEETS_*` vars are no longer used — the backend is Postgres now.)

## Important Links

- **Donation**: https://doa.re/patronos
- **PIX Key**: operacoes@patronos.org
- **Centro de Carreiras**: https://carreiras.patronos.org/
- **Mentor Registration**: https://airtable.com/app4uSEqO2S03EO5X/pag4g0cv7spU3ZjtX/form

## Development Notes

### Component Patterns
- Use `@headlessui/react` for accessible UI primitives
- Use `@heroicons/react` for icons
- Apply colors via inline styles for specificity: `style={{background: 'linear-gradient(...)'}}`
- External links: always add `target="_blank" rel="noopener noreferrer"`

### Known Issues to Avoid
- Avoid complex dynamic icon rendering patterns (e.g., `const IconComponent = item.icon`) - can cause crashes
- Test new components in isolation before page integration
- `src/components/Navbar.jsx` declares a `featuredPosts` array (lines ~50–71) that is **never rendered** — the live Sobre Nós flyout content lives in `src/components/SobreNosFlyout.jsx`. Don't waste time editing the Navbar array
- `src/App-backup.jsx` is a stale backup; the live router is `src/App.jsx`

### Vercel Configuration
- `vercel.json` handles SPA routing and API pass-through
- Use `vercel dev` locally to test serverless functions
- The repo is linked to a Vercel project (`.vercel/project.json`). Push to `main` auto-deploys to production; PRs get preview deployments commented by the Vercel bot

### Adding Annual Reports and Institutional Documents
The Transparência page renders two data-driven tile grids; new entries are added by appending to a local `posts` array.

- **Annual report** (`src/components/RelatoriosAnuais.jsx`): append to `posts`. Paths use **URL-encoding** (`%20` for spaces, `%C3%B3` for "ó"). The 2021–2023 PDFs carry a legacy typo `Relat%C3%B3trio` — preserve it for those years, use correct `Relatorio` for new years. The page header promises *"divulgados em maio do ano seguinte"* — use `Maio YYYY+1` for new tiles even though older entries say "Abril"
- **Institutional doc** (`src/components/DocumentacoesInstitucionais.jsx`): append to `posts` with URL-encoded paths. Illustrative images live at `/Illustrative Pictures/Docs Institucionais/di-N.jpg`. Grid is `lg:grid-cols-4`
- **Sobre Nós flyout featured tile** (`src/components/SobreNosFlyout.jsx`): when a new annual report ships, update the first `featuredPosts` entry. **Watch out:** this file uses **literal spaces** in image/PDF paths (no `%20`), unlike the Transparência components
- All PDF tile anchors set `target="_blank" rel="noopener noreferrer"`. The flyout anchor opens local `/`-rooted links in a new tab via a conditional, so the second tile (with `href="#"`) keeps current behavior
- File-naming conventions in `public/`:
  - Covers: `Cover - Fundo Patronos - Relatorio Anual YYYY.png` (2024 is `.jpeg`)
  - Report PDFs: `Fundo Patronos - Relatorio Anual YYYY.pdf`
  - Institutional PDFs: free-form (each doc has its own filename, see existing entries)

### Vercel CLI workflow (env vars, redeploys)

Setup once per machine:
```bash
npx vercel login           # interactive: choose GitHub, complete browser OAuth
npx vercel link --project patronos-website --yes
```

Sync env vars from local `.env.local` to Vercel production:
```bash
node --env-file=.env.local scripts/sync-vercel-env.mjs
```
The script whitelists which vars to sync (see `VARS_TO_SYNC` at the top). It does NOT touch `VERCEL_TOKEN`, `TEST_USER_EMAIL`, or anything CLI-only.

Force a redeploy of the latest production deployment (needed when env vars change, since `VITE_*` vars are baked into the bundle at build time):
```bash
npx vercel ls                                # find latest deployment URL
npx vercel redeploy <deployment-url>         # rebuild with current env vars
```

**Known CLI quirk:** `vercel env add NAME preview --value V --yes` fails with `git_branch_required` in v53.3.2. The sync script intentionally only targets `production` because of this. To add to preview, use the Vercel UI or specify a git branch: `vercel env add NAME preview <branch> --value V --yes`.

### Database (Railway Postgres)

`api/donor-data.js` reads from a Postgres `donors` table on Railway, not Google Sheets. Schema and 15 fictitious seed rows in `scripts/setup-db.mjs`. Run once to provision a new DB:
```bash
node --env-file=.env.local scripts/setup-db.mjs
```
The script is idempotent (CREATE IF NOT EXISTS + UPSERT). The donor whose email matches `TEST_USER_EMAIL` is named "Renan Nardoni (Teste)" — useful for end-to-end login tests.

**Data model** (don't read donation totals off `donors` — that column is legacy):
- `donors` — donor profiles (email, nome, type). Source of identity, not of money.
- `donation_events` — immutable append-only log, one row per donation (PIX, doa.re, …). Has a unique partial index `(source, source_id) WHERE source_id IS NOT NULL` for import dedup.
- `category_rules` — singleton row (id=1) holding the editable `min_patrono` / `min_associado` thresholds (defaults R$ 5k / R$ 1k).
- `admins` — DB-managed admin allowlist (`active` flag).
- `donor_summary` **view** — the read model the app actually queries: JOINs `donors` + `SUM(donation_events.amount)` and derives `categoria` (Patrono/Associado/Amigo) live from `category_rules`. Both `donor-data.js` and `admin/stats.js` read this.

**Migration scripts** (each `node --env-file=.env.local scripts/<name>`, all idempotent — run in this order on a fresh DB): `setup-db.mjs` → `migrate-to-events.mjs` (creates `donation_events`, `category_rules`, `donor_summary`) → `add-event-dedup-index.mjs` → `add-admins-table.mjs` (seeds from `ADMIN_EMAILS`) → `add-rm-column.mjs`. Bulk importers: `import-pix-historical.py`, `import-profiles.py`. Cleanup test data with `cleanup-fixtures.mjs`.

Test the API handler locally without `vercel dev`:
```bash
node --env-file=.env.local scripts/test-api.mjs
```

### Category Badge Styling (Donor Portal)
- **Patrono**: Full gradient background
- **Associado**: Gradient border with white background, gradient text
- **Amigo**: Subtle gray background

## AI/LLM Documentation

When making content changes to the website, **always update the LLM documentation files**:

- `public/llms.txt` - Concise overview for AI crawlers
- `public/llms-full.txt` - Comprehensive documentation
- `index.html` - JSON-LD structured data and meta tags

### What requires updates:
- New programs or features
- Changes to statistics (donors, patrimony, volunteers)
- New FAQ questions
- Changes to program descriptions
- New pages or major content updates
- Contact info or link changes

### SEO Positioning
The site is optimized for PT-BR searches positioning Patronos as "O Fundo Patrimonial da Unicamp". Maintain this positioning in all content updates. Key search terms to target:
- "fundo patrimonial unicamp"
- "doar unicamp" / "doação unicamp"
- "bolsa unicamp"
- "como doar para unicamp"
