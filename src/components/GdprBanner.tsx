import { useState, useEffect } from 'react'

const STORAGE_KEY = 'initweave-gdpr-consent'

export default function GdprBanner({ onShowPrivacy }: { onShowPrivacy: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="gdpr-banner" style={styles.banner}>
      <p className="gdpr-text" style={styles.text}>
        We use essential cookies and store account data (email, saved configs, AI usage counts)
        to provide the service. No advertising or tracking cookies are used. See our{' '}
        <button style={styles.link} onClick={onShowPrivacy}>
          Privacy Policy
        </button>{' '}
        for details.
      </p>
      <div style={styles.actions}>
        <button style={styles.acceptBtn} onClick={accept}>Accept</button>
        <button style={styles.declineBtn} onClick={decline}>Decline</button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1000,
    flexWrap: 'wrap' as const,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-dim)',
    lineHeight: 1.6,
  },
  link: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: 'var(--accent)',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(201,168,76,0.4)',
    fontSize: 13,
    fontFamily: 'var(--font-serif)',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: 8,
    flexShrink: 0,
  },
  acceptBtn: {
    background: 'var(--accent)',
    color: '#1c1c1c',
    fontWeight: 600,
    fontSize: 13,
    padding: '7px 18px',
    borderRadius: 'var(--radius)',
  },
  declineBtn: {
    background: 'var(--surface-raised)',
    color: 'var(--text-muted)',
    fontSize: 13,
    padding: '7px 18px',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
}
