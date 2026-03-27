import hljs from 'highlight.js/lib/core'
import lisp from 'highlight.js/lib/languages/lisp'

hljs.registerLanguage('lisp', lisp)

type DirectivesBlock = { type: 'directives'; items: { key: string; value: string }[] }
type ProseBlock = { type: 'prose'; lines: string[] }
type HeadingBlock = { type: 'heading'; text: string }
type SrcBlock = { type: 'src'; lang: string; code: string }
type OrgBlock = DirectivesBlock | ProseBlock | HeadingBlock | SrcBlock

function parseOrg(text: string): OrgBlock[] {
  const lines = text.split('\n')
  const blocks: OrgBlock[] = []
  let i = 0

  // Leading keyword directives: #+KEYWORD: value
  const dirItems: { key: string; value: string }[] = []
  while (i < lines.length) {
    const match = lines[i].match(/^#\+([A-Z_]+):\s*(.*)$/)
    if (match) {
      dirItems.push({ key: match[1], value: match[2] })
      i++
    } else {
      break
    }
  }
  if (dirItems.length > 0) blocks.push({ type: 'directives', items: dirItems })

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('* ')) {
      blocks.push({ type: 'heading', text: line.slice(2) })
      i++
    } else if (/^#\+begin_src/i.test(line)) {
      const lang = line.split(/\s+/)[1] ?? 'text'
      const codeLines: string[] = []
      i++
      while (i < lines.length && !/^#\+end_src/i.test(lines[i])) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip #+end_src
      blocks.push({ type: 'src', lang, code: codeLines.join('\n') })
    } else if (line.trim() === '') {
      i++
    } else {
      const proseLines: string[] = []
      while (
        i < lines.length &&
        !lines[i].startsWith('* ') &&
        !/^#\+begin_src/i.test(lines[i]) &&
        lines[i].trim() !== ''
      ) {
        proseLines.push(lines[i])
        i++
      }
      if (proseLines.length > 0) blocks.push({ type: 'prose', lines: proseLines })
    }
  }

  return blocks
}

function renderInlineMarkup(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\[\[([^\]]+)\]\[([^\]]+)\]\]/g, '<span class="org-link">$2</span>')
    .replace(/\[\[([^\]]+)\]\]/g, '<span class="org-link">$1</span>')
    .replace(/=([^=\n]+)=/g, '<code class="org-verbatim">$1</code>')
    .replace(/~([^~\n]+)~/g, '<code class="org-verbatim">$1</code>')
    .replace(/(^|[\s(])\/([^/\n]+)\/([\s).,]|$)/g, '$1<em>$2</em>$3')
}

interface Props {
  code: string
}

export default function OrgPreview({ code }: Props) {
  const blocks = parseOrg(code)

  return (
    <div style={styles.root}>
      {blocks.map((block, idx) => {
        if (block.type === 'directives') {
          const title = block.items.find((d) => d.key === 'TITLE')?.value
          const date = block.items.find((d) => d.key === 'DATE')?.value
          const others = block.items.filter((d) => d.key !== 'TITLE' && d.key !== 'DATE')
          return (
            <div key={idx} style={styles.directives}>
              {title && <div style={styles.orgTitle}>{title}</div>}
              {date && <div style={styles.orgDate}>{date}</div>}
              {others.map((d) => (
                <div key={d.key} style={styles.orgProperty}>
                  <span style={styles.orgPropertyKey}>#+{d.key}:</span>{' '}
                  <span style={styles.orgPropertyValue}>{d.value}</span>
                </div>
              ))}
            </div>
          )
        }

        if (block.type === 'prose') {
          return (
            <p
              key={idx}
              style={styles.prose}
              dangerouslySetInnerHTML={{ __html: block.lines.map(renderInlineMarkup).join(' ') }}
            />
          )
        }

        if (block.type === 'heading') {
          return (
            <div key={idx} style={styles.heading}>
              <span style={styles.headingStar}>*</span>
              <span style={styles.headingText}
                dangerouslySetInnerHTML={{ __html: renderInlineMarkup(block.text) }}
              />
            </div>
          )
        }

        if (block.type === 'src') {
          const highlighted =
            block.lang === 'emacs-lisp' || block.lang === 'lisp'
              ? hljs.highlight(block.code, { language: 'lisp' }).value
              : block.code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          return (
            <div key={idx} style={styles.srcBlock}>
              <div style={styles.srcLabel}>{block.lang}</div>
              <pre
                style={styles.srcPre}
                dangerouslySetInnerHTML={{ __html: highlighted }}
              />
            </div>
          )
        }

        return null
      })}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    margin: '16px',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    background: 'var(--bg)',
  },
  directives: {
    borderBottom: '1px solid var(--border)',
    paddingBottom: 16,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  orgTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    marginBottom: 2,
  },
  orgDate: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    marginBottom: 6,
  },
  orgProperty: {
    fontSize: 11,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
  orgPropertyKey: {
    color: '#6a8a6a',
  },
  orgPropertyValue: {
    color: 'var(--text-muted)',
  },
  prose: {
    fontFamily: 'var(--font-serif)',
    fontSize: 13,
    color: 'var(--text-dim)',
    lineHeight: 1.75,
    marginBottom: 12,
  },
  heading: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 28,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: '1px solid var(--border)',
  },
  headingStar: {
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  headingText: {
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  srcBlock: {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  srcLabel: {
    fontSize: 10,
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-muted)',
    padding: '4px 10px',
    borderBottom: '1px solid var(--border)',
    letterSpacing: '0.05em',
  },
  srcPre: {
    margin: 0,
    padding: '12px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    color: 'var(--text)',
  },
}
