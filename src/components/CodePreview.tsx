import { useEffect, useRef, useState } from 'react'
import hljs from 'highlight.js/lib/core'
import lisp from 'highlight.js/lib/languages/lisp'
import OrgPreview from './OrgPreview'

hljs.registerLanguage('lisp', lisp)

interface Props {
  orgCode: string
  initElCode: string
}

export default function CodePreview({ orgCode, initElCode }: Props) {
  const preRef = useRef<HTMLPreElement>(null)
  const [view, setView] = useState<'org' | 'el'>('el')
  const [copied, setCopied] = useState(false)

  const code = view === 'org' ? orgCode : initElCode
  const filename = view === 'org' ? 'init.org' : 'init.el'

  useEffect(() => {
    if (preRef.current) {
      if (view === 'org') {
        preRef.current.textContent = code
      } else {
        preRef.current.innerHTML = hljs.highlight(code, { language: 'lisp' }).value
      }
    }
  }, [code, view])

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={styles.root}>
      <div style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <span style={styles.filename}>{filename}</span>
          <div style={styles.toggle}>
            <button
              onClick={() => setView('org')}
              style={{ ...styles.toggleBtn, ...(view === 'org' ? styles.toggleBtnActive : {}) }}
            >
              org
            </button>
            <button
              onClick={() => setView('el')}
              style={{ ...styles.toggleBtn, ...(view === 'el' ? styles.toggleBtnActive : {}) }}
            >
              init.el
            </button>
          </div>
        </div>
        <button
          onClick={handleCopy}
          style={{ ...styles.copyBtn, ...(copied ? styles.copyBtnDone : {}) }}
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>

      <div style={styles.scrollable}>
        {view === 'org' ? (
          <OrgPreview code={orgCode} />
        ) : (
          <pre ref={preRef} style={styles.pre} />
        )}
      </div>

      <div className="code-instructions" style={styles.instructions}>
        {view === 'org' ? (
          <>
            <p style={styles.instHeading}>How to use this file</p>
            <ol style={styles.instList}>
              <li>Copy the org file above and save it as <code>~/.emacs.d/config.org</code>.</li>
              <li>Open it in Emacs and run <code>M-x org-babel-tangle</code>. This writes <code>~/.emacs.d/init.el</code> automatically.</li>
              <li>Restart Emacs. Packages install on first launch — restart once more when done.</li>
            </ol>
          </>
        ) : (
          <>
            <p style={styles.instHeading}>How to use this file</p>
            <ol style={styles.instList}>
              <li>Copy the code above and save it as <code>~/.emacs.d/init.el</code> (or <code>~/.config/emacs/init.el</code> on Emacs 27+).</li>
              <li>Start Emacs. On the first launch it will download and install all declared packages from MELPA — this takes a minute or two.</li>
              <li>Restart Emacs once the installation completes. Everything should be ready.</li>
            </ol>
          </>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--surface)',
    borderLeft: '1px solid var(--border)',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  toolbarLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  filename: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  toggle: {
    display: 'flex',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    overflow: 'hidden',
  },
  toggleBtn: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: 'none',
    borderRadius: 0,
    padding: '3px 10px',
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    cursor: 'pointer',
  },
  toggleBtnActive: {
    background: 'var(--surface-raised)',
    color: 'var(--accent)',
  },
  copyBtn: {
    background: 'var(--surface-raised)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '4px 12px',
    fontSize: 12,
    fontWeight: 500,
  },
  copyBtnDone: {
    background: 'rgba(106,191,105,0.15)',
    color: 'var(--success)',
    borderColor: 'rgba(106,191,105,0.3)',
  },
  scrollable: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  pre: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    color: 'var(--text)',
  },
  instructions: {
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  instHeading: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--accent)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  instList: {
    paddingLeft: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 12,
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.5,
  },
}
