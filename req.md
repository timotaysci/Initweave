# initweave — Product Requirements Document
**Version:** 1.0 (v1 scope)  
**Status:** Draft  
**Engagement type:** Fixed-scope freelance  
**Last updated:** March 2026

---

## 1. Overview

initweave is a free, open-source web tool that helps people build a working Emacs `init.el` configuration file without needing prior Emacs knowledge. The target user is someone who has heard of Emacs (or been recommended it) but finds the blank-slate configuration barrier too high to get started.

The product is opinionated: it is **org-mode first**. Org-mode is the primary reason many people adopt Emacs, and the tool reflects this by surfacing org-related modules prominently and defaulting to a useful org setup out of the box.

v1 ships two features: a **module-based init builder** and an **AI-powered plain English help interface**. Monetisation is deferred to v2.

---

## 2. Goals

- Reduce the time-to-working-Emacs for a non-technical user from hours to minutes.
- Produce a valid, well-commented `init.el` that a user can drop in and run immediately.
- Make org-mode workflows approachable through contextual natural language help.
- Be open source from day one, with a codebase that is easy for contributors to extend.

---

## 3. Non-goals (v1)

The following are explicitly out of scope for this engagement:

- User accounts, authentication, or any backend infrastructure.
- Config syncing or cloud storage (planned for v2).
- A "Recipes" tab (designed in prototype, deferred to v2).
- Mobile-optimised layout (desktop browser is the primary target).
- Support for Doom Emacs, Spacemacs, or other distributions — vanilla Emacs only.

---

## 4. Target users

**Primary:** Someone new to Emacs who wants a sensible starting config. Likely already uses a plain text editor or IDE; has been told org-mode is worth the investment.

**Secondary:** Intermediate Emacs users who want to rebuild or share a clean, readable config without writing boilerplate from scratch.

---

## 5. Feature specifications

### 5.1 Module builder

The core of the product. Users toggle modules on/off; the tool generates a complete, ready-to-paste `init.el` in real time.

**Module behaviour:**

- Each module is a named block of elisp with a short plain-English description shown in the UI.
- Some modules are **required** and always included (cannot be toggled off): use-package bootstrap and sensible defaults.
- Some modules have **dependencies**: enabling them automatically enables their parent module. For example, enabling org-capture requires org-mode core. The UI should make this relationship visible.
- Module order in the generated output follows a fixed logical sequence regardless of the order the user enables them (e.g. use-package bootstrap always appears first).

**v1 module set:**

| Module | Label | Required | Depends on |
|---|---|---|---|
| `use-package` | use-package bootstrap | Yes | — |
| `basics` | Sensible defaults | Yes | — |
| `theme` | Modus themes | No | — |
| `which-key` | which-key | No | — |
| `completion` | Vertico + Marginalia | No | — |
| `org` | Org-mode core | No | — |
| `org-capture` | Org capture templates | No | org |
| `org-roam` | Org-roam (linked notes) | No | org |

The specific elisp content for each module is defined in the reference prototype and should be used as the canonical source for v1. New modules may be added in future; the architecture should make this straightforward (e.g. a simple config array or file-based module registry).

**Generated output requirements:**

- Valid, syntactically correct elisp.
- Each module block preceded by a comment header (`;;; Module name`).
- File opened with a header comment including the tool name and generation date.
- File closed with `;;; init.el ends here` (standard Emacs convention).
- Syntax-highlighted in the preview panel (comment lines, string literals, keywords, and package names should each be visually distinct).

**Copy to clipboard:**

A single button copies the full generated `init.el` to the clipboard. Button state should briefly change to confirm success (e.g. "copied ✓").

**Install instructions:**

Below the preview, a persistent instruction line tells the user where to save the file (`~/.emacs.d/init.el`) and that packages install automatically on first launch. This should be simple prose, not a code block.

---

### 5.2 AI help ("Ask")

A tab separate from the builder where users can ask questions about Emacs and org-mode in plain English. This is **not** a general-purpose chatbot — it is scoped specifically to Emacs keybindings, org-mode workflows, and init.el configuration questions.

**Interface:**

- A text input area with a submission button. Enter key (without shift) submits.
- A small set of pre-written example questions rendered as clickable chips above the input. Clicking a chip populates the input field (does not auto-submit). Suggested examples:
  - "How do I schedule a task for next Monday?"
  - "What's the shortcut to clock in on a task?"
  - "How do I archive a completed todo?"
  - "Show me how to link between org files"
  - "How do I export to PDF?"
