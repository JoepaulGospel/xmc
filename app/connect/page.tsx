'use client'

import { useState } from 'react'

export default function ConnectPage() {
  const [form, setForm] = useState({ login: '', password: '', server: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Connecting...')
    // TODO: call MetaApi + save to Supabase
    setTimeout(() => setStatus('Account connected (demo)'), 1500)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, marginBottom: 8 }}>Connect Account</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Use your MT5 / Exness read-only login</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <input
            placeholder="Account number"
            value={form.login}
            onChange={e => setForm({ ...form, login: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Read-only password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            placeholder="Server (e.g. Exness-MT5Real8)"
            value={form.server}
            onChange={e => setForm({ ...form, server: e.target.value })}
            required
          />
          <button className="btn" type="submit" style={{ marginTop: 8 }}>
            Connect
          </button>
        </form>

        {status && <p style={{ marginTop: 20, textAlign: 'center', color: 'var(--muted)' }}>{status}</p>}

        <p style={{ marginTop: 32, fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
          Your password is used only to connect via MetaApi and is never stored in plain text.
        </p>
      </div>
    </div>
  )
}
