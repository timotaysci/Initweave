import { useEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'

interface Props {
  user: User | null
  loading: boolean
  onSignIn: (email: string) => Promise<{ error: string | null }>
  onSignOut: () => void
}

export default function AuthButton({ user, loading, onSignIn, onSignOut }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Focus input when dropdown opens
  useEffect(() => {
    if (open && !sent && !user) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, sent, user])

  function handleOpen() {
    setOpen((o) => !o)
    setSent(false)
    setError(null)
    setEmail('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    setError(null)
    const { error } = await onSignIn(email.trim())
    setSubmitting(false)
    if (error) {
      setError(error)
    } else {
      setSent(true)
    }
  }

  if (loading) return <div style={styles.placeholder} />

  // Logged in — show avatar with dropdown
  if (user) {
    const name = user.email ?? 'User'
    const initials = name[0].toUpperCase()
    return (
      <div ref={dropdownRef} style={styles.root}>
        <button style={styles.avatarBtn} onClick={handleOpen} title={user.email}>
          <div style={styles.avatarFallback}>{initials}</div>
        </button>
        {open && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownEmail}>{user.email}</div>
            <div style={styles.divider} />
            <button
              style={styles.dropdownItem}
              onClick={() => { setOpen(false); onSignOut() }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    )
  }

  // Logged out — sign in dropdown
  return (
    <div ref={dropdownRef} style={styles.root}>
      <button onClick={handleOpen} style={styles.signInBtn}>
        Sign in
      </button>
      {open && (
        <div style={styles.dropdown}>
          {sent ? (
            <div style={styles.sentPanel}>
              <div style={styles.sentIcon}>✉</div>
              <div style={styles.sentTitle}>Check your email</div>
              <div style={styles.sentBody}>
                We sent a sign-in link to <strong>{email}</strong>.
                Click it to log in — no password needed.
              </div>
              <button style={styles.sentClose} onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formTitle}>Sign in</div>
              <div style={styles.formBody}>
                Enter your email and we'll send you a link — no password needed.
              </div>
              <input
                ref={inputRef}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ ...styles.input, ...(error ? styles.inputError : {}) }}
              />
              {error && <div style={styles.errorMsg}>{error}</div>}
              <button
                type="submit"
                disabled={submitting || !email.trim()}
                style={styles.submitBtn}
              >
                {submitting ? 'Sending…' : 'Send sign-in link'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'relative',
    flexShrink: 0,
  },
  placeholder: {
    width: 68,
    height: 32,
  },
  signInBtn: {
    background: 'var(--surface-raised)',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '6px 14px',
    fontSize: 12,
    fontWeight: 500,
  },
  dropdown: {
    position: 'absolute',
    top: 42,
    right: 0,
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    zIndex: 200,
    width: 280,
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    overflow: 'hidden',
  },
  form: {
    padding: '18px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  formTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
  },
  formBody: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.5,
  },
  input: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '7px 10px',
    fontSize: 12,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    outline: 'none',
    width: '100%',
  },
  inputError: {
    borderColor: 'var(--danger)',
  },
  errorMsg: {
    fontSize: 11,
    color: 'var(--danger)',
  },
  submitBtn: {
    background: 'var(--accent)',
    color: '#1c1c1c',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '8px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
  },
  sentPanel: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    textAlign: 'center',
  },
  sentIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  sentTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
  },
  sentBody: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-serif)',
    lineHeight: 1.6,
  },
  sentClose: {
    marginTop: 6,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    fontSize: 12,
    padding: '6px 20px',
    cursor: 'pointer',
  },
  avatarBtn: {
    background: 'transparent',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  avatarFallback: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'var(--accent)',
    color: '#1c1c1c',
    fontSize: 13,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownEmail: {
    padding: '10px 14px',
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  divider: {
    height: 1,
    background: 'var(--border)',
  },
  dropdownItem: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    background: 'transparent',
    color: 'var(--text)',
    padding: '8px 14px',
    fontSize: 12,
    border: 'none',
    cursor: 'pointer',
  },
}
