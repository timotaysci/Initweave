import { useState } from 'react'
import { modules } from '../modules'
import { PERSONAS } from '../personas'
import { resolveEnabled } from '../lib/generator'
import type { CustomBlock } from '../lib/generator'
import { useAuth } from '../lib/useAuth'
import { useConfigs } from '../lib/useConfigs'
import { supabaseConfigured } from '../lib/supabase'
import type { SavedConfig } from '../lib/supabase'
import BuilderTab from './BuilderTab'
import ComingSoonTab from './ComingSoonTab'
import AboutTab from './AboutTab'
import PrivacyTab from './PrivacyTab'
import GdprBanner from './GdprBanner'
import AuthButton from './AuthButton'

type Tab = 'build' | 'coming-soon' | 'about' | 'privacy'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('build')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activePersonaIds, setActivePersonaIds] = useState<Set<string>>(new Set())
  const [builderStarted, setBuilderStarted] = useState(false)
  const [customBlocks, setCustomBlocks] = useState<CustomBlock[]>([])

  const { user, loading: authLoading, signInWithEmail, signOut } = useAuth()
  const { configs, saving, loading: configsLoading, error: configsError, saveConfig, deleteConfig } = useConfigs(user)

  const enabledIds = resolveEnabled(selectedIds, modules)

  function toggleModule(id: string) {
    const mod = modules.find((m) => m.id === id)
    if (!mod || mod.required) return
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  function togglePersona(personaId: string, moduleIds: string[]) {
    setActivePersonaIds((prev) => {
      const next = new Set(prev)
      if (next.has(personaId)) {
        // Deselecting — remove modules not covered by any remaining persona
        next.delete(personaId)
        const coveredByOthers = new Set<string>()
        for (const pid of next) {
          const persona = PERSONAS.find((p) => p.id === pid)
          if (persona) for (const id of persona.moduleIds) coveredByOthers.add(id)
        }
        setSelectedIds((prevSelected) => {
          const remaining = new Set(prevSelected)
          for (const id of moduleIds) {
            if (!coveredByOthers.has(id)) remaining.delete(id)
          }
          return remaining
        })
      } else {
        // Selecting — add all modules
        next.add(personaId)
        setSelectedIds((prevSelected) => {
          const next2 = new Set(prevSelected)
          for (const id of moduleIds) next2.add(id)
          return next2
        })
      }
      return next
    })
  }

  function toggleCustomBlock(id: string) {
    setCustomBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    )
  }

  function removeCustomBlock(id: string) {
    setCustomBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  function loadConfig(cfg: SavedConfig) {
    setSelectedIds(new Set(cfg.selected_module_ids))
    setCustomBlocks(cfg.custom_blocks)
    setActivePersonaIds(new Set())
    setBuilderStarted(true)
    setActiveTab('build')
  }

  async function handleSave(name: string) {
    return saveConfig(name, Array.from(selectedIds), customBlocks)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header className="app-header">
        <div className="app-header-brand">
          <span style={styles.logo} onClick={() => setActiveTab('build')}>
            <span style={{ color: 'var(--accent)' }}>init</span>weave
          </span>
          <span className="app-tagline">build your Emacs init.el</span>
        </div>
        <nav className="app-nav">
          <button
            style={{ ...styles.tab, ...(activeTab === 'build' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('build')}
          >
            Builder
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'coming-soon' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('coming-soon')}
          >
            AI Config
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'about' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button
            style={{ ...styles.tab, ...(activeTab === 'privacy' ? styles.tabActive : {}) }}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </nav>
        <a
          href="https://github.com/timotaysci/Initweave"
          target="_blank"
          rel="noopener noreferrer"
          title="View on GitHub"
          style={styles.githubLink}
          aria-label="View on GitHub"
        >
          <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
        </a>
        <a
          href="https://buymeacoffee.com/timotaysci"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.coffee}
        >
          ☕ Buy me a coffee
        </a>
        {supabaseConfigured && (
          <AuthButton
            user={user}
            loading={authLoading}
            onSignIn={signInWithEmail}
            onSignOut={signOut}
          />
        )}
      </header>

      <main style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'build' ? (
          <BuilderTab
            selectedIds={selectedIds}
            enabledIds={enabledIds}
            activePersonaIds={activePersonaIds}
            builderStarted={builderStarted}
            customBlocks={customBlocks}
            onToggle={toggleModule}
            onTogglePersona={togglePersona}
            onStart={() => setBuilderStarted(true)}
            onToggleCustomBlock={toggleCustomBlock}
            onRemoveCustomBlock={removeCustomBlock}
            user={user}
            configs={configs}
            configsLoading={configsLoading}
            configsError={configsError}
            saving={saving}
            onSave={handleSave}
            onLoadConfig={loadConfig}
            onDeleteConfig={deleteConfig}
          />
        ) : activeTab === 'coming-soon' ? (
          <ComingSoonTab />
        ) : activeTab === 'about' ? (
          <AboutTab />
        ) : (
          <PrivacyTab />
        )}
      </main>
      <GdprBanner onShowPrivacy={() => setActiveTab('privacy')} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  logo: {
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: '-0.5px',
    cursor: 'pointer',
  },
  tab: {
    background: 'transparent',
    color: 'var(--text-muted)',
    padding: '6px 14px',
    borderRadius: 'var(--radius)',
    fontSize: 13,
    fontWeight: 500,
  },
  tabActive: {
    background: 'var(--surface-raised)',
    color: 'var(--accent)',
  },
  githubLink: {
    flexShrink: 0,
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    padding: '4px',
    borderRadius: 'var(--radius)',
    lineHeight: 0,
    transition: 'color 0.15s',
  },
  coffee: {
    flexShrink: 0,
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    padding: '5px 10px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    whiteSpace: 'nowrap' as const,
  },
}
