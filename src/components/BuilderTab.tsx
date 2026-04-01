import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { modules } from '../modules'
import { generateInitEl, generateOrgFile } from '../lib/generator'
import type { CustomBlock } from '../lib/generator'
import type { SavedConfig } from '../lib/supabase'
import ModuleCard from './ModuleCard'
import CodePreview from './CodePreview'
import SavedConfigs from './SavedConfigs'
import PersonaBuilds from './PersonaBuilds'

interface Props {
  selectedIds: Set<string>
  enabledIds: Set<string>
  activePersonaIds: Set<string>
  builderStarted: boolean
  customBlocks: CustomBlock[]
  onToggle: (id: string) => void
  onTogglePersona: (personaId: string, moduleIds: string[]) => void
  onStart: () => void
  onToggleCustomBlock: (id: string) => void
  onRemoveCustomBlock: (id: string) => void
  user: User | null
  configs: SavedConfig[]
  configsLoading: boolean
  saving: boolean
  configsError: string | null
  onSave: (name: string) => Promise<boolean>
  onLoadConfig: (cfg: SavedConfig) => void
  onDeleteConfig: (id: string) => void
}

const GROUP_ORDER = [
  'Core',
  'Appearance & UI',
  'Completion',
  'Org-mode',
  'Notes',
  'Development',
  'Writing',
  'Scientific',
  'System',
]

export default function BuilderTab({
  selectedIds,
  enabledIds,
  activePersonaIds,
  builderStarted,
  customBlocks,
  onToggle,
  onTogglePersona,
  onStart,
  onToggleCustomBlock,
  onRemoveCustomBlock,
  user,
  configs,
  configsLoading,
  saving,
  configsError,
  onSave,
  onLoadConfig,
  onDeleteConfig,
}: Props) {
  const [mobilePanel, setMobilePanel] = useState<'modules' | 'preview'>('modules')
  const [isMobile] = useState(() => window.matchMedia('(max-width: 640px)').matches)
  const enabledCustomBlocks = customBlocks.filter((b) => b.enabled)
  const orgCode = generateOrgFile(enabledIds, modules, enabledCustomBlocks)
  const initElCode = generateInitEl(enabledIds, modules, enabledCustomBlocks)
  const totalCount = modules.length + customBlocks.length
  const enabledCount = enabledIds.size + enabledCustomBlocks.length

  // Show persona picker until the user explicitly continues or has a loaded config
  if (!builderStarted) {
    return (
      <div className="persona-picker-root" style={styles.pickerRoot}>
        <PersonaBuilds
          onApply={(personaId, moduleIds) => {
            onTogglePersona(personaId, moduleIds)
            onStart()
          }}
        />
        <p style={styles.pickerOr}>
          or{' '}
          <button style={styles.pickerSkip} onClick={onStart}>
            browse all modules manually ↓
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="builder-layout">
      {/* Mobile-only panel switcher */}
      {isMobile && (
        <div className="mobile-panel-bar">
          <button
            className={mobilePanel === 'modules' ? 'active' : ''}
            onClick={() => setMobilePanel('modules')}
          >
            Modules
          </button>
          <button
            className={mobilePanel === 'preview' ? 'active' : ''}
            onClick={() => setMobilePanel('preview')}
          >
            Preview
          </button>
        </div>
      )}

      {/* Left: module list */}
      <div className={`builder-sidebar${isMobile && mobilePanel === 'preview' ? ' hidden' : ''}`}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarTitle}>Modules</span>
          <span style={styles.count}>
            {enabledCount} / {totalCount} enabled
          </span>
        </div>
        <PersonaBuilds
          activePersonaIds={activePersonaIds}
          onToggle={onTogglePersona}
          compact
        />
        <div style={styles.moduleList}>
          {GROUP_ORDER.map((group) => {
            const groupModules = modules.filter((m) => m.group === group)
            if (groupModules.length === 0) return null
            return (
              <div key={group}>
                <div style={styles.groupHeader}>{group}</div>
                {groupModules.map((mod) => (
                  <ModuleCard
                    key={mod.id}
                    moduleId={mod.id}
                    enabled={enabledIds.has(mod.id)}
                    autoDep={
                      !mod.required && !selectedIds.has(mod.id) && enabledIds.has(mod.id)
                    }
                    onToggle={onToggle}
                  />
                ))}
              </div>
            )
          })}

          {customBlocks.length > 0 && (
            <>
              <div style={styles.customHeader}>AI-generated</div>
              {customBlocks.map((block) => (
                <div key={block.id} style={{ ...styles.customCard, ...(block.enabled ? styles.customCardEnabled : {}) }}>
                  <div style={styles.customCardTop}>
                    <span style={styles.customLabel}>{block.label}</span>
                    <div style={styles.customCardActions}>
                      <label style={styles.toggle} aria-label={`Toggle ${block.label}`}>
                        <input
                          type="checkbox"
                          checked={block.enabled}
                          onChange={() => onToggleCustomBlock(block.id)}
                          style={{ display: 'none' }}
                        />
                        <span style={{ ...styles.toggleTrack, ...(block.enabled ? styles.toggleTrackOn : {}) }}>
                          <span style={{ ...styles.toggleThumb, ...(block.enabled ? styles.toggleThumbOn : {}) }} />
                        </span>
                      </label>
                      <button
                        style={styles.removeBtn}
                        onClick={() => onRemoveCustomBlock(block.id)}
                        title="Remove block"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <pre style={styles.customPreview}>{block.elisp.slice(0, 120)}{block.elisp.length > 120 ? '…' : ''}</pre>
                </div>
              ))}
            </>
          )}
        </div>

        <SavedConfigs
          user={user}
          configs={configs}
          loading={configsLoading}
          saving={saving}
          error={configsError}
          onSave={onSave}
          onLoad={onLoadConfig}
          onDelete={onDeleteConfig}
        />
      </div>

      {/* Right: code preview */}
      <div className={`builder-preview${isMobile && mobilePanel === 'modules' ? ' hidden' : ''}`}>
        <CodePreview orgCode={orgCode} initElCode={initElCode} />
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  pickerRoot: {
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  pickerOr: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  pickerSkip: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: 'var(--accent)',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(201,168,76,0.4)',
  },
  sidebarHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  sidebarTitle: {
    fontWeight: 600,
    fontSize: 13,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  count: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  moduleList: {
    flex: 1,
    overflow: 'auto',
    padding: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  groupHeader: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--accent)',
    padding: '10px 2px 4px',
    marginTop: 4,
  },
  customHeader: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    padding: '8px 2px 4px',
  },
  customCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '10px 12px',
    transition: 'border-color 0.15s',
  },
  customCardEnabled: {
    borderColor: 'var(--accent-dim)',
  },
  customCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  customLabel: {
    fontWeight: 600,
    fontSize: 13,
    color: 'var(--text)',
  },
  customCardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
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
  removeBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: 11,
    padding: '2px 6px',
    borderRadius: 4,
    border: '1px solid var(--border)',
  },
  customPreview: {
    margin: 0,
    fontSize: 10,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
  },
}
