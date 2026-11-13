'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/stats?room=default')
      setData(await res.json())
    }
    load()
    const i = setInterval(load, 10000)
    return () => clearInterval(i)
  }, [])

  const s = data?.summary || {}
  const fmt = (n: number) => (n || 0).toFixed(2)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '28px 16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: 22, fontWeight: 600, padding: '0 12px 32px' }}>XMC</div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/dashboard" style={navActive}>Dashboard</Link>
          <Link href="/connect" style={navItem}>Connect Account</Link>
          <Link href="#" style={navItem}>Rooms</Link>
          <Link href="#" style={navItem}>Leaderboard</Link>
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 12px' }}>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>Log out</Link>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px 40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600 }}>Welcome back</h1>
            <p style={{ color: 'var(--muted)', marginTop: 4 }}>Your trading performance</p>
          </div>
          <Link href="/connect" className="btn">Connect Account</Link>
        </header>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatCard label="Net P&L" value={fmt(s.net)} positive={s.net >= 0} />
          <StatCard label="Win Rate" value={((s.winrate || 0) * 100).toFixed(1) + '%'} />
          <StatCard label="Total Trades" value={s.total || 0} />
          <StatCard label="Profit Factor" value={fmt(s.pf)} />
        </div>

        {/* Growth + details */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div className="glass" style={{ padding: 28, minHeight: 320 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Equity Curve</h2>
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
              Chart will appear after trades are connected
            </div>
          </div>

          <div className="glass" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Account</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, color: 'var(--muted)', fontSize: 15 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Status</span><span style={{ color: 'var(--text)' }}>Not connected</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Wins</span><span style={{ color: 'var(--green)' }}>{s.wins || 0}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Losses</span><span style={{ color: 'var(--red)' }}>{s.losses || 0}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Avg Hold</span><span style={{ color: 'var(--text)' }}>{s.avg_hold ? Math.round(s.avg_hold / 60) + 'm' : '—'}</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const navItem: React.CSSProperties = {
  padding: '12px 16px',
  borderRadius: 10,
  color: 'var(--muted)',
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 500,
}

const navActive: React.CSSProperties = {
  ...navItem,
  background: 'rgba(255,255,255,0.08)',
  color: 'var(--text)',
}

function StatCard({ label, value, positive }: { label: string; value: string | number; positive?: boolean }) {
  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ fontSize: 13, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, marginTop: 8, color: positive === false ? 'var(--red)' : positive === true ? 'var(--green)' : 'var(--text)' }}>
        {value}
      </div>
    </div>
  )
}
