import { useEffect } from 'react'
import type { Module } from '../modules'

interface Props {
  mod: Module
  onClose: () => void
}

const kindColors: Record<string, { bg: string; color: string; border: string }> = {
  melpa: {
    bg: 'rgba(106, 153, 191, 0.12)',
    color: '#6a99bf',
    border: 'rgba(106, 153, 191, 0.3)',
  },
  github: {
    bg: 'rgba(160, 160, 160, 0.1)',
    color: '#b0b0b0',
    border: 'rgba(160, 160, 160, 0.25)',
  },
  blog: {
    bg: 'rgba(106, 191, 105, 0.1)',
    color: 'var(--success)',
    border: 'rgba(106, 191, 105, 0.25)',
  },
  docs: {
    bg: 'rgba(180, 140, 220, 0.1)',
    color: '#b48cdc',
    border: 'rgba(180, 140, 220, 0.25)',
  },
}

export default function ModuleInfoModal({ mod, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Render prose: blank lines become paragraph breaks; **text** becomes bold
  const renderProse = (text: string) => {
    return text.split('\n\n').map((para, i) => {
      const parts = para.split(/(\*\*[^*]+\*\*)/)
      return (
        <p key={i} style={styles.para}>
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={j}>{part.slice(2, -2)}</strong>
            }
            return part
          })}
        </p>
      )
    })
  }

  return (
    <div style={styles.backdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div
        style={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.header}>
          <div>
            <div style={styles.group}>{mod.group}</div>
            <h2 style={styles.title}>{mod.label}</h2>
          </div>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div style={styles.body}>
          {renderProse(mod.details.prose)}
        </div>

        {mod.details.links.length > 0 && (
          <div style={styles.links}>
            {mod.details.links.map((link) => {
              const c = kindColors[link.kind]
              return (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.linkChip, background: c.bg, color: c.color, borderColor: c.border }}
                >
                  <span style={styles.linkKind}>{link.kind}</span>
                  {link.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.72)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    backdropFilter: 'blur(2px)',
  },
  panel: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    width: '100%',
    maxWidth: 560,
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    padding: '20px 20px 16px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  group: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 14,
    cursor: 'pointer',
    padding: '2px 6px',
    borderRadius: 4,
    flexShrink: 0,
    lineHeight: 1,
  },
  body: {
    padding: '18px 20px',
    overflowY: 'auto',
    flex: 1,
  },
  para: {
    fontFamily: 'var(--font-serif)',
    fontSize: 14,
    lineHeight: 1.7,
    color: 'var(--text-dim)',
    marginBottom: 14,
  },
  links: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    padding: '14px 20px 18px',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  linkChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '4px 10px',
    borderRadius: 5,
    border: '1px solid',
    fontSize: 12,
    textDecoration: 'none',
    fontFamily: 'var(--font-mono)',
    transition: 'opacity 0.15s',
  },
  linkKind: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    opacity: 0.65,
  },
}
