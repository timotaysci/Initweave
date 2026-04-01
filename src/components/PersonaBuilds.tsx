import { PERSONAS } from '../personas'

interface Props {
  // Full picker (single-select): clicking a card immediately applies and proceeds
  onApply?: (personaId: string, moduleIds: string[]) => void
  // Compact sidebar (multi-select): toggle personas on/off
  activePersonaIds?: Set<string>
  onToggle?: (personaId: string, moduleIds: string[]) => void
  compact?: boolean
}

export default function PersonaBuilds({ onApply, activePersonaIds, onToggle, compact = false }: Props) {
  if (compact) {
    return (
      <div style={styles.compactRoot}>
        <span style={styles.compactLabel}>Personas:</span>
        <div style={styles.compactBtns}>
          {PERSONAS.map((p) => {
            const isActive = activePersonaIds?.has(p.id) ?? false
            return (
              <button
                key={p.id}
                style={{ ...styles.compactBtn, ...(isActive ? styles.compactBtnActive : {}) }}
                onClick={() => onToggle?.(p.id, p.moduleIds)}
                title={isActive ? `Remove ${p.label} modules` : `Add ${p.label} modules`}
              >
                {p.label}
              </button>
            )
          })}
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
              <button
                style={styles.applyBtn}
                onClick={() => onApply?.(persona.id, persona.moduleIds)}
              >
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
    transition: 'all 0.15s',
  },
  compactBtnActive: {
    background: 'rgba(201,168,76,0.12)',
    color: 'var(--accent)',
    border: '1px solid rgba(201,168,76,0.35)',
  },
}
