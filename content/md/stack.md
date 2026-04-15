# Stack

Everything that powers jaygriff.com

## Framework

- **Next.js 16** — App Router with Server Components by default
- **React 19** — latest concurrent features
- **TypeScript** — strict mode, end-to-end type safety

---

## Styling

- **Tailwind CSS v4** — configured via `@theme inline` in `globals.css`
- **oklch color space** — perceptually uniform colors, CSS custom properties for light/dark
- **CSS Modules** — scoped styles where Tailwind alone isn't enough, using `@reference` for Tailwind integration
- **Dark mode** — automatic via `next-themes`, class-based toggling on `<html>`

---

## Components

- **shadcn/ui** — Radix-based primitives, new-york style, direct imports from `@/components/ui/`
- **Custom typography system** — `<H1>` through `<H6>`, `<Paragraph>`, `<Bold>`, `<Italic>`, `<InlineCode>`, `<Link>`, and more from `@/components/typography/`
- **`cn()` utility** — `clsx` + `tailwind-merge` for all dynamic class logic

---

## Database

- **Turso** (libSQL) — edge-hosted SQLite, single `content` table
- **Content sync pipeline** — markdown files in `content/md/` are synced to Turso via `scripts/sync-content.ts`
- **AI-inferred metadata** — Claude generates title, slug, type, and tags from content; no frontmatter required

---

## AI

- **Claude API** (Anthropic) — generates metadata (title, slug, tags) for markdown content via `scripts/generate-metadata.ts`
- **Build-time only** — not client-facing

---

## Auth

- **JWT-based admin auth** — `jose` library for token signing/verification
- **Proxy route** (`/api/proxy`) — authenticated API calls to Turso from admin UI
- **Single admin password** — environment variable, no user database

---

## Fonts

| Font | Variable | Usage |
|------|----------|-------|
| Geist Sans | `--font-geist-sans` | Body text, UI |
| Geist Mono | `--font-geist-mono` | Code, monospace |
| JetBrains Mono | `--font-jetbrains-mono` | Code blocks |
| Sekuya | `--font-sekuya` | Display headings (bundled locally, buggy with Next.js font loader) |

---

## Deployment

- **Vercel** — production hosting, automatic deploys from `main`
---

## Tooling

- **ESLint** — flat config (`eslint.config.mjs`)
- **PostCSS** — Tailwind processing pipeline
- **GitHub Copilot** — AI-assisted development with custom instructions and skills
