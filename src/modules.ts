export interface Module {
  id: string
  label: string
  description: string
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
