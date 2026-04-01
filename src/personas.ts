export interface Persona {
  id: string
  label: string
  tagline: string
  description: string
  moduleIds: string[]
}

export const PERSONAS: Persona[] = [
  {
    id: 'scientist',
    label: 'Scientist',
    tagline: 'Lab notebooks, R, and academic writing',
    description:
      'An org-based research workflow with quick capture for notes and experiments, ESS for interactive R sessions, AUCTeX for writing papers, PDF Tools for reading literature, and Magit for versioning analysis scripts.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'theme', 'which-key', 'completion', 'ess', 'auctex', 'pdf-tools', 'magit'],
  },
  {
    id: 'knowledge-worker',
    label: 'Knowledge Worker',
    tagline: 'Notes, tasks, and deep thinking',
    description:
      'A full knowledge management stack: org-mode for tasks and agenda, org-roam for linked Zettelkasten notes, Deft for instant note search, DocView for reading reference documents, and Olivetti for distraction-free writing.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'org-roam', 'deft', 'theme', 'which-key', 'completion', 'olivetti', 'doc-view'],
  },
  {
    id: 'academic',
    label: 'Academic',
    tagline: 'Research notes, papers, and bibliography',
    description:
      'Bridges research and writing: org-roam for networked literature notes, AUCTeX for authoring papers, PDF Tools for annotating papers, Deft for fast retrieval, and Magit for version-controlling manuscripts.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'org-roam', 'deft', 'theme', 'which-key', 'completion', 'auctex', 'pdf-tools', 'magit'],
  },
  {
    id: 'writer',
    label: 'Writer',
    tagline: 'Prose, Markdown, and distraction-free focus',
    description:
      'A clean environment for long-form writing: Olivetti centres the buffer, Flyspell catches errors as you type, Markdown mode for drafts, and Org for structure and capture.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'theme', 'which-key', 'completion', 'olivetti', 'markdown', 'flyspell'],
  },
  {
    id: 'devops',
    label: 'DevOps',
    tagline: 'Terminal, remote editing, and Git',
    description:
      'Built for infrastructure work: vterm for a full in-editor terminal, TRAMP for editing files on remote servers over SSH, Magit for Git, and Projectile for navigating multiple repos.',
    moduleIds: ['theme', 'which-key', 'completion', 'magit', 'projectile', 'vterm', 'tramp'],
  },
  {
    id: 'student',
    label: 'Student',
    tagline: 'Notes, flashcards, and spaced repetition',
    description:
      'An academic study stack: org-roam for linked course notes, Org-drill for spaced-repetition flashcards, PDF Tools for reading course materials, Deft for searching across subjects, and capture templates for quick note-taking.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'org-roam', 'org-drill', 'deft', 'theme', 'which-key', 'completion', 'pdf-tools'],
  },
  {
    id: 'developer',
    label: 'Developer',
    tagline: 'Code, Git, and language intelligence',
    description:
      'A focused programming environment with smart in-buffer completion, a language server for go-to-definition and hover docs, Magit for Git, and Projectile for navigating between projects.',
    moduleIds: ['theme', 'which-key', 'completion', 'corfu', 'eglot', 'magit', 'projectile'],
  },
]
