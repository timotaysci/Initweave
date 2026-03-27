export default function PrivacyTab() {
  return (
    <div style={styles.root}>
      <div style={styles.inner}>

        <section style={styles.section}>
          <h1 style={styles.h1}>Privacy Policy</h1>
          <p style={styles.lead}>
            This policy explains what data initweave collects, why, and how it is stored. I
            collect only what is necessary for the service to work.
          </p>
          <p style={styles.body}>Last updated: March 2026.</p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Who I am</h2>
          <p style={styles.body}>
            initweave is operated by Timothy Johnson. If you have questions about this policy,
            contact:{' '}
            <a href="mailto:tim@timothyjohnsonsci.com" style={styles.link}>
              tim@timothyjohnsonsci.com
            </a>
            .
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>What I collect and why</h2>

          <h3 style={styles.h3}>Account and authentication</h3>
          <p style={styles.body}>
            When you sign in, I store your email address and a session token via{' '}
            <a href="https://supabase.com" style={styles.link} target="_blank" rel="noopener noreferrer">
              Supabase
            </a>
            . This is required to identify your account across visits. I do not store passwords —
            sign-in uses a one-time magic link sent to your email.
          </p>

          <h3 style={styles.h3}>Saved configurations</h3>
          <p style={styles.body}>
            If you save an Emacs configuration, I store the configuration name, selected module
            IDs, and any AI-generated custom blocks against your account in my database. This
            data exists solely to let you retrieve your configurations on future visits.
          </p>

          <h3 style={styles.h3}>AI usage</h3>
          <p style={styles.body}>
            Each time you use the AI Config feature, I record your user ID and a timestamp. This
            is used only to enforce the daily usage limit (10 requests per day) and is not used
            for any profiling or marketing purpose.
          </p>

          <h3 style={styles.h3}>AI queries</h3>
          <p style={styles.body}>
            The text you submit in the AI Config tab is sent to my API and forwarded to{' '}
            <a href="https://www.anthropic.com" style={styles.link} target="_blank" rel="noopener noreferrer">
              Anthropic
            </a>{' '}
            (Claude) to generate a response. I do not store the content of your queries.
            Anthropic may retain query data in accordance with their own{' '}
            <a href="https://www.anthropic.com/legal/privacy" style={styles.link} target="_blank" rel="noopener noreferrer">
              privacy policy
            </a>
            . Please do not include personal or sensitive information in your queries.
          </p>

          <h3 style={styles.h3}>Analytics</h3>
          <p style={styles.body}>
            I use{' '}
            <a href="https://www.goatcounter.com" style={styles.link} target="_blank" rel="noopener noreferrer">
              GoatCounter
            </a>{' '}
            for privacy-friendly page view analytics. GoatCounter does not use cookies or
            fingerprinting, and does not track individual users across sessions. It records only
            aggregated data: page path, referrer, browser, and country (derived from your IP
            address, which is not stored). No personal data is sent to GoatCounter. You can view{' '}
            <a href="https://www.goatcounter.com/help/privacy" style={styles.link} target="_blank" rel="noopener noreferrer">
              GoatCounter's privacy policy
            </a>{' '}
            for full details.
          </p>

          <h3 style={styles.h3}>Fonts</h3>
          <p style={styles.body}>
            I load IBM Plex Mono and Source Serif 4 from Google Fonts. This causes your browser
            to make a request to Google's servers, which may log your IP address. See{' '}
            <a
              href="https://policies.google.com/privacy"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google's privacy policy
            </a>{' '}
            for details.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Data storage and security</h2>
          <p style={styles.body}>
            Account data, saved configurations, and usage records are stored in{' '}
            <a href="https://supabase.com" style={styles.link} target="_blank" rel="noopener noreferrer">
              Supabase
            </a>
            , hosted on Azure infrastructure in Ireland (EU). The application itself is served
            via Azure Static Web Apps, distributed globally. Supabase enforces row-level
            security so that your data is only accessible by your own account.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Your rights under GDPR</h2>
          <p style={styles.body}>
            If you are in the European Economic Area, you have the right to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Access the personal data I hold about you</li>
            <li style={styles.listItem}>Request correction of inaccurate data</li>
            <li style={styles.listItem}>Request deletion of your account and associated data</li>
            <li style={styles.listItem}>Object to processing of your personal data</li>
            <li style={styles.listItem}>Request a copy of your data in a portable format</li>
          </ul>
          <p style={styles.body}>
            To exercise any of these rights, email{' '}
            <a href="mailto:tim@timothyjohnsonsci.com" style={styles.link}>
              tim@timothyjohnsonsci.com
            </a>
            . I will respond within 30 days.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Cookies and local storage</h2>
          <p style={styles.body}>
            I use browser local storage to remember your consent choice and to maintain your
            login session. I do not use third-party tracking cookies or advertising cookies.
            My analytics provider (GoatCounter) does not use cookies.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Data retention</h2>
          <p style={styles.body}>
            I retain your data for as long as your account is active. If you delete your account
            or request deletion, all associated data (saved configurations, usage records, and
            your email address) will be removed within 30 days.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.h2}>Changes to this policy</h2>
          <p style={styles.body}>
            If I make material changes to this policy, I will update the date at the top of
            this page. Continued use of initweave after changes are posted constitutes acceptance
            of the updated policy.
          </p>
        </section>

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
    padding: '40px 16px 240px',
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
  h3: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
    marginTop: 6,
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
  list: {
    paddingLeft: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  listItem: {
    fontSize: 14,
    fontFamily: 'var(--font-serif)',
    color: 'var(--text-dim)',
    lineHeight: 1.7,
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(201,168,76,0.4)',
  },
}
