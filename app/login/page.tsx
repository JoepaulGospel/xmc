'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: real auth with Supabase
    router.push('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 400, padding: 40 }}>
        <Link href="/" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>← Home</Link>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: '16px 0 8px' }}>Log in</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 28 }}>Welcome back</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button className="btn" type="submit" style={{ marginTop: 8 }}>Log in</button>
        </form>

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
          No account? <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
