'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Overall ranking across all rooms
    fetch('/api/stats?room=all')
      .then(r => r.json())
      .then(d => setData(d.leaderboard || []))
  }, [])

  const fmt = (n: number) => (n || 0).toFixed(2)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      <aside style={{ width: 240, background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '28px 16px' }}>
        <Link href="/dashboard" style={{ fontSize: 22, fontWeight: 600, textDecoration: 'none', color: 'var(--text)' }}>XMC</Link>
        <nav style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/dashboard" style={nav}>Dashboard</Link>
          <Link href="/rooms" style={nav}>Rooms</Link>
          <Link href="/leaderboard" style={navActive}>Leaderboard</Link>
          <Link href="/connect" style={nav}>Connect Account</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 4 }}>Leaderboard</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Overall ranking of all traders on XMC</p>

        <div className="glass" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--muted)' }}>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 500 }}>Rank</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 500 }}>Trader</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 500 }}>Net P&L</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 500 }}>Trades</th>
                <th style={{ padding: '16px 24px', textAlign: 'left', fontWeight: 500 }}>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>No traders yet.</td></tr>
              ) : data.map((r, i) => (
                <tr key={r.trader} style={{ borderTop: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '18px 24px', fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: '18px 24px' }}>{r.trader}</td>
                  <td style={{ padding: '18px 24px', color: r.net >= 0 ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>{fmt(r.net)}</td>
                  <td style={{ padding: '18px 24px' }}>{r.trades}</td>
                  <td style={{ padding: '18px 24px' }}>{(r.winrate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

const nav: React.CSSProperties = { padding: '12px 16px', borderRadius: 10, color: 'var(--muted)', textDecoration: 'none', fontSize: 15 }
const navActive: React.CSSProperties = { ...nav, background: 'rgba(255,255,255,0.08)', color: 'var(--text)' }
