'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'

export default function Signup() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setStatus(error.message)
      setLoading(false)
      return
    }

    setStatus('Account created. Check your email to confirm, then log in.')
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="glass" style={{ width: '100%', maxWidth: 400, padding: 40 }}>
        <Link href="/" style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none' }}>← Home</Link>
        <h1 style={{ fontSize: 32, fontWeight: 600, margin: '16px 0 8px' }}>Create account</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 28 }}>Start tracking your trades</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
          <button className="btn" type="submit" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </form>

        {status && <p style={{ marginTop: 16, color: status.includes('created') ? 'var(--green)' : 'var(--red)', textAlign: 'center', fontSize: 14 }}>{status}</p>}

        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent)' }}>Log in</Link>
        </p>
      </div>
    </div>
  )
}
