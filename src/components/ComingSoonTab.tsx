export default function ComingSoonTab() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h2 style={styles.heading}>Coming Soon</h2>
        <p style={styles.text}>More features are on the way.</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  content: {
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 600,
    color: 'var(--accent)',
    marginBottom: 12,
  },
  text: {
    color: 'var(--text-muted)',
    fontSize: 14,
  },
}