- A loading state while the response is in flight (subtle animated indicator).
- The answer rendered below the input, with code blocks formatted as monospace with a distinct background.

**AI behaviour (system prompt):**

The model should be instructed to:

- Answer only Emacs and org-mode questions; decline anything outside this scope politely.
- Keep answers short: one plain-English sentence, then the relevant keybinding or elisp snippet in a code block, then one practical tip.
- Assume the user has no prior Emacs knowledge — avoid jargon.
- Be warm and encouraging in tone.

**API:**

Use the Anthropic Messages API (`claude-sonnet-4-20250514`). The API key must be configurable via environment variable (`VITE_ANTHROPIC_API_KEY` or equivalent) and must never be committed to the repository. The README must clearly document how to configure this.

---

## 6. Technical requirements

### 6.1 Stack

The developer is free to propose the stack best suited to the requirements. The prototype was built in React; this is a reasonable default but not a hard requirement. Key constraints:

- Must be a static, client-side application with no required server component for the core builder.
- The AI feature requires a call to the Anthropic API. To avoid exposing the API key in client-side code in production, the developer should propose an appropriate approach — options include a lightweight serverless function (e.g. Vercel Edge Function, Cloudflare Worker) acting as a proxy, or documenting that self-hosters supply their own key.
- Must be deployable to Vercel, Netlify, or GitHub Pages with a single command.

### 6.2 Open source requirements

- MIT licence.
- Repository hosted on GitHub (owner will create the repo; developer should work in a fork or branch as agreed).
- A `CONTRIBUTING.md` explaining how to add new modules — this is important for future community involvement.
- A `README.md` covering: what the project is, how to run it locally, how to configure the API key, and how to deploy.
- No hard-coded content that makes extending modules difficult. Modules should be defined in a single, obvious location (e.g. a `modules.ts` config file or a `modules/` directory of individual files).

### 6.3 Code quality

- TypeScript strongly preferred if using React or a similar framework.
- No mandatory test suite for v1, but the module generation logic (sorting, dependency resolution, elisp assembly) should be unit-testable and ideally have at least basic tests.
- Linting and formatting config included (ESLint + Prettier or equivalent).

---

## 7. Design

The developer should use the provided prototype as the primary design reference for layout, structure, and interaction patterns. Key design constraints:

- The aesthetic should feel like it belongs in the Emacs world: monospace-forward, low-key, functional. Avoid bright consumer-app aesthetics.
- Dark background with amber/gold accent colours (as per prototype).
- IBM Plex Mono (or similar) for code and UI chrome; a humanist serif for body text.
- The builder and ask tabs must be clearly separated in the navigation; no content should cross between them.

Pixel-perfect fidelity to the prototype is not required. The developer has latitude to refine spacing, responsiveness, and interaction details. Any significant visual departures should be flagged for sign-off before implementation.

---

## 8. Deliverables

| Deliverable | Notes |
|---|---|
| Working web application | Matching the feature spec above |
| GitHub repository | Public, MIT licensed, with README and CONTRIBUTING |
| Deployment | Live URL on Vercel or equivalent |
| Module config file | Clean, documented, easy to extend |
| API proxy (if applicable) | With documentation |

---

## 9. Out of scope / future work

The following are noted here so the developer understands the likely direction, but should not be built in v1:

- **Recipes tab:** Pre-built config bundles (GTD, academic writing, etc.) that load a module selection into the builder. Designed in prototype.
- **InitHub (sync):** User accounts, saved configs, cross-machine sync. The primary monetisation lever for v2.
- **Community sharing:** Public config gallery, forking others' configs.
- **Evil mode / Magit / LSP modules:** Planned module additions post-launch.

---

## 10. Open questions for the developer

The following should be resolved before work begins:

1. **API key handling in production:** What approach do you recommend for the AI feature — serverless proxy, or user-supplied key? Please include any cost/complexity implications.
2. **Framework:** Do you have a strong preference, or are you comfortable with React + Vite as a baseline?
3. **Module architecture:** File-per-module or single config array? Any preference given the contributor experience goal?

---

*This document represents the agreed v1 scope. Changes to scope require written agreement between both parties before implementation begins.*
