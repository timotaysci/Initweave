export default function AboutTab() {
  return (
    <div style={styles.root}>
      <div style={styles.inner}>

        <section style={styles.section}>
          <h1 style={styles.h1}>About initweave</h1>
          <p style={styles.lead}>
            Emacs is one of the most capable tools available to a knowledge worker. It is also,
            famously, one of the hardest to start with. The blank configuration file is a real
            barrier — not because Emacs is poorly designed, but because the first hour asks you
            to make decisions you don't yet have the context to make.
          </p>
          <p style={styles.body}>
            initweave exists to clear that first hour. Pick the features you want, get a working
            configuration file, and start using the tool. The details can come later.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>What initweave configures</h2>
          <p style={styles.body}>
            The module library covers the full breadth of a working Emacs setup: developer
            tools (LSP via Eglot, Magit, Projectile), scientific workflows (AUCTeX for LaTeX,
            ESS for R), writing environments (Olivetti, Flyspell), system integration (vterm,
            TRAMP), and a thorough{' '}
            <a
              href="https://orgmode.org"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              org-mode
            </a>
            {' '}stack for notes, tasks, and linked thinking.
          </p>
          <p style={styles.body}>
            Org-mode is treated as a first-class option, not an afterthought — many people come
            to Emacs specifically because of it. But initweave does not assume that is your reason.
            Pick the modules that match your workflow and ignore the rest.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Who is this for?</h2>
          <p style={styles.body}>
            Primarily, people who are curious about Emacs but haven't yet found a way in. You
            may have heard about org-mode, seen a developer swear by Magit, or wondered what a
            scientist means when they say they write papers in Emacs. You don't need a background
            in Lisp or systems programming. You just need a starting point.
          </p>
          <p style={styles.body}>
            It is also useful for people who have used Emacs before but want to rebuild their
            configuration cleanly — without starting from a blank file or copying someone else's
            dotfiles wholesale.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Open source</h2>
          <p style={styles.body}>
            initweave is free and open source under the MIT licence. The module system is
            designed to be straightforward to extend — adding a new module is a matter of adding
            an entry to a single config file. If there is a package or workflow you think should
            be included, contributions are welcome.
          </p>
          <p style={styles.body}>
            The source is available on{' '}
            <a
              href="https://github.com/timotaysci/initweave"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            .
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>AI tab — coming soon</h2>
          <p style={styles.body}>
            A dedicated AI tab is in development. The plan is to let you describe what you want
            in plain English and receive a module suggestion or a small block of custom
            configuration — scoped narrowly to Emacs and{' '}
            <a
              href="https://orgmode.org"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              org-mode
            </a>
            . The intent is to help you discover what is possible, not to replace reading the
            manual.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>About the author</h2>
          <p style={styles.body}>
            initweave was built by{' '}
            <a
              href="https://timothyjohnsonsci.com"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Timothy Johnson
            </a>
            , a chemical researcher turned technologist working at the intersection of science,
            AI, and high-performance computing. He holds 1,000+ citations in chemistry and
            materials science research, and is a long-time Emacs and{' '}
            <a
              href="https://orgmode.org"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              org-mode
            </a>{' '}
            practitioner.
          </p>
          <p style={styles.body}>
            If you are a scientist curious about why Emacs is worth your time, his peer-reviewed
            article{' '}
            <a
              href="https://timothyjohnsonsci.com/blogs/2022-01-31-emacs-as-a-tool/"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Emacs as a Tool for Modern Science
            </a>
            , published in <em>Johnson Matthey Technology Review</em>, makes the case in language
            familiar to researchers.
          </p>
        </section>

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Built by{' '}
            <a
              href="https://timothyjohnsonsci.com"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Timothy Johnson
            </a>
            .
          </p>
        </footer>

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
    padding: '40px 16px 120px',
  },
  inner: {
    width: '100%',
    maxWidth: 680,
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  h1: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--accent)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '-0.5px',
    marginBottom: 4,
  },
  h2: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.01em',
  },
  lead: {
    fontSize: 15,
    fontFamily: 'var(--font-serif)',
    color: 'var(--text)',
    lineHeight: 1.8,
  },
  body: {
    fontSize: 14,
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-dim)',
    lineHeight: 1.8,
  },
  code: {
    fontFamily: 'var(--font-mono)',
    fontSize: 13,
    background: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: 3,
    padding: '1px 5px',
    color: 'var(--text)',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(201,168,76,0.4)',
  },
  footer: {
    borderTop: '1px solid var(--border)',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
  },
}
