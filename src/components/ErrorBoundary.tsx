import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={styles.root}>
          <div style={styles.box}>
            <div style={styles.title}>Something went wrong</div>
            <pre style={styles.message}>{this.state.error.message}</pre>
            <pre style={styles.stack}>{this.state.error.stack}</pre>
            <button style={styles.btn} onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1c1c1c',
    padding: 24,
  },
  box: {
    background: '#252525',
    border: '1px solid #e07070',
    borderRadius: 8,
    padding: 24,
    maxWidth: 700,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  title: {
    color: '#e07070',
    fontFamily: 'monospace',
    fontWeight: 700,
    fontSize: 14,
  },
  message: {
    color: '#e2e2e2',
    fontFamily: 'monospace',
    fontSize: 13,
    whiteSpace: 'pre-wrap',
  },
  stack: {
    color: '#888',
    fontFamily: 'monospace',
    fontSize: 11,
    whiteSpace: 'pre-wrap',
    maxHeight: 200,
    overflow: 'auto',
  },
  btn: {
    background: '#2e2e2e',
    color: '#e2e2e2',
    border: '1px solid #3a3a3a',
    borderRadius: 6,
    padding: '6px 16px',
    fontSize: 12,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
}
