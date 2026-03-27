interface Persona {
  id: string
  label: string
  tagline: string
  description: string
  moduleIds: string[]
}

const PERSONAS: Persona[] = [
  {
    id: 'scientist',
    label: 'Scientist',
    tagline: 'Lab notebooks, R, and academic writing',
    description:
      'An org-based research workflow with quick capture for notes and experiments, ESS for interactive R sessions, AUCTeX for writing papers, and Magit for versioning analysis scripts.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'theme', 'which-key', 'completion', 'ess', 'auctex', 'magit'],
  },
  {
    id: 'knowledge-worker',
    label: 'Knowledge Worker',
    tagline: 'Notes, tasks, and deep thinking',
    description:
      'A full knowledge management stack: org-mode for tasks and agenda, org-roam for linked Zettelkasten notes, Deft for instant note search, and Olivetti for distraction-free writing.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'org-roam', 'deft', 'theme', 'which-key', 'completion', 'olivetti'],
  },
  {
    id: 'academic',
    label: 'Academic',
    tagline: 'Research notes, papers, and bibliography',
    description:
      'Bridges research and writing: org-roam for networked literature notes, AUCTeX for authoring papers, Deft for fast retrieval, and Magit for version-controlling manuscripts.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'org-roam', 'deft', 'theme', 'which-key', 'completion', 'auctex', 'magit'],
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
      'An academic study stack: org-roam for linked course notes, Org-drill for spaced-repetition flashcards, Deft for searching across subjects, and capture templates for quick note-taking.',
    moduleIds: ['org', 'org-capture', 'org-babel-python', 'org-roam', 'org-drill', 'deft', 'theme', 'which-key', 'completion'],
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

interface Props {
  onApply: (ids: string[]) => void
  compact?: boolean
}

export default function PersonaBuilds({ onApply, compact = false }: Props) {
  if (compact) {
    return (
      <div style={styles.compactRoot}>
        <span style={styles.compactLabel}>Switch persona:</span>
        <div style={styles.compactBtns}>
          {PERSONAS.map((p) => (
            <button key={p.id} style={styles.compactBtn} onClick={() => onApply(p.moduleIds)}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={styles.root}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Choose your starting point</h2>
        <p style={styles.subheading}>
          Pick a persona to pre-select the right modules, then customise below.
        </p>
      </div>
      <div style={styles.cards}>
        {PERSONAS.map((persona) => (
          <div key={persona.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.cardLabel}>{persona.label}</div>
                <div style={styles.cardTagline}>{persona.tagline}</div>
              </div>
              <button style={styles.applyBtn} onClick={() => onApply(persona.moduleIds)}>
                Start here →
              </button>
            </div>
            <p style={styles.cardDesc}>{persona.description}</p>
            <div style={styles.pills}>
              {persona.moduleIds.map((id) => (
                <span key={id} style={styles.pill}>{id}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    width: '100%',
    maxWidth: 760,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  heading: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '-0.3px',
  },
  subheading: {
    fontSize: 13,
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
  cards: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 14,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '18px 20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
    transition: 'border-color 0.15s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardLabel: {
    fontWeight: 700,
    fontSize: 15,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    marginBottom: 2,
  },
  cardTagline: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.02em',
  },
  applyBtn: {
    flexShrink: 0,
    background: 'rgba(201,168,76,0.12)',
    color: 'var(--accent)',
    border: '1px solid rgba(201,168,76,0.35)',
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 14px',
    borderRadius: 'var(--radius)',
    whiteSpace: 'nowrap' as const,
  },
  cardDesc: {
    fontSize: 13,
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-dim)',
    lineHeight: 1.7,
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 5,
  },
  pill: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 3,
    padding: '2px 6px',
  },
  // Compact (sidebar) variant
  compactRoot: {
    padding: '8px 12px 10px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    flexShrink: 0,
  },
  compactLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)',
  },
  compactBtns: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap' as const,
  },
  compactBtn: {
    background: 'var(--surface-raised)',
    color: 'var(--text-dim)',
    border: '1px solid var(--border)',
    fontSize: 11,
    padding: '3px 10px',
    borderRadius: 4,
  },
}
