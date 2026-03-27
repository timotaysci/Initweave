import { useState, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import { modules } from '../modules'
import type { CustomBlock } from '../lib/generator'
import { useAiUsage, AI_DAILY_LIMIT } from '../lib/useAiUsage'

const CHIPS = [
  'I want to write Python code with autocomplete',
  'I want vim-style keybindings',
  'I want to take linked notes like Roam Research',
  'I want fuzzy file finding like VS Code',
  'I want to manage my tasks and projects',
  'I want a clean minimal dark setup',
  'I want to write academic papers',
  'I use Emacs for Git workflows',
]

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

interface AiSuggestion {
  explanation: string
  enable_modules: string[]
  custom_block: { label: string; elisp: string } | null
}

interface Props {
  user: User | null
  enabledIds: Set<string>
  onEnableModules: (ids: string[]) => void
  onAddCustomBlock: (block: CustomBlock) => void
  onSwitchToBuilder: () => void
}

export default function AskTab({
  user,
  enabledIds,
  onEnableModules,
  onAddCustomBlock,
  onSwitchToBuilder,
}: Props) {
  const { remaining, atLimit, recordUsage } = useAiUsage(user)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [applied, setApplied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleChip(text: string) {
    setInput(text)
    setSuggestion(null)
    setApplied(false)
    setError(null)
    textareaRef.current?.focus()
  }

  async function handleSubmit() {
    const question = input.trim()
    if (!question || loading || atLimit) return

    const allowed = await recordUsage()
    if (!allowed) return

    setLoading(true)
    setSuggestion(null)
    setError(null)
    setApplied(false)

    // Build context: which modules are currently enabled
    const currentModules = modules
      .filter((m) => enabledIds.has(m.id))
      .map((m) => m.id)

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          enabled_modules: currentModules,
          available_modules: modules.map((m) => ({
            id: m.id,
            label: m.label,
            description: m.description,
          })),
        }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `HTTP ${res.status}`)
      }

      const data = (await res.json()) as AiSuggestion
      setSuggestion(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleApply() {
    if (!suggestion) return

    if (suggestion.enable_modules.length > 0) {
      onEnableModules(suggestion.enable_modules)
    }

    if (suggestion.custom_block) {
      onAddCustomBlock({
        id: `ai-${Date.now()}`,
        label: suggestion.custom_block.label,
        elisp: suggestion.custom_block.elisp,
        enabled: true,
      })
    }

    setApplied(true)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Which suggested modules are new vs already enabled
  const newModuleIds = suggestion?.enable_modules.filter((id) => !enabledIds.has(id)) ?? []
  const alreadyEnabledIds = suggestion?.enable_modules.filter((id) => enabledIds.has(id)) ?? []
  const hasChanges =
    suggestion && (newModuleIds.length > 0 || suggestion.custom_block != null)

  if (!user) {
    return (
      <div style={styles.root}>
        <div style={styles.gate}>
          <div style={styles.gateIcon}>⚿</div>
          <div style={styles.gateTitle}>Sign in to use AI Config</div>
          <p style={styles.gateBody}>
            Describe what you want to do in Emacs and the AI will suggest modules
            and generate custom configuration. Sign in with the button in the top
            right to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.root}>
      <div style={styles.inner}>
        <div style={styles.introRow}>
          <p style={styles.intro}>
            Describe what you want to do in Emacs — the AI will suggest modules to
            enable and generate any custom configuration you need.
          </p>
          <div style={{ ...styles.usagePill, ...(atLimit ? styles.usagePillDepleted : {}) }}>
            {atLimit ? 'Limit reached' : `${remaining} / ${AI_DAILY_LIMIT} remaining today`}
          </div>
        </div>

        {/* Chip suggestions */}
        <div style={styles.chips}>
          {CHIPS.map((chip) => (
            <button key={chip} style={styles.chip} onClick={() => handleChip(chip)}>
              {chip}
            </button>
          ))}
        </div>

        {atLimit && (
          <div style={styles.limitBanner}>
            You've used all {AI_DAILY_LIMIT} AI requests for today. Your allowance resets at midnight.
          </div>
        )}

        {/* Input */}
        <div style={styles.inputGroup}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={atLimit ? 'Daily limit reached — come back tomorrow' : 'Describe what you want… (Enter to submit, Shift+Enter for newline)'}
            rows={3}
            style={{ ...styles.textarea, ...(atLimit ? styles.textareaDisabled : {}) }}
            disabled={atLimit}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || loading || atLimit}
            style={styles.submitBtn}
          >
            {loading ? <span className="spinner" /> : 'Ask'}
          </button>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Suggestion card */}
        {suggestion && (
          <div style={styles.card}>
            {/* Explanation */}
            <p style={styles.explanation}>{suggestion.explanation}</p>

            {/* Module changes */}
            {suggestion.enable_modules.length > 0 && (
              <div style={styles.section}>
                <div style={styles.sectionLabel}>Modules to enable</div>
                <div style={styles.moduleChips}>
                  {newModuleIds.map((id) => {
                    const mod = modules.find((m) => m.id === id)
                    return (
                      <span key={id} style={styles.modChipNew}>
                        + {mod?.label ?? id}
                      </span>
                    )
                  })}
                  {alreadyEnabledIds.map((id) => {
                    const mod = modules.find((m) => m.id === id)
                    return (
                      <span key={id} style={styles.modChipAlready}>
                        ✓ {mod?.label ?? id}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Custom elisp block */}
            {suggestion.custom_block && (
              <div style={styles.section}>
                <div style={styles.sectionLabel}>
                  Custom block — {suggestion.custom_block.label}
                </div>
                <pre style={styles.codeBlock}>
                  <code>{suggestion.custom_block.elisp}</code>
                </pre>
              </div>
            )}

            {/* No changes needed */}
            {!hasChanges && (
              <p style={styles.noChanges}>
                Everything you need is already enabled.
              </p>
            )}

            {/* Actions */}
            <div style={styles.actions}>
              {applied ? (
                <div style={styles.appliedRow}>
                  <span style={styles.appliedMsg}>Applied to config ✓</span>
                  <button style={styles.goBtn} onClick={onSwitchToBuilder}>
                    Go to Builder →
                  </button>
                </div>
              ) : (
                hasChanges && (
                  <button style={styles.applyBtn} onClick={handleApply}>
                    Apply to config
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 16px',
  },
  inner: {
    width: '100%',
    maxWidth: 700,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  gate: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 12,
    textAlign: 'center',
    padding: '0 32px',
    maxWidth: 420,
    margin: '0 auto',
  },
  gateIcon: {
    fontSize: 32,
    color: 'var(--text-muted)',
    marginBottom: 4,
  },
  gateTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
  },
  gateBody: {
    fontSize: 13,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.7,
  },
  introRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  intro: {
    flex: 1,
    fontSize: 14,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.6,
  },
  usagePill: {
    flexShrink: 0,
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    fontWeight: 600,
    color: 'var(--accent)',
    background: 'rgba(201,168,76,0.1)',
    border: '1px solid rgba(201,168,76,0.35)',
    borderRadius: 10,
    padding: '5px 12px',
    whiteSpace: 'nowrap' as const,
  },
  usagePillDepleted: {
    color: 'var(--danger)',
    borderColor: 'rgba(224,112,112,0.3)',
    background: 'rgba(224,112,112,0.08)',
  },
  limitBanner: {
    background: 'rgba(224,112,112,0.08)',
    border: '1px solid rgba(224,112,112,0.25)',
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    fontSize: 13,
    color: 'var(--danger)',
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.5,
  },
  textareaDisabled: {
    opacity: 0.5,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 8,
  },
  chip: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text-dim)',
    borderRadius: 'var(--radius)',
    padding: '5px 10px',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    textAlign: 'left' as const,
  },
  inputGroup: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.6,
    padding: '10px 12px',
    resize: 'vertical' as const,
    outline: 'none',
  },
  submitBtn: {
    background: 'var(--accent)',
    color: '#1c1c1c',
    fontWeight: 600,
    fontSize: 13,
    padding: '0 18px',
    height: 40,
    borderRadius: 'var(--radius)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  error: {
    background: 'rgba(224,112,112,0.1)',
    border: '1px solid rgba(224,112,112,0.3)',
    color: 'var(--danger)',
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    fontSize: 13,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  explanation: {
    fontSize: 14,
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.65,
    color: 'var(--text)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  moduleChips: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 6,
  },
  modChipNew: {
    fontSize: 12,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 4,
    background: 'rgba(201,168,76,0.15)',
    color: 'var(--accent)',
    border: '1px solid rgba(201,168,76,0.3)',
  },
  modChipAlready: {
    fontSize: 12,
    padding: '3px 10px',
    borderRadius: 4,
    background: 'rgba(106,191,105,0.1)',
    color: 'var(--success)',
    border: '1px solid rgba(106,191,105,0.2)',
  },
  codeBlock: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    fontSize: 12,
    fontFamily: 'var(--font-mono)',
    lineHeight: 1.7,
    overflowX: 'auto' as const,
    color: 'var(--text)',
    whiteSpace: 'pre' as const,
  },
  noChanges: {
    fontSize: 13,
    color: 'var(--text-muted)',
    fontStyle: 'italic',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  applyBtn: {
    background: 'var(--accent)',
    color: '#1c1c1c',
    fontWeight: 600,
    fontSize: 13,
    padding: '8px 20px',
    borderRadius: 'var(--radius)',
  },
  appliedRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  appliedMsg: {
    fontSize: 13,
    color: 'var(--success)',
    fontWeight: 600,
  },
  goBtn: {
    background: 'var(--surface-raised)',
    color: 'var(--accent)',
    fontSize: 13,
    padding: '6px 14px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    fontWeight: 500,
  },
}
