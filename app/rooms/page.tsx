'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Rooms() {
  const [code, setCode] = useState('')
  const [room, setRoom] = useState('default')
  const [traders, setTraders] = useState<any[]>([])
  const [created, setCreated] = useState('')
  const [status, setStatus] = useState('')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    fetch(`/api/stats?room=${room}`)
      .then(r => r.json())
      .then(d => setTraders(d.leaderboard || []))
  }, [room])

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(''), 1500)
  }

  const createRoom = async () => {
    setStatus('Creating...')
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', trader: 'You' })
    })
    const data = await res.json()
    if (data.code) {
      setCreated(data.code)
      setRoom(data.code)
      setStatus('')
    } else {
      setStatus(data.error || 'Failed')
    }
  }

  const joinRoom = async () => {
    if (!code) return
    setStatus('Joining...')
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'join', code, trader: 'You' })
    })
    const data = await res.json()
    if (data.status === 'joined') {
      setRoom(code)
      setStatus('Joined')
    } else {
      setStatus(data.error || 'Failed')
    }
  }

  const fmt = (n: number) => (n || 0).toFixed(2)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <aside className="sidebar">
        <Link href="/dashboard" style={{ fontSize: 22, fontWeight: 600, textDecoration: 'none', color: 'var(--text)' }}>XMC</Link>
        <nav style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/dashboard" style={nav}>Dashboard</Link>
          <Link href="/rooms" style={navActive}>Rooms</Link>
          <Link href="/leaderboard" style={nav}>Leaderboard</Link>
          <Link href="/connect" style={nav}>Connect Account</Link>
        </nav>
      </aside>

      <main className="main-content" style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 4 }}>Rooms</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Create a room or join with a code.</p>

        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 720, marginBottom: 40 }}>
          <div className="glass" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Create Room</h2>
            <button className="btn" onClick={createRoom}>Generate Code</button>
            {created && (
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>{created}</span>
                <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: 14 }} onClick={() => copy(created)}>
                  {copied === created ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
          </div>

          <div className="glass" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Enter Code</h2>
            <input
              placeholder="Room code"
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={joinRoom}>Join</button>
              {code && (
                <button className="btn btn-secondary" style={{ padding: '8px 16px' }} onClick={() => copy(code)}>
                  {copied === code ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
          </div>
        </div>

        {status && <p style={{ marginBottom: 20, color: 'var(--muted)' }}>{status}</p>}

        <div className="glass" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', fontWeight: 600 }}>
            Room: {room}
          </div>
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
              {traders.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>No traders in this room yet.</td></tr>
              ) : traders.map((r, i) => (
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
const navActive: React.CSSProperties = { ...nav, background: 'rgba(128,128,128,0.12)', color: 'var(--text)' }
