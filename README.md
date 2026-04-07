<p align="center">
  <img src="public/logo.svg" alt="initweave" width="400"/>
</p>

<p align="center">
  <strong>A module-based Emacs config generator.</strong><br/>
  Pick the packages you want, download a working <code>init.el</code>, and start using Emacs.
</p>

<p align="center">
  <a href="https://github.com/timotaysci/Initweave/actions/workflows/azure-static-web-apps-green-ground-018f02f10.yml">
    <img src="https://github.com/timotaysci/Initweave/actions/workflows/azure-static-web-apps-green-ground-018f02f10.yml/badge.svg" alt="CI/CD"/>
  </a>
  <a href="https://www.initweave.com">
    <img src="https://img.shields.io/website?url=https%3A%2F%2Fwww.initweave.com&label=initweave.com" alt="Website"/>
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"/>
  </a>
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" alt="React 18"/>
  <img src="https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-build-646cff?logo=vite&logoColor=white" alt="Vite"/>
</p>

<p align="center">
  Live at <a href="https://www.initweave.com">www.initweave.com</a> — free, no account required.
</p>

---

## The problem

The blank `init.el` is a well-known barrier to entry. Not because Emacs is poorly designed, but because the first session asks you to make decisions you don't yet have the context to make: which completion framework, which theme, which keybindings. You end up copying config snippets from blog posts written years ago, or reaching for Doom or Spacemacs to defer the problem entirely.

initweave gives you a better starting point. Pick the modules you want from a curated list, get a working `init.el`, and start using the tool. The opinionation is upfront and explicit rather than hidden inside a framework.

## Why not Doom or Spacemacs?

I started with Spacemacs. It slowed down my learning. I only really understood what I needed — and how Emacs worked — after building a config from scratch. initweave tries to give you that starting point without an abstraction layer getting in the way. The output is plain elisp with no runtime dependency on initweave. Read it, understand it, modify it.

## Features

- **Choose a persona** — Scientist, Knowledge Worker, Academic, Writer, DevOps, Student, Developer — to pre-select a sensible starting set of modules
- **Toggle modules** on and off; dependency resolution is automatic (enabling org-roam enables org)
- **AI Config** — describe what you need in plain English; Claude suggests modules and generates custom elisp blocks for anything the library doesn't cover
- **Download as `init.el`** for a drop-in config, or **as `init.org`** for an org-babel-tangle workflow
- **Save configurations** across sessions if you sign in (magic-link, no password required)

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

All third-party packages use `:ensure t`; built-ins (org, eglot, tramp, flyspell) use `:ensure nil`. No global `use-package-always-ensure`.

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

To use the real Azure Functions emulator instead, install [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local) and run:

```bash
cd api && npm install && func start
```

Then set `VITE_API_BASE_URL=http://localhost:7071` in `.env.local`.

## Tests

```bash
npm test
```

Tests cover dependency resolution, module ordering, elisp output, and `:ensure` hygiene (guards against built-in packages being accidentally pushed to MELPA). The CI pipeline installs `emacs-nox` and runs the full suite before any deployment.

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
3. Run `npm test` — hygiene tests will catch `:ensure` mistakes
4. Open a PR

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Auth & database | Supabase (magic-link, no password) |
| Hosting & API | Azure Static Web Apps + Azure Functions |
| AI Config | Anthropic Claude API |
| Analytics | GoatCounter (privacy-friendly, no cookies) |

## License

[MIT](LICENSE)
