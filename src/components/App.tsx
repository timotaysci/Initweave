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
