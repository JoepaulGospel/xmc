'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Rooms() {
  const [code, setCode] = useState('')
  const [joined, setJoined] = useState<string | null>(null)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#000' }}>
      <aside style={{ width: 240, background: '#0a0a0a', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '28px 16px' }}>
        <Link href="/dashboard" style={{ fontSize: 22, fontWeight: 600, textDecoration: 'none', color: 'var(--text)' }}>XMC</Link>
        <nav style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Link href="/dashboard" style={nav}>Dashboard</Link>
          <Link href="/rooms" style={navActive}>Rooms</Link>
          <Link href="/leaderboard" style={nav}>Leaderboard</Link>
          <Link href="/connect" style={nav}>Connect Account</Link>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px 48px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>Rooms</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 40 }}>Create or join a private room to compete with other traders.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 800 }}>
          <div className="glass" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Create Room</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 15 }}>Share the code with traders you want to compete against.</p>
            <button className="btn" onClick={() => setJoined('XMC-' + Math.random().toString(36).slice(2, 8).toUpperCase())}>
              Generate Room Code
            </button>
            {joined && <p style={{ marginTop: 20, fontSize: 18, fontWeight: 600 }}>{joined}</p>}
          </div>

          <div className="glass" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Join Room</h2>
            <input
              placeholder="Enter room code"
              value={code}
              onChange={e => setCode(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <button className="btn" onClick={() => code && setJoined(code)}>
              Join
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

const nav: React.CSSProperties = { padding: '12px 16px', borderRadius: 10, color: 'var(--muted)', textDecoration: 'none', fontSize: 15 }
const navActive: React.CSSProperties = { ...nav, background: 'rgba(255,255,255,0.08)', color: 'var(--text)' }
