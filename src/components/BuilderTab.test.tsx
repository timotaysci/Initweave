// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import BuilderTab from './BuilderTab'

function mockMatchMedia(mobile: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: mobile && query === '(max-width: 640px)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

const baseProps = {
  selectedIds: new Set(['theme', 'which-key']),
  enabledIds: new Set(['theme', 'which-key']),
  customBlocks: [],
  onToggle: vi.fn(),
  onEnableModules: vi.fn(),
  onReplaceModules: vi.fn(),
  onToggleCustomBlock: vi.fn(),
  onRemoveCustomBlock: vi.fn(),
  user: null,
  configs: [],
  configsLoading: false,
  saving: false,
  configsError: null,
  onSave: vi.fn().mockResolvedValue(true),
  onLoadConfig: vi.fn(),
  onDeleteConfig: vi.fn(),
}

describe('BuilderTab mobile panel bar', () => {
  afterEach(() => cleanup())
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Modules/Preview tabs on mobile', () => {
    mockMatchMedia(true)
    render(<BuilderTab {...baseProps} />)
    expect(screen.getByRole('button', { name: 'Modules' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Preview' })).toBeDefined()
  })

  it('does not render Modules/Preview tabs on desktop', () => {
    mockMatchMedia(false)
    render(<BuilderTab {...baseProps} />)
    expect(screen.queryByRole('button', { name: 'Modules' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Preview' })).toBeNull()
  })

  it('renders tabs immediately after transitioning from persona picker', () => {
    mockMatchMedia(true)
    // Start with no selections (picker state), then transition to builder
    const { rerender } = render(
      <BuilderTab {...baseProps} selectedIds={new Set()} enabledIds={new Set()} />
    )
    // Picker is shown — no tabs yet
    expect(screen.queryByRole('button', { name: 'Modules' })).toBeNull()

    // Persona selected — builder mounts for the first time
    rerender(<BuilderTab {...baseProps} />)
    expect(screen.getByRole('button', { name: 'Modules' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'Preview' })).toBeDefined()
  })
})
