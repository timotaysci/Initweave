# initweave

**A module-based Emacs config generator.** Pick the packages you want, download a working `init.el`, and start using Emacs.

Live at [www.initweave.com](https://www.initweave.com) — free, no account required.

---

## The problem

The blank `init.el` is a well-known barrier to entry. Not because Emacs is poorly designed, but because the first session asks you to make decisions you don't yet have the context to make: which completion framework, which theme, which keybindings. You end up copying config snippets from blog posts written years ago, or reaching for Doom or Spacemacs to defer the problem entirely.

I built initweave to give you a better starting point. You pick the modules you want from a curated list, get a working `init.el`, and start using the tool. The opinionation is upfront and explicit rather than hidden inside a framework.

## Why not Doom or Spacemacs?

I started with Spacemacs. It slowed down my learning. I only really understood what I needed — and how Emacs worked — after building a config from scratch. initweave tries to give you that starting point without an abstraction layer getting in the way. The output is plain elisp with no runtime dependency on initweave. Read it, understand it, modify it.

## What it does

- **Choose a persona** — Scientist, Knowledge Worker, Academic, Writer, DevOps, Student, Developer — to pre-select a sensible starting set of modules
- **Toggle modules** on and off; dependency resolution is automatic (enabling org-roam enables org)
- **Download as `init.el`** for a drop-in config, or **as `init.org`** for an org-babel-tangle workflow
- **Save configurations** across sessions if you sign in (magic-link, no password)

## Module library

| Category | Modules |
|---|---|
| **Org-mode** | Core, Capture templates, Org-roam, Babel/Python, Org-drill, Deft |
| **Completion** | Vertico + Marginalia, Orderless, Corfu |
| **Developer** | Eglot (LSP, built-in), Magit, Projectile |
| **Scientific** | ESS (R/Statistics), AUCTeX (LaTeX) |
| **Writing** | Olivetti, Flyspell, Markdown mode |
| **System** | vterm, TRAMP |
| **Editing** | which-key, Ef themes (ef-dream), Sensible defaults |

All third-party packages use `:ensure t`; built-ins (org, eglot, tramp, flyspell, modus-themes) use `:ensure nil`. No global `use-package-always-ensure`.

---

## Local development

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Running the AI API locally

The AI Config feature uses an Azure Function in `api/`. For local development a lightweight Node.js stand-in is provided:

```bash
node dev-api.mjs
```

Create a `.env.local` with:

```
ANTHROPIC_API_KEY=sk-ant-...
VITE_API_BASE_URL=http://localhost:3001
```

To use the real Azure Functions emulator instead, install Azure Functions Core Tools and run:

```bash
cd api && npm install && func start
```

Then set `VITE_API_BASE_URL=http://localhost:7071` in `.env.local`.

## Tests

```bash
npm test
```

Tests cover dependency resolution, module ordering, elisp output, and `:ensure` hygiene (guards against built-in packages being accidentally pushed to MELPA).

## Linting

```bash
npm run lint
```

Uses ESLint v9 flat config with TypeScript and React plugins.

## Deploying

The app deploys automatically on push to `main` via Azure Static Web Apps CI.

To deploy manually:

```bash
npm run build
swa deploy ./dist --env production
```

Required environment variables (**Azure portal > Configuration > Application settings**):

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Powers the AI Config feature |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |

## Contributing

Contributions welcome — especially new modules.

All module definitions live in `src/modules.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for a full walkthrough. The short version:

1. Add an entry to the `modules` array in `src/modules.ts`
2. Use `:ensure t` for MELPA packages, `:ensure nil` for Emacs built-ins
3. Run `npm test` — there are hygiene tests that will catch `:ensure` mistakes
4. Open a PR

## Stack

React 18 + TypeScript + Vite · Supabase (auth + database) · Azure Static Web Apps + Azure Functions · Anthropic Claude API (AI Config feature) · GoatCounter (privacy-friendly analytics)
