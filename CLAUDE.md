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
- **Data Source**: Google Sheets via service account
- **Lookup**: Email-based (case-insensitive)

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
GOOGLE_SHEETS_PRIVATE_KEY
GOOGLE_SHEETS_CLIENT_EMAIL
GOOGLE_SHEETS_SPREADSHEET_ID
```

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
