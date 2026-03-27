import { modules } from '../modules'

interface Props {
  moduleId: string
  enabled: boolean
  autoDep: boolean
  onToggle: (id: string) => void
}

export default function ModuleCard({ moduleId, enabled, autoDep, onToggle }: Props) {
  const mod = modules.find((m) => m.id === moduleId)!
  const parentLabel = mod.dependsOn
    ? modules.find((m) => m.id === mod.dependsOn)?.label
    : undefined

  return (
    <div style={{ ...styles.card, ...(enabled ? styles.cardEnabled : {}) }}>
      <div style={styles.top}>
        <div style={styles.titleRow}>
          <span style={styles.label}>{mod.label}</span>
          <div style={styles.badges}>
            {mod.required && <span style={styles.badgeRequired}>required</span>}
            {autoDep && <span style={styles.badgeAuto}>auto-enabled</span>}
            {parentLabel && !mod.required && (
              <span style={styles.badgeDep}>requires: {parentLabel}</span>
            )}
          </div>
        </div>
        <label style={styles.toggle} aria-label={`Toggle ${mod.label}`}>
          <input
            type="checkbox"
            checked={enabled}
            disabled={mod.required}
            onChange={() => onToggle(mod.id)}
            style={{ display: 'none' }}
          />
          <span style={{ ...styles.toggleTrack, ...(enabled ? styles.toggleTrackOn : {}) }}>
            <span style={{ ...styles.toggleThumb, ...(enabled ? styles.toggleThumbOn : {}) }} />
          </span>
        </label>
      </div>
      <p style={styles.description}>{mod.description}</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    transition: 'border-color 0.15s',
  },
  cardEnabled: {
    borderColor: 'var(--accent-dim)',
  },
  top: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontWeight: 600,
    fontSize: 13,
    color: 'var(--text)',
  },
  badges: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 4,
  },
  badgeRequired: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    background: 'rgba(201,168,76,0.15)',
    color: 'var(--accent)',
    padding: '1px 6px',
    borderRadius: 4,
    border: '1px solid rgba(201,168,76,0.3)',
  },
  badgeAuto: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    background: 'rgba(106,191,105,0.12)',
    color: 'var(--success)',
    padding: '1px 6px',
    borderRadius: 4,
    border: '1px solid rgba(106,191,105,0.25)',
  },
  badgeDep: {
    fontSize: 10,
    color: 'var(--text-muted)',
    padding: '1px 6px',
    borderRadius: 4,
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
  },
  description: {
    fontSize: 12,
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.5,
  },
  toggle: {
    cursor: 'pointer',
    flexShrink: 0,
  },
  toggleTrack: {
    display: 'block',
    width: 36,
    height: 20,
    borderRadius: 10,
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    position: 'relative' as const,
    transition: 'background 0.2s, border-color 0.2s',
  },
  toggleTrackOn: {
    background: 'rgba(201,168,76,0.25)',
    borderColor: 'var(--accent-dim)',
  },
  toggleThumb: {
    display: 'block',
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: 'var(--text-muted)',
    position: 'absolute' as const,
    top: 2,
    left: 2,
    transition: 'transform 0.2s, background 0.2s',
  },
  toggleThumbOn: {
    transform: 'translateX(16px)',
    background: 'var(--accent)',
  },
}
