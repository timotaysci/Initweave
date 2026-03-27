import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { SavedConfig } from '../lib/supabase'

interface Props {
  user: User | null
  configs: SavedConfig[]
  loading: boolean
  saving: boolean
  error: string | null
  onSave: (name: string) => Promise<boolean>
  onLoad: (config: SavedConfig) => void
  onDelete: (id: string) => void
}

export default function SavedConfigs({
  user,
  configs,
  loading,
  saving,
  error,
  onSave,
  onLoad,
  onDelete,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const [saveName, setSaveName] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function handleSave() {
    const name = saveName.trim() || 'My config'
    const ok = await onSave(name)
    if (ok) {
      setSaveName('')
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    }
  }

  if (!user) {
    return (
      <div style={styles.upsell}>
        <span style={styles.upsellText}>Sign in (top right) to save configs</span>
      </div>
    )
  }

  return (
    <div style={styles.root}>
      <button style={styles.toggle} onClick={() => setExpanded((e) => !e)}>
        <span style={styles.toggleLabel}>Saved configs</span>
        <span style={styles.toggleCount}>{configs.length}</span>
        <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div style={styles.panel}>
          {error && (
            <div style={styles.errorBanner}>
              <span>{error}</span>
            </div>
          )}

          <div style={styles.saveRow}>
            <input
              style={styles.nameInput}
              placeholder="Config name…"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <button
              style={{ ...styles.saveBtn, ...(saveSuccess ? styles.saveBtnDone : {}) }}
              onClick={handleSave}
              disabled={saving}
            >
              {saveSuccess ? 'Saved ✓' : saving ? '…' : 'Save'}
            </button>
          </div>

          {loading ? (
            <div style={styles.empty}>Loading…</div>
          ) : configs.length === 0 && !error ? (
            <div style={styles.empty}>No saved configs yet</div>
          ) : (
            <div style={styles.list}>
              {configs.map((cfg) => (
                <div key={cfg.id} style={styles.configRow}>
                  <button style={styles.configName} onClick={() => onLoad(cfg)}>
                    {cfg.name}
                  </button>
                  <span style={styles.configMeta}>
                    {cfg.selected_module_ids.length} modules
                  </span>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => onDelete(cfg.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    width: '100%',
    background: 'transparent',
    border: 'none',
    padding: '10px 16px',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    textAlign: 'left',
  },
  toggleLabel: {
    flex: 1,
  },
  toggleCount: {
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0 6px',
    fontSize: 10,
  },
  chevron: {
    fontSize: 9,
  },
  panel: {
    borderTop: '1px solid var(--border)',
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  errorBanner: {
    background: 'rgba(224,112,112,0.1)',
    border: '1px solid rgba(224,112,112,0.3)',
    borderRadius: 'var(--radius)',
    padding: '7px 10px',
    fontSize: 11,
    color: 'var(--danger)',
    fontFamily: 'var(--font-mono)',
    lineHeight: 1.5,
  },
  saveRow: {
    display: 'flex',
    gap: 6,
  },
  nameInput: {
    flex: 1,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '5px 10px',
    fontSize: 12,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    outline: 'none',
  },
  saveBtn: {
    background: 'var(--surface-raised)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    flexShrink: 0,
  },
  saveBtnDone: {
    background: 'rgba(106,191,105,0.15)',
    color: 'var(--success)',
    borderColor: 'rgba(106,191,105,0.3)',
  },
  empty: {
    fontSize: 11,
    color: 'var(--text-muted)',
    padding: '4px 2px',
    fontStyle: 'italic',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  configRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '6px 10px',
  },
  configName: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: 'var(--text)',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
  },
  configMeta: {
    fontSize: 10,
    color: 'var(--text-muted)',
    flexShrink: 0,
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 10,
    padding: '2px 4px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  upsell: {
    borderTop: '1px solid var(--border)',
    padding: '10px 16px',
    flexShrink: 0,
  },
  upsellText: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
}
