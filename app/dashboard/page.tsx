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
  const lb = data?.leaderboard || []

  const fmt = (n: number) => (n || 0).toFixed(2)
  const dur = (sec: number) => {
    if (!sec) return '—'
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60)
    return h ? `${h}h ${m}m` : `${m}m`
  }

  return (
    <main style={{ padding: '40px 20px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
        <div>
          <Link href="/" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>← Home</Link>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginTop: 8 }}>Dashboard</h1>
        </div>
        <Link href="/connect" className="btn">Connect Account</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
        {[
          ['Total Trades', s.total || 0],
          ['Net P&L', fmt(s.net), s.net >= 0 ? 'var(--green)' : 'var(--red)'],
          ['Win Rate', ((s.winrate || 0) * 100).toFixed(1) + '%'],
          ['Wins', s.wins || 0, 'var(--green)'],
          ['Losses', s.losses || 0, 'var(--red)'],
          ['Profit Factor', fmt(s.pf)],
          ['Avg Hold', dur(s.avg_hold)],
          ['Avg Win', fmt(s.avg_win), 'var(--green)'],
          ['Avg Loss', fmt(s.avg_loss), 'var(--red)'],
        ].map(([label, value, color]) => (
          <div key={String(label)} className="glass stat">
            <div className="label">{label}</div>
            <div className="value" style={{ color: color || 'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Leaderboard</h2>
      <div className="glass" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ color: 'var(--muted)' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 500 }}>Rank</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 500 }}>Trader</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 500 }}>Net P&L</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 500 }}>Trades</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 500 }}>Win Rate</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: 500 }}>Avg Hold</th>
            </tr>
          </thead>
          <tbody>
            {lb.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No trades yet. Connect your account.</td></tr>
            ) : lb.map((r: any, i: number) => (
              <tr key={r.trader} style={{ borderTop: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '16px 20px' }}>{i + 1}</td>
                <td style={{ padding: '16px 20px' }}>{r.trader}</td>
                <td style={{ padding: '16px 20px', color: r.net >= 0 ? 'var(--green)' : 'var(--red)' }}>{fmt(r.net)}</td>
                <td style={{ padding: '16px 20px' }}>{r.trades}</td>
                <td style={{ padding: '16px 20px' }}>{(r.winrate * 100).toFixed(1)}%</td>
                <td style={{ padding: '16px 20px' }}>{dur(r.avg_hold)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
