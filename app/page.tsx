'use client'

import { useEffect, useState } from 'react'

export default function Home() {
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
    <main style={{ padding: '32px 16px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ background: 'linear-gradient(90deg,#3b82f6,#8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        XMC Dashboard
      </h1>
      <p style={{ color: '#8b9bb4', marginBottom: 24 }}>Room: default</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
        {[
          ['Total Trades', s.total || 0],
          ['Net P&L', fmt(s.net), s.net >= 0 ? '#22c55e' : '#ef4444'],
          ['Win Rate', ((s.winrate || 0) * 100).toFixed(1) + '%'],
          ['Wins', s.wins || 0, '#22c55e'],
          ['Losses', s.losses || 0, '#ef4444'],
          ['Profit Factor', fmt(s.pf)],
          ['Avg Hold', dur(s.avg_hold)],
          ['Avg Win', fmt(s.avg_win), '#22c55e'],
          ['Avg Loss', fmt(s.avg_loss), '#ef4444'],
        ].map(([label, value, color]) => (
          <div key={label} style={{ background: '#1a2332', padding: 16, borderRadius: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#8b9bb4', textTransform: 'uppercase' }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: color || '#e8eef4', marginTop: 4 }}>{value}</div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: 12 }}>Leaderboard</h2>
      <table style={{ width: '100%', background: '#1a2332', borderRadius: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ color: '#8b9bb4' }}>
            <th style={{ padding: 12, textAlign: 'left' }}>Rank</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Trader</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Net P&L</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Trades</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Win Rate</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Avg Hold</th>
          </tr>
        </thead>
        <tbody>
          {lb.length === 0 ? (
            <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#8b9bb4' }}>No trades yet. Attach the EA and close a trade.</td></tr>
          ) : lb.map((r: any, i: number) => (
            <tr key={r.trader} style={{ borderTop: '1px solid #2d3a4f' }}>
              <td style={{ padding: 12 }}>{i + 1}</td>
              <td style={{ padding: 12 }}>{r.trader}</td>
              <td style={{ padding: 12, color: r.net >= 0 ? '#22c55e' : '#ef4444' }}>{fmt(r.net)}</td>
              <td style={{ padding: 12 }}>{r.trades}</td>
              <td style={{ padding: 12 }}>{(r.winrate * 100).toFixed(1)}%</td>
              <td style={{ padding: 12 }}>{dur(r.avg_hold)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
