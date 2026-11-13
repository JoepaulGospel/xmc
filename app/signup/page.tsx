'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Account created. Redirecting to login...')
    // TODO: real auth with Supabase
    setTimeout(() => router.push('/login'), 800)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 400, padding: 40 }}>
        <Link href="/" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>← Home</Link>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: '16px 0 8px' }}>Create account</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 28 }}>Start tracking your trades</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn" type="submit" style={{ marginTop: 8 }}>Sign up</button>
        </form>

        {status && <p style={{ marginTop: 16, color: 'var(--green)', textAlign: 'center' }}>{status}</p>}

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent)' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}
