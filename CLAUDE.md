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

There is **no test suite** (no test runner, no `test` script). Verification is `npm run lint` + `npm run build`, plus `scripts/test-api.mjs` for the donor API handler (see Database section).

`vite.config.js` has no `/api` proxy, so under plain `npm run dev` every `/api/*` fetch fails — the Donor Portal, `/admin`, and the public tier list in `DoadorCategorias.jsx` all need `vercel dev`.

Stack: React 19 + Vite 7 + Tailwind CSS 4 (configured via `@import "tailwindcss"` in `src/index.css` and `@tailwindcss/postcss`), React Router 7, plain JS/JSX (no TypeScript). `README.md` is outdated (lists `src/utils/` and `src/styles/`, which don't exist) — trust this file instead.

## Architecture

### Routing Structure (src/App.jsx)
- **Main Website**: Routes under `/*` wrapped in `MainLayout` (Header + Footer)
- **Donor Portal**: `/doador/*` routes outside MainLayout with Firebase authentication
  - `/doador/login` - Public login page (`DoadorLogin.jsx`)
  - `/doador` - Protected dashboard (`DoadorDashboard.jsx`, requires authentication)
- **Admin Portal**: `/admin` (`Admin.jsx`) outside MainLayout, wrapped in `ProtectedRoute` (login-only gate; admin authorization is enforced server-side per endpoint — see Admin Portal below)

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
- `src/ui/` - **Dead code**: Launch UI Pro TypeScript sources saved as `.js` (type annotations intact, deps like `class-variance-authority`/`@radix-ui` not installed). Nothing imports them and they don't parse as JS, so ESLint ignores the folder. Port properly before using
- `src/contexts/` - `AuthContext.jsx` exports only `AuthProvider`; the context object lives in `auth-context.js` and the hook in `src/hooks/useAuth.js` (split so `react-refresh/only-export-components` passes). Import `useAuth` from `hooks/useAuth`
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
- **Not token-authenticated**: `DoadorDashboard.jsx` calls `GET /api/donor-data?email=<user.email>` with no `Authorization` header, and the handler does not call `verifyIdToken` — it trusts the `email` query param. The only gate is the client-side `ProtectedRoute`. Responses are CDN-cached (`s-maxage=60`). Contrast with `api/admin/*`, where the client sends `Authorization: Bearer <Firebase ID token>` on every request. If you harden this endpoint, reuse `verifyIdToken` from `api/_lib/auth.js` and compare `decoded.email` to the requested email.
- `donor-data.js` builds its **own** `pg` Pool inline instead of importing `api/_lib/db.js` (the two only share an instance in dev, via `globalThis.__pgPool`). Pool settings changes must be made in both places.

### Blog
Blog content is hardcoded in two places that must stay in sync: the `posts` array in `src/pages/Blog.jsx` (listing cards) and the `blogPosts` object keyed by slug in `src/pages/BlogPost.jsx` (full article bodies). There is no CMS or markdown pipeline.

### Admin Portal
A separate authenticated area at `/admin` (`src/pages/Admin.jsx`, gated by the same `ProtectedRoute`) backed by serverless functions under `api/admin/`. Every handler calls `requireAdmin(req, res)` from `api/_lib/auth.js` as its first line.

- **Admin auth is two-layered** (`api/_lib/auth.js → isAdmin`): (1) `ADMIN_EMAILS` env var = zero-DB emergency bootstrap; (2) the `admins` Postgres table managed through the UI. Either match grants access. If the DB is down, only the env-var admins keep access. `ProtectedRoute` only checks *logged-in*, not *admin* — the admin gate is server-side per endpoint.
- **Shared libs** (`api/_lib/`): `db.js` exports a singleton `pg` `pool` (cached on `globalThis` in dev to survive hot reload; imported by every admin handler and `auth.js` — but not by `donor-data.js`, see above); `auth.js` exports `verifyIdToken`, `isAdmin`, `requireAdmin`. Firebase Admin is initialised with `VITE_FIREBASE_PROJECT_ID`, so that client-prefixed var must also be set server-side on Vercel.
- **Frontend is a single file**: `src/pages/Admin.jsx` (~1700 lines) holds every tab as a local component (`DashboardTab`, `DonorsTab`, `AddPixTab`, `AddProfileTab`, `DoareTab`, `RulesTab`, `AdminsTab`) plus shared helpers (`CategoriaBadge`, `SortableTH`, `Feedback`, `downloadCSV`). Tabs receive a `getToken` prop and attach the Bearer token themselves.
- **Endpoints**: `stats.js` (dashboard aggregations, all queries `Promise.all`'d), `donors.js`, `donations.js` (append donation events), `admins.js` (CRUD; refuses to remove yourself to avoid lockout), `category-rules.js` (edit the `min_valor` of the 6 official tiers in `category_tiers`), `doare-preview.js` + `doare-commit.js` (the doa.re CSV import flow, below).
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
- `eslint.config.js` has two scopes: browser globals for everything, plus a Node-globals override for `api/**/*.js`. `scripts/*.mjs` are outside the lint glob and `src/ui` is ignored (see Key Directories). `no-unused-vars` ignores names matching `^[A-Z_]`, so unused imported components/icons are *not* reported
- `vercel.json` sets `Cross-Origin-Opener-Policy: same-origin-allow-popups` on all routes — required for the Firebase Google sign-in popup; don't tighten it to `same-origin`
- Avoid complex dynamic icon rendering patterns (e.g., `const IconComponent = item.icon`) - can cause crashes
- Test new components in isolation before page integration
- The Sobre Nós flyout's featured tiles live in `src/components/SobreNosFlyout.jsx`, not in `Navbar.jsx`
- `src/App-backup.jsx` is a stale backup; the live router is `src/App.jsx`

### Vercel Configuration
- `vercel.json` handles SPA routing and API pass-through
- Use `vercel dev` locally to test serverless functions
- The repo is linked to a Vercel project (`.vercel/project.json`). Push to `main` auto-deploys to production; PRs get preview deployments commented by the Vercel bot

### Analytics (Google Analytics 4)
- Measurement ID `G-SGSQQKK5TC`. The gtag.js snippet lives in `index.html`, placed right after `<meta charset="UTF-8" />` — Google's instructions say "immediately after `<head>`", but the charset declaration must stay first in the head; GA behaves identically either way
- This is a Vite SPA with a single HTML entry document, so that one tag covers **every** route (`/`, `/sobre-nos/*`, `/impacto/*`, `/doador/*`, `/admin`). Never add a second tag — Google counts duplicates as doubled pageviews
- **Route changes are not tracked by the snippet itself.** `gtag('config', ...)` fires one `page_view` on initial load; React Router navigations depend on GA4 Enhanced Measurement ("Page changes based on browser history events", enabled by default on the data stream). If route views stop appearing, check that toggle in the GA4 UI before adding code

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
- `category_tiers` — the 6 official donation categories from the Relatório Anual (Amigo ≥ 5k, Aliado ≥ 10k, Protetor ≥ 20k, Patrono ≥ 50k, Patrono Associado ≥ 100k, Patrono Benemérito ≥ 300k). Names/benefits fixed; `min_valor` editable via admin. Donors below Amigo get `categoria = NULL` ("sem categoria").
- `category_rules` — **deprecated** legacy singleton (old 3-category model). The app no longer reads it; only the bootstrap scripts (`migrate-to-events.mjs`, `add-rm-column.mjs`) still reference it when provisioning a **fresh** DB, and both skip their view recreation once `category_tiers` exists.
- `admins` — DB-managed admin allowlist (`active` flag).
- `donor_summary` **view** — the read model the app actually queries: JOINs `donors` + `SUM(donation_events.amount)` and picks `categoria` as the highest `category_tiers` row whose `min_valor` was reached (NULL below the lowest). Both `donor-data.js` and `admin/stats.js` read this. Public tier list served by `GET /api/categories` (no auth — content is public in the annual report).

**Migration scripts** (each `node --env-file=.env.local scripts/<name>`, all idempotent — run in this order on a fresh DB): `setup-db.mjs` → `migrate-to-events.mjs` (creates `donation_events`, `category_rules`, `donor_summary`) → `add-event-dedup-index.mjs` → `add-admins-table.mjs` (seeds from `ADMIN_EMAILS`) → `add-rm-column.mjs` → `migrate-category-tiers.mjs` (creates/seeds `category_tiers`, recreates `donor_summary` for the 6-tier model). Bulk importers: `import-pix-historical.py`, `import-profiles.py`. Cleanup test data with `cleanup-fixtures.mjs`.

Test the API handler locally without `vercel dev`:
```bash
node --env-file=.env.local scripts/test-api.mjs
```

### Category Badge Styling (Donor Portal + Admin)
- **Patrono / Patrono Associado / Patrono Benemérito**: Full gradient background
- **Aliado / Protetor**: Gradient border with white background, gradient text
- **Amigo**: Subtle gray background
- **NULL (below Amigo)**: no badge — render a plain "—"

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
