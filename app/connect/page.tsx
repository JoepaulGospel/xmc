'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ConnectPage() {
  const [form, setForm] = useState({ login: '', password: '', server: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Connecting to broker...')

    try {
      const res = await fetch('/api/connect-mt5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()

      if (data.accountId) {
        setStatus('Connected successfully')
        // TODO: save accountId + apiKey to user's profile in Supabase
      } else {
        setStatus(data.error || 'Connection failed')
      }
    } catch {
      setStatus('Network error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>← Dashboard</Link>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: '16px 0 8px' }}>Connect Trading Account</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Enter your MT5 / Exness account details</p>

        <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            name="mt5-login"
            autoComplete="off"
            placeholder="Account number"
            value={form.login}
            onChange={e => setForm({ ...form, login: e.target.value })}
            required
          />
          <input
            name="mt5-password"
            type="password"
            autoComplete="new-password"
            placeholder="Read-only password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            name="mt5-server"
            autoComplete="off"
            placeholder="Server (e.g. Exness-MT5Real8)"
            value={form.server}
            onChange={e => setForm({ ...form, server: e.target.value })}
            required
          />
          <button className="btn" type="submit" style={{ marginTop: 8 }}>
            Connect
          </button>
        </form>

        {status && <p style={{ marginTop: 20, textAlign: 'center', color: status.includes('success') ? 'var(--green)' : 'var(--muted)' }}>{status}</p>}

        <p style={{ marginTop: 32, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          This is your broker login, not your XMC account.
        </p>
      </div>
    </div>
  )
}
