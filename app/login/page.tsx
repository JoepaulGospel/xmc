'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setStatus(error.message)
      setLoading(false)
      return
    }

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
          <button className="btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {status && <p style={{ marginTop: 16, color: 'var(--red)', textAlign: 'center', fontSize: 14 }}>{status}</p>}

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
          No account? <Link href="/signup" style={{ color: 'var(--accent)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
