export interface ModuleLink {
  label: string
  url: string
  kind: 'melpa' | 'github' | 'blog' | 'docs'
}

export interface ModuleDetails {
  prose: string
  links: ModuleLink[]
}

export interface Module {
  id: string
  label: string
  description: string
  details: ModuleDetails
  required: boolean
  dependsOn?: string
  order: number
  group: string
  elisp: string
}

export const modules: Module[] = [
  {
    id: 'use-package',
    label: 'use-package bootstrap',
    description: 'Configures MELPA and bootstraps use-package, the standard package configuration macro.',
    details: {
      prose: `use-package is a macro for declarative package configuration. Created by John Wiegley — a former Emacs project maintainer — it wraps installation and configuration in a single form: each call declares what to install, when to load it, and how to configure it.\n\nEvery package in this config uses it. On first launch, use-package checks whether each package is installed and fetches it from MELPA if not. When you use keywords like :hook, :bind, or :mode, loading is deferred until the package is actually needed — keeping startup fast even with a large config.\n\nThis module also configures MELPA itself, the community package archive that hosts nearly every third-party Emacs package.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/jwiegley/use-package', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/use-package', kind: 'melpa' },
        { label: 'MELPA (melpa.org)', url: 'https://melpa.org', kind: 'docs' },
        { label: 'Refactoring my Emacs config with Claude Code', url: 'https://timothyjohnsonsci.com/writing/2026-01-01-refactoring-emacs-config-with-claude-code/', kind: 'blog' },
      ],
    },
    required: true,
    order: 0,
    group: 'Core',
    elisp: `;;; Package management — MELPA + use-package

(require 'package)

(add-to-list 'package-archives '("melpa" . "https://melpa.org/packages/") t)
(package-initialize)

;; Refresh package list on first run if needed
(unless package-archive-contents
  (package-refresh-contents))

;; Bootstrap use-package
(unless (package-installed-p 'use-package)
  (package-install 'use-package))

(require 'use-package)`,
  },

  {
    id: 'basics',
    label: 'Sensible defaults',
    description: 'Suppresses the startup screen, disables toolbars, enables line numbers, and sets up sane editing defaults.',
    details: {
      prose: `Everything here is built into Emacs — no external packages. These are the settings most people add on day one and never revisit.\n\nThe startup screen and scratch message are silenced; the menu bar, tool bar, and scroll bar are hidden; relative line numbers appear in programming modes; cursor position is remembered across sessions via save-place-mode; and recentf tracks recently opened files.\n\nFile handling: no backup files cluttering your directories, no lock files, UTF-8 everywhere, short "y/n" prompts instead of "yes/no". Buffers stay in sync with disk changes automatically, and matching parentheses are highlighted with no delay.`,
      links: [
        { label: 'Emacs manual: Init File', url: 'https://www.gnu.org/software/emacs/manual/html_node/emacs/Init-File.html', kind: 'docs' },
      ],
    },
    required: true,
    order: 1,
    group: 'Core',
    elisp: `;;; Sensible defaults

;; Silence startup noise
(setq inhibit-startup-message t
      inhibit-startup-echo-area-message t
      initial-scratch-message nil)

;; Clean up the UI
(menu-bar-mode -1)
(tool-bar-mode -1)
(scroll-bar-mode -1)
(tooltip-mode -1)

;; Relative line numbers in programming modes
(add-hook 'prog-mode-hook #'display-line-numbers-mode)

;; Remember cursor position between sessions
(save-place-mode 1)

;; Keep a list of recently opened files
(recentf-mode 1)
(setq recentf-max-saved-items 50)

;; No backup or lock files cluttering the filesystem
(setq make-backup-files nil
      auto-save-default nil
      create-lockfiles nil)

;; Prefer UTF-8 everywhere
(set-language-environment "UTF-8")
(prefer-coding-system 'utf-8)

;; Short answers ("y" / "n" instead of "yes" / "no")
(setq use-short-answers t)

;; Follow symlinks to version-controlled files without asking
(setq vc-follow-symlinks t)

;; Single space after sentence-ending period
(setq sentence-end-double-space nil)

;; Show matching parens immediately
(show-paren-mode 1)
(setq show-paren-delay 0)

;; Automatically keep buffers in sync with disk
(global-auto-revert-mode 1)
(setq global-auto-revert-non-file-buffers t)`,
  },

  {
    id: 'theme',
    label: 'Ef themes',
    description: 'Loads ef-dream from the ef-themes collection — a vivid dark theme by the author of Modus themes.',
    details: {
      prose: `A collection of 28+ accessible themes by Protesilaos Stavrou ("Prot"), who also created the Modus themes. The ef-themes are described as "colourful yet legible" — each has a distinct character while keeping contrast ratios high enough to read comfortably for hours.\n\nThis module loads ef-dream: a dark theme with deep indigo backgrounds and warm amber accents. Other themes in the collection include ef-light, ef-duo-dark, and ef-autumn — swap the theme name in load-theme to try them.\n\nProt writes about colour theory and Emacs design on his blog.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/protesilaos/ef-themes', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/ef-themes', kind: 'melpa' },
        { label: 'Official docs', url: 'https://protesilaos.com/emacs/ef-themes', kind: 'docs' },
        { label: "Prot's blog", url: 'https://protesilaos.com', kind: 'blog' },
      ],
    },
    required: false,
    order: 2,
    group: 'Appearance & UI',
    elisp: `;;; Ef themes

(use-package ef-themes
  :ensure t)
(load-theme 'ef-dream t)`,
  },

  {
    id: 'which-key',
    label: 'which-key',
    description: 'Shows available key bindings in a popup after a short delay — essential for discovering commands.',
    details: {
      prose: `After pressing any prefix key — C-c, C-x, M-g, and so on — which-key pops up a panel at the bottom of the frame listing every binding reachable from that prefix, along with the command name.\n\nIf you're new to Emacs, install this first. It removes the need to memorise bindings upfront and surfaces commands you didn't know existed. For experienced users it's still useful — Emacs is large enough that you'll keep finding things.\n\nAs of Emacs 30, which-key was merged into Emacs core. This module installs the MELPA version for users on older releases. The popup appears after 0.5 seconds here — adjust which-key-idle-delay to taste.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/justbur/emacs-which-key', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/which-key', kind: 'melpa' },
      ],
    },
    required: false,
    order: 3,
    group: 'Appearance & UI',
    elisp: `;;; which-key — keybinding discovery

(use-package which-key
  :ensure t
  :config
  (setq which-key-idle-delay 0.5
        which-key-idle-secondary-delay 0.05)
  (which-key-mode))`,
  },

  {
    id: 'completion',
    label: 'Vertico + Marginalia',
    description: 'Vertico provides a vertical minibuffer completion UI; Marginalia adds rich annotations to candidates.',
    details: {
      prose: `Three micro-packages that together replace the default minibuffer experience without the complexity of Helm or Ivy.\n\n**Vertico** renders completion candidates in a vertical list, making it easy to see and navigate options for M-x, find-file, switch-buffer, and every other command that uses completing-read.\n\n**Marginalia** adds contextual annotations to each candidate: file sizes and modification dates for files, docstrings for commands, key bindings for functions. This information appears unobtrusively to the right of each item.\n\n**Orderless** provides a flexible completion style: type space-separated fragments and they match in any order, anywhere in the candidate name. "ma mo" matches "markdown-mode" and "magit-commit-message-mode" alike.\n\nAll three are created by Daniel Mendler (Vertico, Marginalia) and Omar Antolín Camarena (Orderless), who favour small, focused packages that compose with Emacs's built-in infrastructure rather than replacing it.`,
      links: [
        { label: 'Vertico GitHub', url: 'https://github.com/minad/vertico', kind: 'github' },
        { label: 'Vertico MELPA', url: 'https://melpa.org/#/vertico', kind: 'melpa' },
        { label: 'Marginalia GitHub', url: 'https://github.com/minad/marginalia', kind: 'github' },
        { label: 'Orderless GitHub', url: 'https://github.com/oantolin/orderless', kind: 'github' },
      ],
    },
    required: false,
    order: 4,
    group: 'Completion',
    elisp: `;;; Completion — Vertico (UI) + Marginalia (annotations)

(use-package vertico
  :ensure t
  :config
  (setq vertico-cycle t)
  (vertico-mode))

(use-package marginalia
  :ensure t
  :after vertico
  :config
  (marginalia-mode))

;; Orderless: space-separated completion components in any order
(use-package orderless
  :ensure t
  :config
  (setq completion-styles '(orderless basic)
        completion-category-overrides '((file (styles basic partial-completion)))))`,
  },

  {
    id: 'org',
    label: 'Org-mode core',
    description: 'Sets up an org directory, TODO keywords, agenda files, and the standard C-c a / C-c l bindings.',
    details: {
      prose: `Org-mode is a plain-text format that works as an outliner, task manager, calendar, spreadsheet, and literate programming environment. The same file can hold your notes, your todos, and executable code blocks.\n\nThis module sets up the essentials: ~/org as the home for all org files, a TODO state machine (TODO → IN-PROGRESS → WAITING → DONE / CANCELLED), agenda integration so C-c a surfaces tasks and deadlines, and C-c l to store links for later insertion with C-c C-l.\n\nOrg ships with Emacs but is developed separately — the MELPA version is more current. The manual is extensive; most people are still finding things in it years in.`,
      links: [
        { label: 'Official site', url: 'https://orgmode.org', kind: 'docs' },
        { label: 'Org manual', url: 'https://orgmode.org/manual/', kind: 'docs' },
        { label: 'MELPA', url: 'https://melpa.org/#/org', kind: 'melpa' },
        { label: 'Worg (community wiki)', url: 'https://orgmode.org/worg/', kind: 'blog' },
        { label: 'Blogging with Emacs', url: 'https://timothyjohnsonsci.com/writing/2020-05-18-blogging-with-emacs/', kind: 'blog' },
        { label: 'Open Org Attachments in File Explorer', url: 'https://timothyjohnsonsci.com/writing/2025-12-13-orgattach/', kind: 'blog' },
        { label: 'Plain Text Should Be the Default', url: 'https://timothyjohnsonsci.com/writing/2026-01-12-plain-text-ai/', kind: 'blog' },
      ],
    },
    required: false,
    order: 5,
    group: 'Org-mode',
    elisp: `;;; Org-mode core

(use-package org
  :ensure nil
  :config
  ;; Directory where your .org files live
  (setq org-directory "~/org"
        org-default-notes-file (expand-file-name "inbox.org" org-directory))

  ;; Include all .org files in the agenda
  (setq org-agenda-files (list org-directory))

  ;; TODO state workflow
  (setq org-todo-keywords
        '((sequence "TODO(t)" "IN-PROGRESS(i!)" "WAITING(w@)" "|" "DONE(d!)" "CANCELLED(c@)")))

  ;; Visual tweaks
  (setq org-startup-indented t
        org-hide-leading-stars t
        org-ellipsis " ▾"
        org-src-fontify-natively t
        org-src-tab-acts-natively t
        org-edit-src-content-indentation 0
        org-return-follows-link t)

  ;; Log timestamps when tasks are closed
  (setq org-log-done 'time
        org-log-into-drawer t)

  :bind
  (("C-c a" . org-agenda)
   ("C-c l" . org-store-link)))`,
  },

  {
    id: 'org-capture',
    label: 'Org capture templates',
    description: 'Provides three quick-capture templates (task, note, journal) bound to C-c c.',
    details: {
      prose: `Org Capture lets you quickly file information without losing your current context. Press C-c c from anywhere in Emacs, choose a template, fill it in, and it is filed to the right place — without you needing to navigate to the target file.\n\nThis module provides three templates:\n\n- **t (Task):** Creates a TODO item filed to your inbox, with a timestamp and a link back to where you were when you captured it.\n- **n (Note):** Creates a note heading tagged with :note:, also with a backlink.\n- **j (Journal):** Appends a timestamped entry to a date-tree in journal.org — useful for daily logs or meeting notes.\n\nThe %a expansion inserts a link to your current buffer location — so if you capture a task while reading an email or a source file, you can jump back to the original context later.`,
      links: [
        { label: 'Org Capture manual', url: 'https://orgmode.org/manual/Capture.html', kind: 'docs' },
        { label: 'Learning by doing — emacs and fastref', url: 'https://timothyjohnsonsci.com/writing/2021-08-04-learning-by-doing-emacs-and-fastref/', kind: 'blog' },
        { label: 'Refactoring my Emacs config with Claude Code', url: 'https://timothyjohnsonsci.com/writing/2026-01-01-refactoring-emacs-config-with-claude-code/', kind: 'blog' },
      ],
    },
    required: false,
    dependsOn: 'org',
    order: 6,
    group: 'Org-mode',
    elisp: `;;; Org capture templates

(use-package org
  :ensure nil
  :config
  (setq org-capture-templates
        '(("t" "Task" entry
           (file+headline org-default-notes-file "Tasks")
           "* TODO %?\\n  %U\\n  %a"
           :empty-lines 1)

          ("n" "Note" entry
           (file+headline org-default-notes-file "Notes")
           "* %? :note:\\n  %U\\n  %a"
           :empty-lines 1)

          ("j" "Journal" entry
           (file+datetree (expand-file-name "journal.org" org-directory))
           "* %<%H:%M> %?\\n"
           :empty-lines 0)))
  :bind
  ("C-c c" . org-capture))`,
  },

  {
    id: 'org-roam',
    label: 'Org-roam (linked notes)',
    description: 'A networked, Zettelkasten-style note-taking system built on top of Org-mode.',
    details: {
      prose: `Org-roam is a non-hierarchical, link-based note system built on Org-mode, inspired by Roam Research and the Zettelkasten method. Notes are plain .org files; org-roam maintains a SQLite index of the links between them.\n\nThe backlinks panel (C-c n l) is the core of the workflow: it toggles a side buffer showing every note that links to the one you're currently reading. Connections emerge from use rather than being planned upfront.\n\nC-c n f finds or creates a node; C-c n i inserts a link inline; C-c n j opens today's daily note. Notes live in ~/org/roam by default — change org-roam-directory to move them.\n\nThe Zettelkasten method, associated with the sociologist Niklas Luhmann, prioritises atomic, interconnected notes over hierarchical folders.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/org-roam/org-roam', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/org-roam', kind: 'melpa' },
        { label: 'Org-roam docs', url: 'https://www.orgroam.com/', kind: 'docs' },
        { label: 'Zettelkasten intro', url: 'https://zettelkasten.de/introduction/', kind: 'blog' },
        { label: 'Refactoring my Emacs config with Claude Code', url: 'https://timothyjohnsonsci.com/writing/2026-01-01-refactoring-emacs-config-with-claude-code/', kind: 'blog' },
      ],
    },
    required: false,
    dependsOn: 'org',
    order: 7,
    group: 'Notes',
    elisp: `;;; Org-roam — networked note-taking

(use-package org-roam
  :ensure t
  :custom
  (org-roam-directory (expand-file-name "roam" org-directory))
  (org-roam-completion-everywhere t)
  :bind
  (("C-c n l" . org-roam-buffer-toggle)
   ("C-c n f" . org-roam-node-find)
   ("C-c n i" . org-roam-node-insert)
   ("C-c n c" . org-roam-capture)
   ("C-c n j" . org-roam-dailies-capture-today))
  :config
  ;; Build the node cache on startup (fast after first run)
  (org-roam-setup))`,
  },

  {
    id: 'magit',
    label: 'Magit',
    description: 'The definitive Git interface for Emacs. Stage hunks, branch, rebase, and review diffs without leaving your editor.',
    details: {
      prose: `Magit is the best Git interface I've used. Its status buffer (C-c g) shows staged, unstaged, and untracked changes. From there, single-key commands handle everything: stage individual hunks (s), commit (c c), branch (b), merge (m), rebase (r), stash (z), push (P), pull (F). Interactive rebase and bisect work too.\n\nThe diff view has word-level highlighting. Commit messages open in a dedicated buffer with a character count for the summary line. The display-buffer setting here keeps the status buffer in the same window rather than splitting.\n\nMaintained by Jonas Bernoulli as his primary open-source project. Once you've used it, going back to the command line feels like a step backwards.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/magit/magit', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/magit', kind: 'melpa' },
        { label: 'Magit manual', url: 'https://magit.vc/manual/', kind: 'docs' },
        { label: 'magit.vc', url: 'https://magit.vc', kind: 'blog' },
      ],
    },
    required: false,
    order: 8,
    group: 'Development',
    elisp: `;;; Magit — Git interface

(use-package magit
  :ensure t
  :bind ("C-c g" . magit-status)
  :config
  (setq magit-display-buffer-function #'magit-display-buffer-same-window-except-diff-v1))`,
  },

  {
    id: 'eglot',
    label: 'Eglot (LSP)',
    description: 'Built-in language server client (Emacs 29+). Provides go-to-definition, hover docs, and completion for any LSP-supported language.',
    details: {
      prose: `Eglot is Emacs's built-in Language Server Protocol client, included since Emacs 29. It connects to language servers — external programs like pyright (Python), rust-analyzer (Rust), clangd (C/C++), or typescript-language-server — and asks them for completions, type information, diagnostics, go-to-definition, find-references, and refactoring actions.\n\nYou still need to install the language server for each language separately (e.g. pip install pyright or npm install -g typescript-language-server). Eglot handles the JSON-RPC communication protocol between Emacs and whichever server you have installed.\n\nEglot is deliberately minimal compared to the older lsp-mode package: it integrates with Emacs's built-in flymake for diagnostics and eldoc for hover documentation, rather than inventing its own UI. This makes it lighter and less intrusive.\n\nThis module enables Eglot in Python, JavaScript, TypeScript, Rust, and Go buffers automatically. Add more hooks for other languages as needed.`,
      links: [
        { label: 'Eglot manual', url: 'https://www.gnu.org/software/emacs/manual/html_mono/eglot.html', kind: 'docs' },
        { label: 'LSP servers list', url: 'https://langserver.org/', kind: 'docs' },
      ],
    },
    required: false,
    order: 9,
    group: 'Development',
    elisp: `;;; Eglot — Language Server Protocol client (built-in, Emacs 29+)

(use-package eglot
  :ensure nil
  :hook
  ((python-mode     . eglot-ensure)
   (js-mode         . eglot-ensure)
   (typescript-mode . eglot-ensure)
   (rust-mode       . eglot-ensure)
   (go-mode         . eglot-ensure))
  :config
  ;; Shut down the server when the last buffer for its project is closed
  (setq eglot-autoshutdown t)
  ;; Don't log server events unless debugging
  (setq eglot-events-buffer-size 0))`,
  },

  {
    id: 'corfu',
    label: 'Corfu (in-buffer completion)',
    description: 'A lightweight popup that completes symbols as you type, using Emacs\'s built-in completion infrastructure.',
    details: {
      prose: `Corfu shows an in-buffer completion popup as you type, powered by Emacs's built-in completion-at-point (CAPF) infrastructure. Any mode that populates CAPF — Eglot, most language modes, and many others — feeds candidates to Corfu automatically.\n\nThe popup appears after 0.2 seconds, Tab selects the top candidate, Return confirms. The corfu-cycle option wraps around the list. No new keymaps to learn beyond that.\n\nCreated by Daniel Mendler, who also maintains Vertico. They work with Emacs's native infrastructure rather than replacing it — which means less to configure and fewer surprises.\n\nThe corfu-move-to-minibuffer command (M-m) hands the current session to Vertico when you want to browse candidates more carefully.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/minad/corfu', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/corfu', kind: 'melpa' },
      ],
    },
    required: false,
    order: 10,
    group: 'Completion',
    elisp: `;;; Corfu — in-buffer completion popup

(use-package corfu
  :ensure t
  :custom
  (corfu-auto t)           ; complete automatically
  (corfu-auto-delay 0.2)
  (corfu-cycle t)          ; wrap around candidate list
  (corfu-quit-no-match t)
  :init
  (global-corfu-mode)
  ;; Transfer completions to the minibuffer (for commands that use completing-read)
  (defun corfu-move-to-minibuffer ()
    (interactive)
    (let ((completion-extra-properties corfu--extra)
          completion-cycle-threshold completion-cycling)
      (apply #'consult-completion-in-region completion-in-region--data)))
  :bind (:map corfu-map ("M-m" . corfu-move-to-minibuffer)))`,
  },

  {
    id: 'projectile',
    label: 'Projectile',
    description: 'Project-aware navigation: quickly switch between projects, find files within a project, and run project-scoped searches.',
    details: {
      prose: `Projectile makes Emacs project-aware. It detects project roots automatically by looking for familiar markers: .git directories, .projectile files, package.json, Cargo.toml, and many others. Once a project is detected, a full suite of scoped commands becomes available via C-c p.\n\nThe most useful commands: C-c p p to switch between known projects, C-c p f to find a file within the current project (lightning fast, even in large repos), C-c p s g to grep within the project, and C-c p r to run project-specific commands.\n\nProjectile pairs naturally with Vertico: when you press C-c p f, Vertico renders the list of project files and Orderless lets you filter by fragments.\n\nCreated and maintained by Bozhidar Batsov, who also maintains RuboCop, CIDER, and a suite of other well-maintained Emacs packages.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/bbatsov/projectile', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/projectile', kind: 'melpa' },
        { label: 'Projectile docs', url: 'https://docs.projectile.mx/', kind: 'docs' },
      ],
    },
    required: false,
    order: 11,
    group: 'Development',
    elisp: `;;; Projectile — project navigation

(use-package projectile
  :ensure t
  :config
  (setq projectile-completion-system 'default
        projectile-sort-order 'recentf)
  (projectile-mode +1)
  :bind-keymap
  ("C-c p" . projectile-command-map))`,
  },

  {
    id: 'auctex',
    label: 'AUCTeX (LaTeX)',
    description: 'Full-featured LaTeX editing: syntax highlighting, compilation, PDF preview, and BibTeX support.',
    details: {
      prose: `AUCTeX is the Emacs mode for LaTeX — actively maintained since the early 1990s and the standard choice for anyone writing LaTeX in Emacs.\n\nIt parses your document structure for context-sensitive completion of commands and environments. C-c C-c runs pdflatex, latexmk, or your preferred engine and reports errors in a navigable buffer. With SyncTeX enabled (TeX-source-correlate-mode t here), C-c C-v opens the PDF at the line your cursor is on — click in the PDF to jump back to the source.\n\nRefTeX (turned on via turn-on-reftex) handles cross-references, citations, and section navigation. It reads your bibliography files and completes \\cite{} keys from them.\n\nFlyspell in LaTeX mode checks prose but ignores commands — no false positives on \\subsection{} and similar.`,
      links: [
        { label: 'Official site', url: 'https://www.gnu.org/software/auctex/', kind: 'docs' },
        { label: 'MELPA', url: 'https://melpa.org/#/auctex', kind: 'melpa' },
        { label: 'AUCTeX manual', url: 'https://www.gnu.org/software/auctex/manual/auctex/', kind: 'docs' },
        { label: 'YASnippet for Science Workflows', url: 'https://timothyjohnsonsci.com/writing/2021-01-24-the_use_of_yasnippet_to_super_charge_science_workflows/', kind: 'blog' },
      ],
    },
    required: false,
    order: 12,
    group: 'Scientific',
    elisp: `;;; AUCTeX — LaTeX editing

(use-package auctex
  :ensure t
  :hook
  ((LaTeX-mode . turn-on-reftex)
   (LaTeX-mode . LaTeX-math-mode)
   (LaTeX-mode . flyspell-mode))
  :config
  (setq TeX-auto-save t
        TeX-parse-self t
        TeX-PDF-mode t
        TeX-source-correlate-mode t
        TeX-source-correlate-start-server t)
  ;; Ask for master file on first open
  (setq-default TeX-master nil))`,
  },

  {
    id: 'ess',
    label: 'ESS (R / Statistics)',
    description: 'Emacs Speaks Statistics — interactive R sessions, script evaluation, and integration with the R help system.',
    details: {
      prose: `ESS (Emacs Speaks Statistics) connects Emacs to R, Julia, Stata, SAS, and other statistical computing environments. It is the standard way to do statistical computing in Emacs.\n\nYou edit a .R script in one window while an inferior R process runs in another. ESS sends the current line (C-RET) or a selected region to R and shows the output immediately. The workflow is interactive: run a block, inspect the result, adjust, repeat — without leaving Emacs.\n\nBeyond R, ESS provides: object completion from the live R session, the R help system browsable inside Emacs, object inspection (C-c C-v on any symbol), and a data frame viewer.\n\nThe ess-style 'RStudio setting here makes ESS follow RStudio's indentation conventions, which most R users will already be comfortable with.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/emacs-ess/ESS', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/ess', kind: 'melpa' },
        { label: 'ESS manual', url: 'https://ess.r-project.org/Manual/ess.html', kind: 'docs' },
      ],
    },
    required: false,
    order: 13,
    group: 'Scientific',
    elisp: `;;; ESS — Emacs Speaks Statistics (R, Julia, Stata…)

(use-package ess
  :ensure t
  :config
  ;; Don't ask for a working directory on startup
  (setq ess-ask-for-ess-directory nil
        ;; Show output immediately without waiting for a prompt
        ess-eval-visibly 'nowait
        ;; Use a sensible style for R code
        ess-style 'RStudio)
  (require 'ess-r-mode))`,
  },

  {
    id: 'olivetti',
    label: 'Olivetti (writing mode)',
    description: 'A distraction-free writing environment: centres the buffer and widens the line spacing for comfortable long-form writing.',
    details: {
      prose: `Olivetti narrows the editing area to a fixed width and centres it in the window. The rest of the frame is left empty. It's the same idea as the focus mode in iA Writer — reduce what's competing for your attention.\n\nThe body width is 88 characters here. That's wide enough that code doesn't feel cramped, but comfortable for prose too. Change olivetti-body-width to whatever suits you.\n\nIt hooks into text-mode and org-mode automatically, so it activates whenever you open an org file or plain text. Toggle it off with C-c o when you need two buffers side by side.\n\nThe name is a reference to the Olivetti typewriter.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/rnkn/olivetti', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/olivetti', kind: 'melpa' },
      ],
    },
    required: false,
    order: 14,
    group: 'Writing',
    elisp: `;;; Olivetti — distraction-free writing mode

(use-package olivetti
  :ensure t
  :config
  (setq olivetti-body-width 88
        olivetti-minimum-body-width 60)
  :hook
  ;; Enable automatically in text and org buffers
  ((text-mode . olivetti-mode)
   (org-mode  . olivetti-mode))
  :bind ("C-c o" . olivetti-mode))`,
  },

  {
    id: 'deft',
    label: 'Deft (note search)',
    description: 'Instant full-text search across your org (and markdown) files — like Notational Velocity for Emacs.',
    details: {
      prose: `Deft is a note search interface inspired by Notational Velocity. Press C-c / and a buffer opens showing all your notes. As you type, the list filters in real time by full-text match across titles and content.\n\nNotes are just files — org, markdown, or plain text — stored in your org directory. Deft indexes them recursively and caches the results so searches after the first are instant. With deft-use-filter-string-for-filename set, if nothing matches your search string, pressing RET creates a new note with that string as its filename.\n\nDeft pairs naturally with org-roam: use org-roam when you want the linked graph, and Deft when you just need to find something fast.\n\nCreated by Jason Blevins, who also created markdown-mode.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/jrblevin/deft', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/deft', kind: 'melpa' },
        { label: 'Deft homepage', url: 'https://jblevins.org/projects/deft/', kind: 'docs' },
      ],
    },
    required: false,
    dependsOn: 'org',
    order: 15,
    group: 'Notes',
    elisp: `;;; Deft — fast note search

(use-package deft
  :ensure t
  :config
  (setq deft-extensions '("org" "md" "txt")
        deft-directory org-directory
        deft-recursive t
        deft-use-filter-string-for-filename t
        deft-default-extension "org")
  :bind ("C-c /" . deft))`,
  },

  {
    id: 'flyspell',
    label: 'Flyspell (spell checking)',
    description: 'On-the-fly spell checking in text and org buffers, with spell-as-you-type highlighting using Aspell or Hunspell.',
    details: {
      prose: `Flyspell is Emacs's built-in on-the-fly spell checker. It underlines misspellings as you type and lets you correct them by right-clicking (or M-$) to see suggestions.\n\nflyspell-mode activates for text and org buffers; flyspell-prog-mode checks only strings and comments in source code — so you get spell checking in your prose and docstrings without false positives on identifiers.\n\nFlyspell delegates the actual checking to an external program: either Aspell or Hunspell (both widely available). This config tries to find whichever is installed. The --sug-mode=ultra flag makes Aspell prioritise speed; --lang=en_GB sets British English. Change to en_US if you prefer.\n\n**System requirement:** Install aspell via brew install aspell (macOS) or sudo apt install aspell (Linux) before this will work.`,
      links: [
        { label: 'Emacs manual: Spelling', url: 'https://www.gnu.org/software/emacs/manual/html_node/emacs/Spelling.html', kind: 'docs' },
        { label: 'Aspell homepage', url: 'http://aspell.net/', kind: 'docs' },
      ],
    },
    required: false,
    order: 16,
    group: 'Writing',
    elisp: `;;; Flyspell — on-the-fly spell checking

;; Requires aspell or hunspell to be installed on your system.
;; On macOS: brew install aspell   On Ubuntu/Debian: apt install aspell

(use-package flyspell
  :ensure nil
  :hook
  ((text-mode . flyspell-mode)
   (org-mode  . flyspell-mode)
   (prog-mode . flyspell-prog-mode))  ; checks comments/strings in code
  :config
  (setq ispell-program-name (or (executable-find "aspell")
                                (executable-find "hunspell")
                                "aspell")
        ispell-extra-args '("--sug-mode=ultra" "--lang=en_GB")))`,
  },

  {
    id: 'markdown',
    label: 'Markdown mode',
    description: 'Syntax highlighting, live preview, and editing commands for Markdown and GitHub-Flavoured Markdown files.',
    details: {
      prose: `markdown-mode provides syntax highlighting, structural navigation, and editing commands for Markdown files. It handles standard Markdown and GitHub-Flavoured Markdown (GFM), which adds task lists, tables, and fenced code blocks.\n\nREADME.md files open in gfm-mode automatically. Other .md files use markdown-mode. Both support: C-c C-p to preview the rendered HTML, heading navigation with outline-minor-mode, link completion, and table editing.\n\nIf pandoc is installed, this config uses it for previews — pandoc handles a wider range of Markdown dialects and can render to HTML, PDF, and other formats. Otherwise it falls back to the system markdown command.\n\nCreated by Jason Blevins, who also created Deft. markdown-mode is one of the oldest and most mature Emacs Markdown packages.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/jrblevin/markdown-mode', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/markdown-mode', kind: 'melpa' },
        { label: 'markdown-mode homepage', url: 'https://jblevins.org/projects/markdown-mode/', kind: 'docs' },
      ],
    },
    required: false,
    order: 17,
    group: 'Writing',
    elisp: `;;; Markdown mode

(use-package markdown-mode
  :ensure t
  :mode
  (("README\\.md\\'" . gfm-mode)   ; GitHub-Flavoured Markdown
   ("\\.md\\'"       . markdown-mode)
   ("\\.markdown\\'" . markdown-mode))
  :config
  ;; Use pandoc for preview if available
  (setq markdown-command (or (executable-find "pandoc") "markdown")
        markdown-fontify-code-blocks-natively t
        markdown-hide-urls t))`,
  },

  {
    id: 'vterm',
    label: 'vterm (terminal)',
    description: 'A fully-featured terminal emulator inside Emacs, backed by libvterm. Runs your shell natively with proper escape code support.',
    details: {
      prose: `vterm uses libvterm — a C library also used by terminal emulators like st and Kitty — to run a full terminal inside Emacs. Unlike the older ansi-term or the shell-mode approach, it renders escape codes correctly and supports full-screen terminal applications: htop, vim, tmux, and anything else that uses curses.\n\nPress C-c t to open a new vterm buffer. Your shell runs exactly as it would in a standalone terminal, with your prompt, history, and completions all working normally. You can copy text to the kill ring, yank from it, and use Emacs commands in copy mode.\n\nThe vterm-kill-buffer-on-exit setting closes the buffer when you exit the shell, keeping your buffer list clean.\n\n**System requirement:** Requires cmake and libvterm installed before the package will compile. On macOS: brew install cmake libvterm. On Linux: sudo apt install cmake libvterm-dev.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/akermu/emacs-libvterm', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/vterm', kind: 'melpa' },
      ],
    },
    required: false,
    order: 18,
    group: 'System',
    elisp: `;;; vterm — full terminal emulator

;; Requires libvterm and cmake: brew install libvterm cmake  /  apt install libvterm-dev cmake

(use-package vterm
  :ensure t
  :config
  (setq vterm-max-scrollback 10000
        vterm-kill-buffer-on-exit t)
  :bind ("C-c t" . vterm))`,
  },

  {
    id: 'tramp',
    label: 'TRAMP (remote editing)',
    description: 'Edit files on remote servers over SSH as if they were local. Works transparently with Dired, Magit, and most Emacs commands.',
    details: {
      prose: `TRAMP (Transparent Remote Access, Multiple Protocol) lets you edit files on remote machines as if they were local. Open any file with a /ssh:user@host:/path/to/file path and TRAMP handles the SSH connection, authentication, and file transfer transparently — no special commands needed, it just works in find-file.\n\nTRAMP integrates with the rest of Emacs: Dired browses remote directories, Magit runs git on the remote server, shell-command executes commands remotely. The experience is nearly identical to working locally.\n\nBeyond SSH, TRAMP supports sudo (open /sudo::/etc/hosts to edit as root), Docker containers (/docker:container_name:/path), and several other connection methods.\n\nThe configuration here sets SSH as the default method, caches credentials for the session to avoid repeated password prompts, and stores auto-saves locally to avoid slow remote writes.`,
      links: [
        { label: 'TRAMP manual', url: 'https://www.gnu.org/software/tramp/', kind: 'docs' },
        { label: 'Emacs TRAMP FAQ', url: 'https://www.gnu.org/software/emacs/manual/html_node/tramp/index.html', kind: 'docs' },
        { label: 'Open Org Attachments in File Explorer', url: 'https://timothyjohnsonsci.com/writing/2025-12-13-orgattach/', kind: 'blog' },
      ],
    },
    required: false,
    order: 19,
    group: 'System',
    elisp: `;;; TRAMP — Transparent Remote Access, Multiple Protocol (built-in)

(use-package tramp
  :ensure nil
  :config
  (setq tramp-default-method "ssh"
        ;; Cache credentials for the session
        password-cache-expiry nil
        ;; Store auto-saves locally to avoid slow remote writes
        tramp-auto-save-directory (expand-file-name "tramp-autosave" user-emacs-directory))
  ;; Speed up connections by using remote PATH directly
  (add-to-list 'tramp-remote-path 'tramp-own-remote-path))`,
  },

  {
    id: 'org-drill',
    label: 'Org-drill (flashcards)',
    description: 'Spaced-repetition flashcards built on top of Org-mode. Turn any org heading into a card and drill through them with SM-5 scheduling.',
    details: {
      prose: `Org-drill implements spaced-repetition flashcards inside org files. Any org heading can become a card by adding a :drill: tag. The SM-5 algorithm (a variant of SuperMemo) schedules each card to appear just before you are likely to forget it — maximising retention for a given amount of review time.\n\nCards can have simple question/answer structure, cloze deletions (fill in the blank), two-sided cards, or custom formats. A drill session shows you cards in scheduled order, you rate your recall (0–5), and org-drill records the result and reschedules accordingly.\n\nUseful for: vocabulary in a foreign language, mathematical formulas, musical chords, code syntax, or any factual knowledge you want to retain long-term. Because cards live in org files, they can contain links, images, code blocks, and anything else org supports.\n\nSessions are limited to 30 items and 20 minutes by default — adjust to suit your study habits.`,
      links: [
        { label: 'GitLab', url: 'https://gitlab.com/phillord/org-drill', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/org-drill', kind: 'melpa' },
        { label: 'Org-drill manual', url: 'https://orgmode.org/worg/org-contrib/org-drill.html', kind: 'docs' },
        { label: 'Refactoring my Emacs config with Claude Code', url: 'https://timothyjohnsonsci.com/writing/2026-01-01-refactoring-emacs-config-with-claude-code/', kind: 'blog' },
      ],
    },
    required: false,
    dependsOn: 'org',
    order: 20,
    group: 'Org-mode',
    elisp: `;;; Org-drill — spaced repetition / flashcards

(use-package org-drill
  :ensure t
  :after org
  :config
  (setq org-drill-maximum-items-per-session 30
        org-drill-maximum-duration 20          ; minutes
        org-drill-spaced-repetition-algorithm 'sm5
        org-drill-learn-fraction 0.25))`,
  },

  {
    id: 'denote',
    label: 'Denote (note-taking)',
    description: 'A simple, file-based note-taking system by Prot. Notes are plain files named by date, title, and keywords — no database, no lock-in.',
    details: {
      prose: `Denote is Protesilaos Stavrou's take on plain-file note-taking. The entire system is a naming convention: files are named by an ISO timestamp, a human-readable title slug, and keywords — for example, 20240301T143022--emacs-configuration__emacs_tools.org.\n\nThe naming scheme is machine-readable enough to query with grep or find and human-readable enough to browse in any file manager. There is no database and no lock-in: your notes are just files that work without Denote installed.\n\nDenote creates links between notes using a custom link type that resolves by the timestamp identifier, so links survive renames. It also supports forward links, backlinks, and a dynamic list of all notes matching a keyword.\n\nNotes can be in Org, Markdown, or plain text — you can mix formats in the same directory. A lighter and more principled alternative to org-roam for those who prefer simplicity over graph features.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/protesilaos/denote', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/denote', kind: 'melpa' },
        { label: 'Denote manual', url: 'https://protesilaos.com/emacs/denote', kind: 'docs' },
        { label: 'Plain Text Should Be the Default', url: 'https://timothyjohnsonsci.com/writing/2026-01-12-plain-text-ai/', kind: 'blog' },
        { label: 'Denote for catch-ups', url: 'https://timothyjohnsonsci.com/writing/2025-02-13_catchups/', kind: 'blog' },
        { label: 'Introducing org-recruit', url: 'https://timothyjohnsonsci.com/writing/2025-02-12_orgrecruit/', kind: 'blog' },
      ],
    },
    required: false,
    order: 22,
    group: 'Notes',
    elisp: `;;; Denote — file-based note-taking

(use-package denote
  :ensure t
  :config
  (setq denote-directory (expand-file-name "~/notes")
        denote-known-keywords '("emacs" "work" "personal")
        denote-infer-keywords t
        denote-sort-keywords t
        denote-prompts '(title keywords))
  :bind
  (("C-c d d" . denote)
   ("C-c d f" . denote-find-file)
   ("C-c d g" . denote-grep)
   ("C-c d o" . denote-open-or-create)))`,
  },

  {
    id: 'pdf-tools',
    label: 'PDF Tools',
    description: 'Annotate, search, and navigate PDFs natively in Emacs. Replaces DocView with a faster, feature-rich viewer backed by poppler.',
    details: {
      prose: `PDF Tools replaces Emacs's built-in DocView with a native PDF viewer backed by the poppler library. Instead of rasterising pages to PNG files, it renders them directly — giving you fast scrolling and sharp text at any zoom level, even on high-DPI displays.\n\nBeyond viewing, PDF Tools supports: text search (C-s), annotation (highlights, notes, stamps, and underlines stored as PDF annotations), outline navigation, link following, and fit-page / fit-width display modes.\n\nThe AUCTeX integration is particularly valuable for academic work: with SyncTeX, C-c C-v in your LaTeX source opens the PDF at the corresponding position, and clicking in PDF Tools jumps back to the source line.\n\n**System requirement:** Requires the poppler library. On macOS: brew install poppler. On Linux: sudo apt install libpoppler-glib-dev.`,
      links: [
        { label: 'GitHub', url: 'https://github.com/vedang/pdf-tools', kind: 'github' },
        { label: 'MELPA', url: 'https://melpa.org/#/pdf-tools', kind: 'melpa' },
      ],
    },
    required: false,
    order: 21,
    group: 'Scientific',
    elisp: `;;; PDF Tools — native PDF viewer

;; Requires poppler: brew install poppler  /  apt install libpoppler-glib-dev

(use-package pdf-tools
  :ensure t
  :config
  (pdf-tools-install)
  (setq-default pdf-view-display-size 'fit-page)
  (setq pdf-view-resize-factor 1.1)
  (setq pdf-annot-activate-created-annotations t)
  :mode ("\\.pdf\\'" . pdf-view-mode)
  :bind (:map pdf-view-mode-map
         ("C-s" . isearch-forward)))`,
  },

  {
    id: 'doc-view',
    label: 'DocView',
    description: 'Built-in Emacs viewer for PDF, PostScript, and DVI files. No external package required — works with Ghostscript or MuPDF.',
    details: {
      prose: `DocView is Emacs's built-in viewer for PDF, PostScript, and DVI files. It rasterises document pages to PNG images using Ghostscript and displays them in an Emacs buffer — no external packages needed, just a Ghostscript installation.\n\nIt is slower and less featureful than PDF Tools (no annotations, lower fidelity at high zoom) but has the advantage of requiring no compilation. If you just need to occasionally view a PDF without the overhead of setting up PDF Tools, DocView is a good default.\n\nThe j/k key bindings added here make page navigation feel more natural (like most document viewers). doc-view-continuous t means scrolling past the bottom of a page automatically advances to the next.\n\n**System requirement:** Ghostscript must be installed. On macOS: brew install ghostscript. On Linux: sudo apt install ghostscript.`,
      links: [
        { label: 'Emacs manual: DocView', url: 'https://www.gnu.org/software/emacs/manual/html_node/emacs/Document-View.html', kind: 'docs' },
        { label: 'Ghostscript', url: 'https://www.ghostscript.com/', kind: 'docs' },
      ],
    },
    required: false,
    order: 26,
    group: 'System',
    elisp: `;;; DocView — built-in document viewer

;; Requires ghostscript: brew install ghostscript  /  apt install ghostscript

(use-package doc-view
  :ensure nil
  :config
  (setq doc-view-continuous t
        doc-view-resolution 200)
  :bind (:map doc-view-mode-map
         ("j" . doc-view-next-page)
         ("k" . doc-view-previous-page)))`,
  },

  {
    id: 'org-babel-python',
    label: 'Org Babel — Python',
    description: 'Execute Python code blocks inside org files. Results are written inline — turning org documents into interactive notebooks.',
    details: {
      prose: `Org Babel lets you write executable code blocks inside org files and capture their output inline. With Python enabled, org documents become interactive notebooks: write #+begin_src python ... #+end_src, press C-c C-c, and the result appears in a #+RESULTS: block immediately below.\n\nUnlike Jupyter notebooks, which store output in a JSON format that clutters diffs, org files with Babel are plain text: easy to version-control, read without special tooling, and compose with the rest of your org workflow (tasks, notes, links).\n\nOrg Babel also supports R, shell, JavaScript, SQL, and many other languages — add them to org-babel-load-languages as needed. The session keyword keeps a Python process alive between blocks, so variables defined in one block are available in the next.\n\nThe org-confirm-babel-evaluate nil setting here skips the "do you want to execute this code?" confirmation prompt — remove it if you open org files from untrusted sources.`,
      links: [
        { label: 'Org Babel manual', url: 'https://orgmode.org/manual/Working-with-Source-Code.html', kind: 'docs' },
        { label: 'Babel intro (Worg)', url: 'https://orgmode.org/worg/org-contrib/babel/intro.html', kind: 'blog' },
      ],
    },
    required: false,
    dependsOn: 'org',
    order: 23,
    group: 'Org-mode',
    elisp: `;;; Org Babel — Python execution

(use-package org
  :ensure nil
  :config
  (org-babel-do-load-languages
   'org-babel-load-languages
   '((python . t)
     (emacs-lisp . t)))

  ;; Use python3 explicitly
  (setq org-babel-python-command "python3")

  ;; Skip the "do you want to execute this?" prompt for trusted files.
  ;; Remove this line if you open org files from untrusted sources.
  (setq org-confirm-babel-evaluate nil))`,
  },
]
