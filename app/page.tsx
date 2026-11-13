import Link from 'next/link'

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 600 }}>XMC</div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/login" className="btn btn-secondary">Log in</Link>
          <Link href="/signup" className="btn">Get started</Link>
        </div>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640 }}>
          <h1 style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 20 }}>
            Track every trade.<br />Compete with friends.
          </h1>
          <p style={{ fontSize: 20, color: 'var(--muted)', marginBottom: 40, lineHeight: 1.4 }}>
            Connect your Exness or MT5 account with a read-only password.<br />
            See your performance and climb private leaderboards.
          </p>
          <Link href="/signup" className="btn" style={{ fontSize: 18, padding: '16px 32px' }}>
            Create free account
          </Link>
        </div>
      </main>

      <footer style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
        XMC — Built for traders
      </footer>
    </div>
  )
}
